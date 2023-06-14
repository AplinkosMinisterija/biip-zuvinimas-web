import styled from "styled-components";
import { LoginLayout } from "../components/Layouts/Login";
import { device } from "../styles";
import {
  buttonLabels,
  buttonsTitles,
  descriptions,
  formLabels
} from "../utils/texts";

export const CantLogin = () => {
  return (
    <LoginLayout>
      <>
        <H1>{formLabels.inActiveProfile}</H1>
        <Description>
          {descriptions.cantLoginOwner} (
          <Email href={`mailto:${buttonsTitles.aadEmail}`}>
            {buttonsTitles.aadEmail}
          </Email>{" "}
          )
        </Description>
        <Or>{buttonLabels.or}</Or>
        <Description>{descriptions.cantLoginTenantUser}</Description>
      </>
    </LoginLayout>
  );
};

const Description = styled.div`
  text-align: center;
  font: normal normal medium 1.6rem/26px Manrope;
  letter-spacing: 0px;
  color: #7a7e9f;
  width: 70%;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const Or = styled.div`
  text-align: center;
  font: normal normal medium 1.6rem/26px Manrope;
  letter-spacing: 0px;
  margin: 16px 0;
  color: ${({ theme }) => theme.colors.primary};
  width: 70%;
`;

const H1 = styled.h1`
  text-align: center;
  font: normal normal bold 32px/44px Manrope;
  letter-spacing: 0px;
  color: #121a55;
  opacity: 1;
  margin: 0px 0px 16px 0px;

  @media ${device.mobileL} {
    padding-bottom: 0px;
  }
`;

const Email = styled.a`
  color: ${({ theme }) => theme.colors.primary};
`;
