import { format } from 'date-fns';
import styled from 'styled-components';
import { FishStockingStatus } from '../../utils/constants';
import { useGetCurrentProfile } from '../../utils/hooks';
import { FishStocking } from '../../utils/types';
import CustomTag from '../other/CustomTag';
import Icon from '../other/Icon';
import FishStockingTag from './FishStockingTag';
import FishStockingStatusIcon from './StatusIcon';

export interface FishStockingItemProps {
  fishStocking: FishStocking;
  onClick: () => void;
}

const EventItem = ({ fishStocking, onClick }: FishStockingItemProps) => {
  const status = fishStocking.status || FishStockingStatus.UPCOMING;

  const currentProfile = useGetCurrentProfile();

  const showTenant =
    !!fishStocking.stockingCustomer &&
    fishStocking.stockingCustomer.id !== fishStocking.tenant?.id &&
    currentProfile?.id === fishStocking.stockingCustomer.id;

  const fishStocker = fishStocking.reviewedBy || fishStocking.assignedTo || fishStocking.createdBy;

  return (
    <Container onClick={onClick}>
      <StatusContainer>
        <StatusIcon status={status} />
      </StatusContainer>
      <Content>
        <FirstRow>
          <Titles>
            {showTenant && (
              <StyledText>
                {fishStocking.tenant ? fishStocking.tenant.name : 'Fizinis asmuo'}
              </StyledText>
            )}
            <Location>
              {`${fishStocking?.location?.name || 'Telkinys'}, ${
                fishStocking?.location?.municipality?.name || 'Savivaldybė'
              }`}
            </Location>
          </Titles>
          <FishStockingTag status={status} />
        </FirstRow>

        <SecondRow>
          <IconTextWraper>
            <StyledIcon name="user" />
            <StyledText>{`${fishStocker?.firstName?.[0]}.${fishStocker?.lastName}`}</StyledText>
          </IconTextWraper>
          <IconTextWraper>
            <StyledIcon name="calendar" />
            <StyledText>{format(new Date(fishStocking?.eventTime!), 'yyyy-MM-dd H:mm')}</StyledText>
          </IconTextWraper>
          {(fishStocking.batches || []).map((item: any, index) => (
            <StyledCustomTag
              key={`stockings_list_fish_type_${index}`}
              text={item.fishType?.label || ''}
            />
          ))}
        </SecondRow>
      </Content>
    </Container>
  );
};

const Container = styled.a`
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 8px 16px #121a5514;
  border: 1px solid #b3b5c48f;
  border-radius: 8px;
  opacity: 1;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px 0;
  margin: 8px 0;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const Titles = styled.div`
  display: flex;
  flex-direction: column;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusContainer = styled.div`
  display: flex;
  height: 40px;
`;

const IconTextWraper = styled.div``;

const StatusIcon = styled(FishStockingStatusIcon)<{ status: string }>`
  margin: auto 18px auto 15px;
`;

const Content = styled.div`
  flex: 1;
  flex-direction: column;
  margin: auto 0;
  overflow: hidden;
`;

const FirstRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  align-items: flex-start;
  padding-right: 8px;
`;

const Location = styled.span`
  display: inline-block;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const SecondRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 6px;
  overflow: hidden;
  padding-right: 8px;
`;

const StyledText = styled.span`
  color: ${({ theme }) => theme.colors.tertiary};
  vertical-align: middle;
  margin: auto 8px auto 0;
  white-space: nowrap;
  font-size: 1.4rem;
`;

const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.secondary};
  vertical-align: middle;
  margin-right: 4px;
  font-size: 1.9rem;
`;

const StyledCustomTag = styled(CustomTag)`
  margin-top: 6px;
`;

export default EventItem;
