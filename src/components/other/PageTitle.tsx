import { useNavigate } from "react-router";
import styled from "styled-components";
import { FishStockingStatus } from "../../utils/constants";
import { buttonsTitles } from "../../utils/texts";
import Button from "../buttons/Button";
import Icon from "./Icon";
import FishStockingStatusIcon from "./StatusIcon";

interface FishStockingPageTitleProps {
  status?: FishStockingStatus;
}

const titles = {
  [FishStockingStatus.UPCOMING]: "Būsimas įžuvinimas",
  [FishStockingStatus.ONGOING]: "Šiandien vykstantis įžuvinimas",
  [FishStockingStatus.CANCELED]: "Atšaukta",
  [FishStockingStatus.FINISHED]: "Ižuvinta",
  [FishStockingStatus.INSPECTED]: "Ižuvinta",
  [FishStockingStatus.NOT_FINISHED]: "Neužbaigta"
};

const FishStockingPageTitle = ({
  status = FishStockingStatus.UPCOMING
}: FishStockingPageTitleProps) => {
  const navigate = useNavigate();
  return (
    <Heading>
      <BackButton
        onClick={() => {
          navigate(-1);
        }}
        leftIcon={<StyledBackIcon name="back" />}
        variant={Button.colors.TRANSPARENT}
        type="button"
        height={32}
        buttonPadding="6px 8px"
        color="black"
      >
        {buttonsTitles.back}
      </BackButton>
      <InnerContainer>
        <StyledStatusIcon status={status!} />
        <StyledText>{titles[status]}</StyledText>
      </InnerContainer>
    </Heading>
  );
};
const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledText = styled.div`
  font-size: 2.4rem;
`;

const StyledStatusIcon = styled(FishStockingStatusIcon)`
  margin: auto 16px auto 0;
`;

const BackButton = styled(Button)`
  min-width: 0px;
  width: fit-content;
  button {
    padding: 0px;
    border: none;
    font-size: 1.6rem;
    color: #121926;
  }
`;

const StyledBackIcon = styled(Icon)`
  cursor: pointer;
  margin-right: 4px;
  font-size: 2rem;
  align-self: center;
  color: #000000;
`;

export default FishStockingPageTitle;
