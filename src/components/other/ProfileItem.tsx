import styled from 'styled-components';
import Avatar from '../other/Avatar';

export interface FishStockerItemProps {
  fisher: {
    name: string;
    lastName: string;
    email?: string;
    freelancer: boolean;
  };
  onClick: () => void;
  icon?: JSX.Element;
}

const ProfileItem = ({ fisher, onClick }: FishStockerItemProps) => {
  const showStatus = false;

  const fullName = `${fisher.name} ${fisher.lastName}`;

  return (
    <Container status={showStatus} onClick={() => onClick()}>
      <StatusContainer>
        {showStatus ? <StatusMarker status={showStatus} /> : null}
        <StyledAvatar
          name={fisher.name}
          surname={fisher.lastName}
          status={showStatus}
          icon={fisher.freelancer && <BiipIcon src="/b-icon.png" />}
        />
      </StatusContainer>
      <Content>
        <FirstRow>
          <TenantName>{fullName}</TenantName>
        </FirstRow>
        <SecondRow>
          <TenantCode>{fisher.email}</TenantCode>
        </SecondRow>
      </Content>
    </Container>
  );
};

const Container = styled.a<{ status: boolean }>`
  background: #ffffff 0% 0% no-repeat padding-box;
  cursor: pointer;
  box-shadow: 0px 8px 16px #121a5514;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  opacity: 1;
  width: 100%;
  max-width: 400px;
  display: flex;
  vertical-align: middle;
  padding: 12px 0;
  margin: 8px 0;
  border: 1px solid ${({ theme, status }) => (status ? theme.colors.error : theme.colors.border)};

  &:hover,
  &:focus {
    border: 1px solid #13c9e7;
    box-shadow: 0 0 0 4px rgb(19 201 231 / 20%);
    background: rgb(19 201 231 / 4%);
  }
`;

const StatusContainer = styled.div`
  display: flex;
`;

const StatusMarker = styled.div<{ status: boolean }>`
  width: 4px;
  height: 40px;
  background-color: ${({ theme, status }) => (status ? theme.colors.pending : theme.colors.error)};
  box-shadow: 0px 30px 60px #121a5514;
  border-radius: 0px 8px 8px 0px;
  opacity: 1;
  margin-bottom: auto;
  margin-top: auto;
`;

const StyledAvatar = styled(Avatar)<{ status: boolean }>`
  margin: auto 18px auto 15px;
  ${({ status, theme }) => (status ? `background-color: ${theme.colors.error}` : '')}
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
  align-items: center;
  padding-right: 16px;
  justify-content: space-between;
`;

const TenantName = styled.span`
  display: inline-block;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 16px;
  color: ${({ theme }) => theme.colors.primary};
`;

const SecondRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 22px;
  align-items: center;
  margin-top: 4px;
`;

const TenantCode = styled.div`
  font: normal normal 600 1.4rem/19px;
`;

const BiipIcon = styled.img`
  height: 24px;
  width: 24px;
`;

export default ProfileItem;
