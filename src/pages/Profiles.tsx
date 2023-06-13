import { useState } from "react";
import styled from "styled-components";
import { LoginLayout } from "../components/Layouts/Login";
import Icon from "../components/other/Icon";
import Loader from "../components/other/Loader";
import ProfileItem from "../components/other/ProfileItem";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { handleLogout, handleSelectProfile } from "../utils/functions";
import { buttonsTitles, formLabels } from "../utils/texts";

const Profiles = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state?.user?.userData);
  const [loading, setLoading] = useState(false);

  const handleSelect = (profileId: string) => {
    setLoading(true);
    handleSelectProfile(profileId);
  };

  if (loading) return <Loader />;

  return (
    <LoginLayout>
      <Container>
        <Title>{formLabels.selectProfile}</Title>
        {user.profiles?.map((profile) => (
          <InnerContainer key={profile?.id}>
            <ProfileItem
              fisher={{
                name: user?.firstName!,
                lastName: user?.lastName!,
                email: profile?.freelancer ? user?.email : profile?.name,
                freelancer: profile?.freelancer
              }}
              onClick={() => handleSelect(profile?.id)}
            />
          </InnerContainer>
        ))}
        <Row onClick={() => handleLogout(dispatch)}>
          <StyledIcon name="exit" />
          <BackButton> {buttonsTitles.logout}</BackButton>
        </Row>
      </Container>
    </LoginLayout>
  );
};

export default Profiles;

const StyledIcon = styled(Icon)`
  color: rgb(122, 126, 159);
  font-size: 2.2rem;
`;

const BackButton = styled.div`
  font-size: 1.9rem;
  color: rgb(122, 126, 159);
  margin-left: 11px;
`;

const Row = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 12px;
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 12px;
`;

const Title = styled.div`
  font-size: 2.8rem;
  line-height: 22px;
  font-weight: bold;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.colors.primary};
`;
