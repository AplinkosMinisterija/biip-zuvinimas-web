import { isEmpty } from "lodash";
import styled from "styled-components";
import { device } from "../../styles";
import { FishStocking } from "../../utils/types";
import Icon from "../other/Icon";

interface AdditionalInfoProps {
  fishStocking: FishStocking;
}

const AdditionalInfo = ({ fishStocking }: AdditionalInfoProps) => {
  return (
    <BottomContainer>
      <BottomColumn>
        <BottomLabel>Įžuvinta</BottomLabel>
        {!isEmpty(fishStocking.batches) && (
          <FishTotalAmount>
            {fishStocking.batches
              .map((e) =>
                e?.reportedAmount || e?.reportedAmount === 0
                  ? e?.reportedAmount
                  : e?.reviewAmount || e?.reviewAmount === 0
                  ? e?.reviewAmount
                  : e?.amount || e?.amount === 0
                  ? e?.amount
                  : null
              )
              ?.reduce(
                (previousValue: any, currentValue: any) =>
                  previousValue + currentValue
              )
              ?.toString()
              ?.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
            vnt.
          </FishTotalAmount>
        )}
      </BottomColumn>
      {/* {fishStocking?. ? (
        <BottomColumn>
          <BottomLabel>Tikrino:</BottomLabel>
          <Inspector>
            <VerifiedIcon name={"verified"} />
            {fishStocking?.reportedBy?.name}{" "}
            {fishStocking?.reportedBy?.lastName}
          </Inspector>
          <ReportTime>
            {format(new Date(fishStocking?.reportTime), "yyyy-MM-dd H:mm")}
          </ReportTime>
        </BottomColumn>
      ) : null} */}
    </BottomContainer>
  );
};

const BottomLabel = styled.div`
  font: normal normal 600 1.6rem/22px Manrope;
  letter-spacing: 0.64px;
  color: #b3b5c4;
`;

const Inspector = styled.div`
  font: normal normal 600 16px/40px Manrope;

  letter-spacing: 0px;
  color: #ffffff;
  display: flex;
  @media ${device.mobileL} {
    font: normal normal 600 1.6rem/22px Manrope;
  }
`;

const FishTotalAmount = styled.div`
  font: normal normal bold 2.4rem/40px Manrope;
  letter-spacing: 0px;
  color: #ffffff;
  @media ${device.mobileL} {
    font: normal normal 600 1.6rem/22px Manrope;
  }
`;

const ReportTime = styled.div`
  margin-top: -4px;
  font-size: 12px;
`;

const BottomColumn = styled.div`
  margin-right: 44px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
const BottomContainer = styled.div`
  color: #fff;
  margin-top: 37px;
  display: flex;
`;

const VerifiedIcon = styled(Icon)`
  align-self: center;
  font-size: 1.9rem;
  color: ${({ theme }) => theme.colors.success};
  margin-right: 8px;
`;

export default AdditionalInfo;
