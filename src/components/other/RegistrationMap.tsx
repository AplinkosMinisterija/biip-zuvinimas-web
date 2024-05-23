import { useMediaQuery } from '@material-ui/core';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import { buttonsTitles, Url } from '../../utils/texts';
import Button from '../buttons/Button';
import Icon from './Icon';
import LoaderComponent from './LoaderComponent';
import { FishStockingLocation } from '../../utils/types';
import { useQueryClient } from 'react-query';
import api from '../../utils/api';

export interface MapProps {
  height?: string;
  onSave?: (params: { geom: any; data: any }) => void;
  onClose?: () => void;
  error?: string;
  queryString?: string;
  value?: any;
  display: boolean;
  iframeRef: any;
  disabled?: boolean;
}

const Map = ({ height, onSave, onClose, value, display, iframeRef, disabled }: MapProps) => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [locations, setLocations] = useState<FishStockingLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery(device.mobileL);
  const [geom, setGeom] = useState<any>();

  const pointChanged = (geom1, geom2) => {
    const coordinates1 = geom1?.features?.[0]?.geometry?.coordinates?.map((num) => Math.trunc(num));
    const coordinates2 = geom2?.features?.[0]?.geometry?.coordinates?.map((num) => Math.trunc(num));
    return coordinates1?.[0] !== coordinates2?.[0] || coordinates1?.[1] !== coordinates2?.[1];
  };

  const src = `${Url.DRAW}`;

  const sendMapMessage = () => {};

  const handleReceivedMapMessage = async (event: any) => {
    if (disabled) return;
    const selected = event?.data?.mapIframeMsg?.selected;
    if (!onSave) return;
    if (event.origin === import.meta.env.VITE_MAPS_HOST && selected) {
      const { geom: postMessageGeom, items } = selected;
      if (!postMessageGeom) return;
      const geomObject = JSON.parse(postMessageGeom);

      const geomChanged = pointChanged(geomObject, geom);
      if (geomChanged) {
        setGeom(geomObject);
        const municipality = await queryClient.fetchQuery(['municipality', postMessageGeom], () =>
          api.getMunicipality({ geom: postMessageGeom }),
        );
        const mappedItems: FishStockingLocation[] =
          items?.map((item: any) => ({
            name: item.title,
            cadastral_id: item.cadastralId,
            municipality: municipality,
          })) || [];
        if (items.length === 1) {
          onSave({ geom: geomObject, data: { ...mappedItems[0], municipality } });
        } else if (items.length === 0) {
          onSave({ geom: undefined, data: undefined });
          setLocations([]);
          setShowModal(true);
        } else {
          setLocations(mappedItems);
          setShowModal(true);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleReceivedMapMessage);
    return () => {
      window.removeEventListener('message', handleReceivedMapMessage);
    };
  }, [geom, disabled]);

  useEffect(() => {
    setLoading(true);
    if (pointChanged(value, geom)) {
      console.log('should update geom', value);
      setGeom(value);
      iframeRef?.current?.contentWindow?.postMessage(JSON.stringify({ geom: value }), '*');
    }
    setLoading(false);
  }, [value]);

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <Container $display={display}>
          {isMobile && (
            <StyledButton
              popup
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (onClose) {
                  return onClose();
                }
                setShowModal(!showModal);
              }}
            >
              <StyledIconContainer>
                <StyledIcon name={'close'} />
              </StyledIconContainer>
            </StyledButton>
          )}

          <InnerContainer>
            {showModal && (
              <MapModal>
                <ModalContainer>
                  <>
                    <IconContainer
                      onClick={() => {
                        setShowModal(false);
                        setLocations([]);
                      }}
                    >
                      <StyledIcon name="close" />
                    </IconContainer>
                    <ItemContainer>
                      {locations.length === 0
                        ? 'Nerastas telkinys'
                        : locations?.map((location, index) => (
                            <Item key={`${location.cadastral_id}_${index}`}>
                              <TitleContainer>
                                <Title>{location?.name}</Title>
                                <Description>{`${location?.cadastral_id}, ${location?.municipality?.name}`}</Description>
                              </TitleContainer>
                              <Button
                                onClick={() => {
                                  if (onSave && geom) {
                                    onSave({ geom, data: location });
                                    setShowModal(false);
                                    setLocations([]);
                                  }
                                }}
                              >
                                {buttonsTitles.select}
                              </Button>
                            </Item>
                          ))}
                    </ItemContainer>
                  </>
                </ModalContainer>
              </MapModal>
            )}

            <StyledIframe
              allow="geolocation *"
              ref={iframeRef}
              src={src}
              width={'100%'}
              height={showModal ? '100%' : `${height || '230px'}`}
              style={{ border: 0 }}
              allowFullScreen={true}
              onLoad={sendMapMessage}
              aria-hidden="false"
              tabIndex={1}
            />
          </InnerContainer>
        </Container>
      )}
    </>
  );
};

const Container = styled.div<{ $display: boolean }>`
  width: 100%;
  height: 100%;
  display: ${({ $display }) => ($display ? 'flex' : 'none')};
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
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #0b1b607a;
  top: 0;
  left: 0;
  overflow-y: auto;
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

const StyledIframe = styled.iframe<{
  height: string;
  width: string;
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`;

const ModalContainer = styled.div<{ width?: string }>`
  background-color: white;
  padding: 16px;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  position: relative;
  height: fit-content;
  min-width: 440px;
  width: ${({ width }) => width};
  background-color: white;
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

const StyledButton = styled(Button)<{ popup: boolean }>`
  position: absolute;
  z-index: 10;
  top: 100px;
  right: ${({ popup }) => (popup ? 28 : 11)}px;
  min-width: 28px;

  height: 28px;
  @media ${device.mobileL} {
    top: 180px;
    right: 10px;
  }
  button {
    border-color: #e5e7eb;
    background-color: white !important;
    width: 30px;
    height: 30px;
    padding: 0;
    box-shadow: 0px 18px 41px #121a5529;
  }
`;

const StyledIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Map;
