import styled from "styled-components";
import { theme } from "../../styles";
import { FishStockingStatus } from "../../utils/constants";
import CustomTag from "../other/CustomTag";
import Icon from "../other/Icon";

export interface FishStockingTagProps {
  status: FishStockingStatus;
}

const FishStockingTag = ({ status }: FishStockingTagProps) => {
  const ApproveIcon =
    status === FishStockingStatus.INSPECTED ? (
      <StyledIcon name={"verified"} />
    ) : undefined;
  return (
    <CustomTag
      color={theme.colors[status]}
      icon={ApproveIcon}
      text={labels[status]}
    />
  );
};

const labels = {
  UPCOMING: "Būsimas",
  ONGOING: "Vyksta dabar",
  NOT_FINISHED: "Neužbaigta",
  FINISHED: "Įžuvinta",
  INSPECTED: "Patikrinta",
  CANCELED: "Atšaukta"
};

const StyledIcon = styled(Icon)`
  color: #60b456;
  font-size: 2rem;
  vertical-align: middle;
  display: inline-block;
`;

export default FishStockingTag;
