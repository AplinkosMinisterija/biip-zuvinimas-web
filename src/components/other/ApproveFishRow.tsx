import { ArrayHelpers, FormikErrors } from "formik";
import React from "react";
import styled from "styled-components";
import { device } from "../../styles";
import { FishType } from "../../utils/types";
import NumericTextField from "../fields/NumericTextField";

interface itemProps {
  id: string;
  fishType: FishType;
  fishAge: FishType;
  reviewAmount: number;
  reviewWeight: number;
  planned: string;
}

export interface FishStockingApproveFishRowProps {
  item: itemProps;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  arrayHelpers: ArrayHelpers;
  index: number;
  errors?: string | string[] | FormikErrors<any> | FormikErrors<any>[] | any;
  last?: boolean;
  showBottomLabel?: boolean;
  disabled?: boolean;
}

const FishStockingApproveFishRow = ({
  item,
  index,
  errors,
  last = false,
  showBottomLabel = true,
  disabled,
  setFieldValue
}: FishStockingApproveFishRowProps &
  React.HTMLAttributes<HTMLInputElement>) => {
  function capitalizeFirstLetter(string: string) {
    if (!string) return "";

    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const fishName = capitalizeFirstLetter(item.fishType?.label);
  const fishAge = capitalizeFirstLetter(item.fishAge?.label);

  return (
    <Row key={index}>
      <FishInfo last={last}>
        <FishName>{fishName}</FishName>
        <FishAge>{fishAge}</FishAge>
      </FishInfo>
      <Inputs>
        <StyledNumericTextInput
          name={`batches.${index}.reviewAmount`}
          value={item.reviewAmount}
          onChange={(e) => setFieldValue(`batches.${index}.reviewAmount`, e)}
          label="Kiekis"
          error={errors?.reviewAmount}
          showError={false}
          right={<InputInnerLabel>vnt</InputInnerLabel>}
          bottomLabel={showBottomLabel && item.planned ? item.planned : ""}
          disabled={disabled}
        />
        <StyledNumericTextInput
          name={`batches.${index}.reviewWeight`}
          value={item.reviewWeight}
          onChange={(e) => setFieldValue(`batches.${index}.reviewWeight`, e)}
          label="Svoris"
          showError={false}
          wholeNumber={false}
          right={<InputInnerLabel>kg</InputInnerLabel>}
          disabled={disabled}
        />
      </Inputs>
    </Row>
  );
};

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  @media ${device.mobileL} {
    flex-direction: column;
    width: 100%;
  }
`;

const FishInfo = styled.div<{ last: boolean }>`
  display: flex;
  flex-direction: column;
  height: 58px;
  margin: auto 0;
  min-width: 25%;
  padding-right: 16px;
  @media ${device.mobileL} {
    flex-direction: row;
  }
`;

const FishName = styled.span`
  text-align: left;
  font: 600 1.6rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: auto;
  @media ${device.mobileL} {
    margin: 10px 10px 0px 0px;
  }
`;

const FishAge = styled.span`
  text-align: left;
  font: 600 1.4rem;
  color: ${({ theme }) => theme.colors.primary + "8F"};
  opacity: 1;
  @media ${device.mobileL} {
    margin: 10px 10px 0px 0px;
  }
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  min-width: 75%;
  @media ${device.mobileL} {
    min-width: 100%;
  }
`;

const InputInnerLabel = styled.div`
  margin: auto 8px;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.primary + "8F"};
`;

const StyledNumericTextInput = styled(NumericTextField)`
  flex: 1;
  min-width: 50px;
`;

export default FishStockingApproveFishRow;
