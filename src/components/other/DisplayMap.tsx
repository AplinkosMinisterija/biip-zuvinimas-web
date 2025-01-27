import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import { useAppSelector } from '../../state/hooks';
import { device } from '../../styles';
import api from '../../utils/api';
import { handleAlert } from '../../utils/functions';
import { useIsFreelancer } from '../../utils/hooks';
import { slugs } from '../../utils/routes';
import { Url } from '../../utils/texts';
import FishStockingTag from './FishStockingTag';
import Icon from './Icon';
import LoaderComponent from './LoaderComponent';
import FishStockingStatusIcon from './StatusIcon';

const DisplayMap = () => {
  const cookies = new Cookies();
  const [loading, setLoading] = useState(true);
  const isFreelancer = useIsFreelancer();
  const iframeRef = useRef<any>(null);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user?.userData);

  const src = `${Url.FISH_STOCKING}?${
    !isFreelancer ? `tenantId=${cookies.get('profileId')}` : `userId=${user.id}`
  }`;

  const handleLoadMap = () => {
    setLoading(false);
  };

  const fishStockingMutation = useMutation({
    mutationFn: (id: string) => api.getFishStocking(id),
    onError: () => {
      handleAlert();
    },
  });

  const currentStocking = fishStockingMutation?.data;
  const fishStockingMutationMutateAsync = fishStockingMutation.mutateAsync;
  const handleSaveGeom = useCallback(
    async (event: any) => {
      const stocking = event?.data?.mapIframeMsg?.click[0];
      if (!stocking?.id) return;

      await fishStockingMutationMutateAsync(stocking.id);
    },
    [fishStockingMutationMutateAsync],
  );

  useEffect(() => {
    window.addEventListener('message', handleSaveGeom);
    return () => window.removeEventListener('message', handleSaveGeom);
  }, [handleSaveGeom]);

  return (
    <>
      {loading ? <LoaderComponent /> : null}
      <MapContainer>
        {fishStockingMutation.data && (
          <MapModal>
            <ModalContainer>
              {fishStockingMutation.isPending ? (
                <LoaderComponent />
              ) : (
                <>
                  <IconContainer
                    onClick={() => {
                      fishStockingMutation.reset();
                    }}
                  >
                    <StyledIcon name="close" />
                  </IconContainer>
                  <ItemContainer>
                    <Container
                      onClick={() => navigate(slugs.fishStocking(`${currentStocking?.id}`))}
                    >
                      <FishStockingStatusIconContainer>
                        <FishStockingStatusIcon status={currentStocking?.status} />
                      </FishStockingStatusIconContainer>
                      <Content>
                        <FirstRow>
                          <FishStockerLabel>
                            {currentStocking?.assignedTo
                              ? `${currentStocking.assignedTo?.firstName} ${currentStocking.assignedTo?.lastName}`
                              : 'Nežinomas žuvintojas'}
                          </FishStockerLabel>
                          <FishStockingTag status={currentStocking?.status} />
                        </FirstRow>
                        <SecondRow>{currentStocking?.location?.name}</SecondRow>
                        <ThirdRow>
                          <FirstRowFirstColumn>
                            <CalendarIcon name={'calendar'} />
                            <DateText>
                              {currentStocking?.eventTime
                                ? format(new Date(currentStocking?.eventTime), 'yyyy-MM-dd HH:mm')
                                : 'Nežinoma data'}
                            </DateText>
                          </FirstRowFirstColumn>
                        </ThirdRow>
                      </Content>
                    </Container>
                  </ItemContainer>
                </>
              )}
            </ModalContainer>
          </MapModal>
        )}

        <InnerContainer>
          <StyledIframe
            ref={iframeRef}
            src={src}
            width={'100%'}
            height={'100%'}
            style={{ border: 0 }}
            allowFullScreen={true}
            onLoad={handleLoadMap}
            aria-hidden="false"
            tabIndex={1}
          />
        </InnerContainer>
      </MapContainer>
    </>
  );
};

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const FishStockingStatusIconContainer = styled.div`
  align-self: flex-start;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const FishStockerLabel = styled.div`
  color: #121a558f;
  font-weight: 600;
  font-size: 1.4rem;
  margin: 4px 0px 8px 0px;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
  height: 19px;
  align-items: center;
`;

const FirstRowFirstColumn = styled.div`
  display: flex;
`;

const SecondRow = styled.div`
  display: flex;
  color: #121a55;
  align-items: center;
  font-weight: bold;
  font-size: 1.6rem;
  margin-bottom: 4px;
`;

const ThirdRow = styled.div`
  display: flex;
`;

const Content = styled.div`
  margin-top: 4px;
  margin-left: 16px;
  width: 100%;
`;

const DateText = styled.span`
  color: ${({ theme }) => theme.colors.tertiary};
  vertical-align: middle;
  white-space: nowrap;
  font-weight: 600;
  font-size: 1.4rem;
  line-height: 19px;
`;

const CalendarIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.secondary} !important;
  vertical-align: middle;
  margin-right: 10px;
  font-size: 1.8rem;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
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
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

export default DisplayMap;
