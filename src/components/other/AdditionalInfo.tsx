import { isEmpty } from "lodash";
import styled from "styled-components";
import { device } from "../../styles";
import { FishStocking } from "../../utils/types";

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
    </BottomContainer>
  );
};

const BottomLabel = styled.div`
  font: normal normal 600 1.6rem/22px Manrope;
  letter-spacing: 0.64px;
  color: #b3b5c4;
`;

const FishTotalAmount = styled.div`
  font: normal normal bold 2.4rem/40px Manrope;
  letter-spacing: 0px;
  color: #ffffff;
  @media ${device.mobileL} {
    font: normal normal 600 1.6rem/22px Manrope;
  }
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

export default AdditionalInfo;
