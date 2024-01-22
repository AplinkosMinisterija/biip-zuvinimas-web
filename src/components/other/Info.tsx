import styled from 'styled-components';
import { device } from '../../styles';
import { FishStocking, Info, Tenant, User } from '../../utils/types';
import Icon from '../other/Icon';
import AdditionalInfo from './AdditionalInfo';

export interface FishStockingInfoProps {
  fishStocking?: FishStocking;
  info?: Info;
  tenant?: Tenant;
  additionalInfo?: boolean;
  user?: User;
  onUpdatePermission?: (status: string) => void;
}

export interface UpdatePermissionProps {
  id: string;
  isTenant: boolean;
  permission: string;
}

const FishStockingInfo = ({
  fishStocking,
  info,
  additionalInfo,
  tenant,
  user,
}: FishStockingInfoProps) => {
  return (
    <Container>
      <HeaderRow>
        <Location>
          {fishStocking?.location?.name || tenant?.name || `${user?.firstName} ${user?.lastName}`}
        </Location>
      </HeaderRow>
      <InfoPeaceRow>
        {info?.map((items, index) => {
          if (index >= 3) return <></>;

          return (
            <InfoPeacePair user={!!user} tenant={!!tenant} key={`fish_stocking_info_${index}`}>
              {items?.map((item, index) => {
                if (!item) return <></>;

                return (
                  <InfoConainer key={index}>
                    <InfoPaceContainer user={!!user} tenant={!!tenant}>
                      <StyledIcon name={item.type} />
                      <InfoPeaceColumn>
                        <Label>{item?.label}</Label>
                        <InfoPeaceLabel>{item?.value}</InfoPeaceLabel>
                      </InfoPeaceColumn>
                    </InfoPaceContainer>
                  </InfoConainer>
                );
              })}
            </InfoPeacePair>
          );
        })}
      </InfoPeaceRow>
      {additionalInfo ? <AdditionalInfo fishStocking={fishStocking!} /> : null}
    </Container>
  );
};

const Label = styled.label`
  color: #b3b5c4;
  font-size: 1.2rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Container = styled.div`
  margin-top: 20px;
  padding: 27px 32px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  @media ${device.mobileL} {
    border-radius: 0 0 40px 40px;
    padding: 16px 16px 27px 16px;
  }
  background-image: url('/backgroundImageRightTop.png');
  background-position: top right;
  background-repeat: no-repeat;
`;

const InfoConainer = styled.div`
  position: relative;
  top: 0;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media ${device.mobileL} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Location = styled.span`
  font-size: 3.2rem;
  color: #fff;
  font-weight: bold;
`;

const StyledIcon = styled(Icon)`
  font-size: 1.9rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-right: 8px;
  margin-bottom: 2px;
`;

const InfoPaceContainer = styled.div<{ tenant: boolean; user: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto 0;
  padding: ${({ user }) => (user ? '8px 43px 8px 0px' : '8px 0')};
  @media ${device.mobileL} {
    width: 100%;
    width: ${({ tenant, user }) => (tenant || user ? '100%' : '200px')};
  }
`;

const InfoPeacePair = styled.div<{ tenant: boolean; user: boolean }>`
  display: flex;
  flex-direction: ${({ user }) => (user ? 'row' : 'column')};
  color: #fff;
  flex: 1;
  max-width: ${({ tenant }) => (tenant ? '100%' : '350px')};
  min-width: ${({ tenant }) => (tenant ? '225px' : '250px')};
  @media ${device.mobileL} {
    flex-direction: ${({ tenant, user }) => (tenant || user ? 'column' : 'row')};
    flex-wrap: wrap;
    width: 100%;
  }
  @media ${device.mobileS} {
    flex-direction: column;
  }
`;

const InfoPeaceRow = styled.div`
  display: flex;
  color: #fff;
  flex-direction: row;
  flex: 1;
  flex-wrap: wrap;
`;

const InfoPeaceColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
`;

const InfoPeaceLabel = styled.span`
  font-size: 1.6rem;
  color: #f3f3f7;
`;

export default FishStockingInfo;
