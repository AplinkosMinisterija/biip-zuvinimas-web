import React from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import { SelectField, NumericTextField } from '@aplinkosministerija/design-system';
import Icon from '../other/Icon';
import { RegistrationFormFishRow } from '../../utils/types';

export interface FishRowProps {
  fishTypes: { label: string; id: string }[];
  fishAges: { label: string; id: string }[];
  item: RegistrationFormFishRow;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  handleDelete: (index: number) => void;
  showDelete: boolean;
  index: number;
  errors?: any;
  disabled?: boolean;
  key?: string;
}

const FishRow = ({
  fishTypes,
  fishAges,
  item,
  setFieldValue,
  handleDelete,
  showDelete,
  index,
  errors,
  disabled,
}: FishRowProps) => {
  const { fishType, fishAge, weight, amount } = item;
  return (
    <Row $showDelete={showDelete}>
      <SelectField
        name={`batches.${index}.fishType`}
        value={fishType}
        onChange={(e: any) => setFieldValue(`batches.${index}.fishType`, e)}
        options={fishTypes}
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
        options={fishAges}
        getOptionLabel={(option: any) => option?.label || ''}
        label="Amžius"
        error={errors?.fishAge}
        showError={false}
        disabled={disabled}
      />
      <NumericTextField
        name={`batches.${index}.amount`}
        value={amount}
        onChange={(e) => setFieldValue(`batches.${index}.amount`, e)}
        label="Kiekis"
        error={errors?.amount}
        showError={false}
        rightIcon={<InputInnerLabel>vnt</InputInnerLabel>}
        disabled={disabled}
        wholeNumber={true}
      />
      <NumericTextField
        name={`batches.${index}.weight`}
        value={weight}
        onChange={(e) => setFieldValue(`batches.${index}.weight`, e)}
        label="Bendras svoris"
        showError={false}
        wholeNumber={false}
        rightIcon={<InputInnerLabel>kg</InputInnerLabel>}
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

const Row = styled.div<{ $showDelete: boolean }>`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr ${({ $showDelete }) => ($showDelete ? '50px' : '')};
  margin-bottom: 12px;
  gap: 12px;
  width: 100%;
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

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

export default FishRow;
