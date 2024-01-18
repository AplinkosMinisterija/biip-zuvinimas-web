import { ArrayHelpers } from 'formik';
import { differenceWith, filter } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import { default as NumericTextField } from '../fields/NumericTextField';
import SelectField from '../fields/SelectField';
import Icon from '../other/Icon';

export interface FishRow {
  fishType: { label: string; id: string };
  fishAge: { label: string; id: string };
  amount: string | number;
  weight: string | number;
}

export interface FishStickingRegistrationFishRowProps {
  fishTypes: { label: string; id: string }[];
  fishAges: { label: string; id: string }[];
  item: FishRow;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  handleDelete: (index: number) => void;
  arrayHelpers: ArrayHelpers;
  showDelete: boolean;
  index: number;
  errors?: any;
  allFishSelections?: {
    fishType: any;
    fishAge: any;
    amount: string | number;
    weight: string | number;
  }[];
  disabled?: boolean;
  key?: string;
}

const FishStickingRegistrationFishRow = ({
  fishTypes,
  fishAges,
  item,
  setFieldValue,
  handleDelete,
  arrayHelpers,
  showDelete,
  index,
  errors,
  allFishSelections,
  disabled,
  key,
}: FishStickingRegistrationFishRowProps) => {
  const { fishType, fishAge, weight, amount } = item;
  const getAvailableFishTypes = useCallback(() => {
    if (item?.fishAge?.id) {
      const batchesWithTheSameAge = filter(allFishSelections, (batch) => {
        if (batch?.fishAge?.id === item?.fishAge?.id && batch?.fishType?.id) {
          return batch;
        }
      });

      const typesWithTheSameAge = batchesWithTheSameAge.map((b: any) => b.type);

      return differenceWith(
        fishTypes,
        typesWithTheSameAge,
        (type1: any, type2: any) => type1?.id === type2?.id,
      );
    }
    return fishTypes;
  }, [fishTypes, allFishSelections, item?.fishAge?.id]);

  const getAvailableFishAges = useCallback(() => {
    if (item?.fishType?.id) {
      const batchesWithTheSameAge = filter(allFishSelections, (batch) => {
        if (batch.fishType?.id === item.fishType?.id && batch.fishAge?.value) {
          return batch;
        }
      });
      const agesWithTheSameType = batchesWithTheSameAge.map((b: any) => b.age);
      return differenceWith(
        fishAges,
        agesWithTheSameType,
        (type1: any, type2: any) => type1?.id === type2?.id,
      );
    }
    return fishAges;
  }, [fishAges, allFishSelections, item.fishType?.id]);

  const [availableFishTypes, setAvailableFishTypes] = useState(getAvailableFishTypes());
  const [availableFishAges, setAvailableFishAges] = useState(getAvailableFishAges());

  useEffect(() => {
    setAvailableFishTypes(getAvailableFishTypes());
    setAvailableFishAges(getAvailableFishAges());
  }, [getAvailableFishAges, getAvailableFishTypes]);

  useEffect(() => {
    setAvailableFishTypes(getAvailableFishTypes());
    setAvailableFishAges(getAvailableFishAges());
  }, [
    fishType,
    fishAge,
    allFishSelections,
    fishTypes,
    getAvailableFishAges,
    getAvailableFishTypes,
  ]);

  return (
    <Row showDelete={showDelete} key={key}>
      <SelectField
        name={`batches.${index}.fishType`}
        value={fishType}
        onChange={(e: any) => setFieldValue(`batches.${index}.fishType`, e)}
        options={availableFishTypes}
        getOptionLabel={(option: any) => option?.label || ''}
        label="Žuvų rūšis"
        error={errors?.fishType}
        showError={false}
        disabled={disabled}
      />
      <SelectField
        name={`batches.${index}.fishAge`}
        value={fishAge}
        onChange={(e: any) => {
          setFieldValue(`batches.${index}.fishAge`, e);
        }}
        options={availableFishAges}
        getOptionLabel={(option: any) => option?.label || ''}
        label="Amžius"
        error={errors?.fishAge}
        showError={false}
        disabled={disabled}
      />
      <StyledNumericTextInput
        name={`batches.${index}.amount`}
        value={amount}
        onChange={(e) => setFieldValue(`batches.${index}.amount`, e)}
        label="Kiekis"
        error={errors?.amount}
        showError={false}
        right={<InputInnerLabel>vnt</InputInnerLabel>}
        disabled={disabled}
        wholeNumber={true}
      />
      <StyledNumericTextInput
        name={`batches.${index}.weight`}
        value={weight}
        onChange={(e) => setFieldValue(`batches.${index}.weight`, e)}
        label="Bendras svoris"
        showError={false}
        wholeNumber={false}
        right={<InputInnerLabel>kg</InputInnerLabel>}
        disabled={disabled}
      />
      {showDelete && !disabled && (
        <DeleteButton onClick={() => handleDelete(index)}>
          <DeleteIcon name={'delete'} />
        </DeleteButton>
      )}
    </Row>
  );
};

const Row = styled.div<{ showDelete: boolean }>`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr ${({ showDelete }) => (showDelete ? '50px' : '')};
  margin-bottom: 12px;
  gap: 12px;
  width: 100%;
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

const StyledNumericTextInput = styled(NumericTextField)``;

const DeleteButton = styled.div`
  margin-top: auto;
  height: 40px;
  display: flex;
  @media ${device.mobileL} {
    margin-bottom: 0px;
    height: auto;
  }
`;

const DeleteIcon = styled(Icon)`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.error};
  font-size: 2.4rem;
  margin: auto 0 auto 0px;
  @media ${device.mobileL} {
    margin: 8px 0 16px 0;
  }
`;
const InputInnerLabel = styled.div`
  margin: auto 8px;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.primary + '8F'};
`;

export default FishStickingRegistrationFishRow;
