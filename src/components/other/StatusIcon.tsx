import styled from "styled-components";
import { FishStockingStatus } from "../../utils/constants";

export interface FishStockingStatusIconProps {
  status: FishStockingStatus;
  className?: string;
}

const FishStockingStatusIcon = ({
  status,
  className
}: FishStockingStatusIconProps) => {
  const getIcon = (status: FishStockingStatus) => {
    switch (status) {
      case FishStockingStatus.CANCELED:
        return "/late.svg";
      case FishStockingStatus.UPCOMING:
        return "/new.svg";
      case FishStockingStatus.ONGOING:
        return "/not_finished.svg";
      case FishStockingStatus.NOT_FINISHED:
        return "/late.svg";
      case FishStockingStatus.FINISHED:
        return "/approved.svg";
      case FishStockingStatus.INSPECTED:
        return "/approved.svg";
      default:
        return "/new.svg";
    }
  };

  const icon = getIcon(status);

  return (
    <IconContainer className={className}>
      <Image src={icon} />
    </IconContainer>
  );
};

const IconContainer = styled.div`
  height: 32px;
`;
const Image = styled.img`
  height: 32px;
`;

export default FishStockingStatusIcon;
