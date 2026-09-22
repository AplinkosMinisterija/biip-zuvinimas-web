import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import { buttonsTitles, mapTexts, Url } from '../../utils/texts';
import Icon from './Icon';
import { FishStockingLocation, GeomFeatureCollection } from '../../utils/types';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api';
import { Button } from '@aplinkosministerija/design-system';
import { checkIfPointChanged, handleSuccess, parseGeom } from '../../utils/functions';
import LoaderComponent from './LoaderComponent';

export interface MapProps {
  height?: string;
  onSave?: (params: { geom: any; data: any }) => void;
  onClose?: () => void;
  error?: string;
  queryString?: string;
  manual?: boolean;
  resolveGeom?: GeomFeatureCollection;
  value?: any;
  iframeRef: any;
  disabled?: boolean;
  showMobileMap?: boolean;
}

const getUserObjects = (event: MessageEvent): string | undefined => {
  const data = event.data as { mapIframeMsg?: { userObjects?: unknown } } | undefined;
  const userObjects = data?.mapIframeMsg?.userObjects;
  return typeof userObjects === 'string' ? userObjects : undefined;
};

const Map = ({
  height,
  onSave,
  onClose,
  value,
  iframeRef,
  disabled,
  manual,
  resolveGeom,
  showMobileMap,
}: MapProps) => {
  const queryClient = useQueryClient();
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [locations, setLocations] = useState<FishStockingLocation[]>([]);
  const [manualMunicipality, setManualMunicipality] =
    useState<FishStockingLocation['municipality']>();
  const [geom, setGeom] = useState<GeomFeatureCollection>();
  const resolvedPointRef = useRef<string | undefined>(undefined);
  const [mapLoading, setMapLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const src = (preview?: boolean) => `${Url.DRAW}${preview ? `?preview=true` : ''}`;

  const resolveMunicipality = (selected: string) =>
    queryClient.fetchQuery({
      queryKey: ['municipality', selected],
      queryFn: () => api.getMunicipality({ geom: selected }),
    });

  const resolvePoint = async (pointGeom: GeomFeatureCollection) => {
    if (disabled || !onSave) return;
    const selected = JSON.stringify(pointGeom);
    setLoading(true);
    setGeom(pointGeom);
    try {
      // the user already said UETK does not list this water body, so looking the
      // point up there would only overwrite the name they are typing
      if (manual) {
        const municipality = await resolveMunicipality(selected);
        setManualMunicipality(municipality?.id ? municipality : undefined);
        onSave({ geom: pointGeom, data: municipality?.id ? { name: '', municipality } : null });
        if (municipality?.id) {
          handleSuccess('Sėkmingai pasirinkta žuvinimo vieta');
        } else {
          setLocations([]);
          setShowLocationPopup(true);
        }
        return;
      }

      setShowLocationPopup(true);
      const items = await queryClient.fetchQuery({
        queryKey: ['locations', selected],
        queryFn: () => api.getLocations({ geom: selected }),
      });
      const validItems = items.filter((item) => !!item?.municipality?.id);

      if (validItems.length === 1) {
        setShowLocationPopup(false);
        onSave({ geom: pointGeom, data: validItems[0] });
        handleSuccess('Sėkmingai pasirinkta žuvinimo vieta');
      } else if (validItems.length === 0) {
        const municipality = await resolveMunicipality(selected);
        setLocations([]);
        setManualMunicipality(municipality?.id ? municipality : undefined);
        onSave({ geom: pointGeom, data: municipality?.id ? { name: '', municipality } : null });
      } else {
        setLocations(validItems);
      }
    } catch (e) {
      setShowLocationPopup(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReceivedMapMessage = async (event: MessageEvent) => {
    const selected = getUserObjects(event);
    if (disabled || !onSave || !selected || event.origin !== import.meta.env.VITE_MAPS_HOST) return;
    const postMessageGeom = parseGeom(selected);
    if (!postMessageGeom || !checkIfPointChanged(postMessageGeom, geom)) return;
    await resolvePoint(postMessageGeom);
  };

  useEffect(() => {
    window.addEventListener('message', handleReceivedMapMessage);
    return () => {
      window.removeEventListener('message', handleReceivedMapMessage);
    };
  }, [geom, disabled]);

  const closeLocationPopup = () => {
    setShowLocationPopup(false);
    setLocations([]);
    setManualMunicipality(undefined);
  };

  const handleChangedValue = () => {
    if (value && checkIfPointChanged(value, geom)) {
      setGeom(value);
      iframeRef?.current?.contentWindow?.postMessage(JSON.stringify({ geom: value }), '*');
    }
  };

  useEffect(() => {
    if (!mapLoading && iframeRef) {
      handleChangedValue();
    }
  }, [value, iframeRef]);

  // coordinates typed by hand arrive on their own prop, so loading a saved
  // stocking never re-resolves and overwrites its water body
  useEffect(() => {
    if (!resolveGeom) return;
    const point = JSON.stringify(resolveGeom);
    if (resolvedPointRef.current === point) return;
    resolvedPointRef.current = point;
    resolvePoint(resolveGeom);
    // resolvePoint closes over onSave, which the parent passes inline; listing it
    // would re-run this on every parent render. The ref above is the real guard.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolveGeom]);

  const renderNotFound = () => (
    <NotFoundContainer>
      <Title>{mapTexts.waterBodyNotFound}</Title>
      {!!manualMunicipality && <Description>{mapTexts.enterWaterBodyManually}</Description>}
    </NotFoundContainer>
  );

  const renderContent = () => (
    <>
      <StyledIframe
        allow="geolocation *"
        ref={iframeRef}
        src={src(disabled)}
        width={'100%'}
        height={showLocationPopup ? '100%' : `${height || '230px'}`}
        style={{ border: 0 }}
        allowFullScreen={true}
        onLoad={() => {
          setTimeout(() => {
            setMapLoading(false);
            handleChangedValue();
          }, 1000);
        }}
        aria-hidden="false"
        tabIndex={1}
      />
      {showLocationPopup && (
        <MapModal>
          {loading ? (
            <LoaderComponent />
          ) : (
            <ModalContainer>
              <>
                <IconContainer onClick={closeLocationPopup}>
                  <StyledIcon name="close" />
                </IconContainer>
                <ItemContainer>
                  {locations.length === 0
                    ? renderNotFound()
                    : locations?.map((location, index) => (
                        <Item key={`${location.cadastral_id}_${index}`}>
                          <TitleContainer>
                            <Title>{location?.name}</Title>
                            <Description>{`${location?.cadastral_id}, ${location?.municipality?.name}`}</Description>
                          </TitleContainer>
                          <PopupButton
                            onClick={() => {
                              if (onSave && geom) {
                                onSave({ geom, data: location });
                                setShowLocationPopup(false);
                                setLocations([]);
                                handleSuccess('Sėkmingai pasirinkta žuvinimo vieta');
                              }
                            }}
                          >
                            {buttonsTitles.select}
                          </PopupButton>
                        </Item>
                      ))}
                </ItemContainer>
              </>
            </ModalContainer>
          )}
        </MapModal>
      )}
    </>
  );

  return (
    <>
      <Container $show={showMobileMap}>
        <CloseWrapper>
          <CloseButton
            onClick={() => {
              if (onClose) {
                return onClose();
              }
              setShowLocationPopup(!showLocationPopup);
            }}
          >
            <StyledIcon name="close" />
          </CloseButton>
        </CloseWrapper>
        <InnerContainer>{renderContent()}</InnerContainer>
      </Container>
    </>
  );
};

const Container = styled.div<{ $show?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  @media ${device.mobileL} {
    position: absolute;
    top: 0;
    left: 0;
    display: ${({ $show }) => ($show ? 'flex' : 'none')};
  }
`;

const IconContainer = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
`;

const StyledIcon = styled(Icon)`
  font-size: 2rem;
  color: #6b7280;
`;

const MapModal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  background-color: #0b1b607a;
`;

const InnerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media ${device.mobileL} {
    padding: 0;
  }
`;

const StyledIframe = styled.iframe``;

const ModalContainer = styled.div`
  background-color: white;
  padding: 16px;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  position: relative;
  height: fit-content;
  min-width: 440px;
  flex-basis: auto;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media ${device.mobileL} {
    min-width: 100%;
  }
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

const Description = styled.div`
  font-size: 1.3rem;
`;

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 1.9rem;
  font-weight: bold;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseWrapper = styled.div`
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 888;
  cursor: pointer;
  padding: 15px;
  @media ${device.mobileL} {
    display: flex;
  }
`;

const CloseButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  margin-left: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0.4rem;
  height: 25px;
  width: 25px;
`;

const PopupButton = styled(Button)`
  width: fit-content;
`;

export default Map;
