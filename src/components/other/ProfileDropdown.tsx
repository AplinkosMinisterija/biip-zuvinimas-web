import { map } from "lodash";
import { useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { handleLogout, handleSelectProfile } from "../../utils/functions";
import { useGetCurrentProfile } from "../../utils/hooks";
import { buttonsTitles } from "../../utils/texts";

import Avatar from "./Avatar";
import Icon from "./Icon";

const UserSwitchMenu = () => {
  const user = useAppSelector((state) => state.user?.userData);
  const currentProfile = useGetCurrentProfile();
  const dispatch = useAppDispatch();
  const [showSelect, setShowSelect] = useState(false);

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSelect(false);
    }
  };
  return (
    <Container tabIndex={1} onBlur={handleBlur}>
      <div
        onClick={() => {
          setShowSelect(!showSelect);
        }}
      >
        <Avatar name={user?.firstName!} surname={user?.lastName!} />
      </div>
      {showSelect && (
        <InnerContainer>
          {map(user?.profiles, (profile: any, index: number) => {
            return (
              <TopRow
                onClick={() => handleSelectProfile(profile.id)}
                key={`profile-${index}`}
              >
                <StyledAvatar
                  active={currentProfile?.id === profile?.id}
                  name={user?.firstName!}
                  surname={user?.lastName!}
                />
                <Column>
                  <FullNameDiv>{`${profile?.firstName || ""} ${
                    profile?.lastName || ""
                  }`}</FullNameDiv>
                  {profile?.name && <TenantName>{profile?.name}</TenantName>}
                  {profile?.code && (
                    <InfoRow>
                      <InfoIcon name="info"></InfoIcon>
                      <InfoText>{profile?.code}</InfoText>
                    </InfoRow>
                  )}
                  {!!user?.phone && (
                    <InfoRow>
                      <InfoIcon name="phone"></InfoIcon>
                      <InfoText>{user?.phone}</InfoText>
                    </InfoRow>
                  )}
                  {(!!user?.email || user?.email) && (
                    <InfoRow>
                      <InfoIcon name="userEmail"></InfoIcon>
                      <InfoText>{user?.email}</InfoText>
                    </InfoRow>
                  )}
                </Column>
              </TopRow>
            );
          })}
          <Hr />
          <BottomRow onClick={() => handleLogout(dispatch)}>
            <StyledLogoutIcon name="exit" />
            <LogoutText>{buttonsTitles.logout}</LogoutText>
          </BottomRow>
        </InnerContainer>
      )}
    </Container>
  );
};

const StyledLogoutIcon = styled(Icon)`
  color: rgb(122, 126, 159);
  font-size: 2.5rem;
`;

const InnerContainer = styled.div`
  position: absolute;
  top: 50px;
  right: 0px;
  z-index: 4;
  min-width: 288px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 2px 16px #121a5529;
  border-radius: 4px;
  padding: 16px;
`;

const Container = styled.div`
  position: relative;
`;

const InfoIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.secondary};
  margin-right: 9.33px;
`;

const InfoRow = styled.div`
  margin-top: 8px;
  display: flex;
`;

const LogoutText = styled.div`
  font: normal normal medium 1.6rem/24px;
  color: #121a55;
  margin-left: 12px;
`;

const InfoText = styled.div`
  font: normal normal normal 1.2rem/17px;
  color: #7a7e9f;

  max-width: 180px;
`;

const StyledAvatar = styled(Avatar)`
  margin: 0 16px 0 0;
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 220px;
`;

const TopRow = styled.div`
  display: flex;
  min-width: 288px;
  margin-bottom: 16px;
  cursor: pointer;
`;
const Hr = styled.div`
  border-bottom: 1px solid #121a553d;
  opacity: 1;
  margin: 16px -16px;
`;

const BottomRow = styled.div`
  display: flex;
  cursor: pointer;
`;

const FullNameDiv = styled.div`
  font: normal normal bold 1.6rem/22px;
  color: #121a55;
  margin-top: 10px;
  margin-bottom: 4px;
`;

const TenantName = styled.div`
  font: normal normal bold 1.4rem/22px;
  color: #7a7e9f;
  margin-bottom: 4px;
`;

export default UserSwitchMenu;
