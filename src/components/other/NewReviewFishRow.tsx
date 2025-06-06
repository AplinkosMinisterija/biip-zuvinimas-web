import { NumericTextField, SelectField } from '@aplinkosministerija/design-system';
import styled from 'styled-components';
import { device } from '../../styles';
import { NewReviewFishRowProps } from '../../utils/types';
import Icon from '../other/Icon';

export interface FishRowProps {
  fishTypes: { label: string; id: string }[];
  fishAges: { label: string; id: string }[];
  item: NewReviewFishRowProps;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  handleDelete: (index: number) => void;
  showDelete: boolean;
  index: number;
  errors?: any;
  disabled?: boolean;
  key?: string;
}

const NewReviewFishRow = ({
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
  const { fishType, fishAge, reviewWeight, reviewAmount } = item;

  return (
    <Row $showDelete={showDelete}>
      <SelectField
        name={`newBatches.${index}.fishType`}
        value={fishType}
        onChange={(e: any) => setFieldValue(`newBatches.${index}.fishType`, e)}
        options={fishTypes}
        getOptionLabel={(option: any) => option?.label || ''}
        label="Žuvų rūšis"
        error={errors?.fishType}
        showError={false}
        disabled={disabled}
      />
      <SelectField
        name={`newBatches.${index}.fishAge`}
        value={fishAge}
        onChange={(e: any) => {
          setFieldValue(`newBatches.${index}.fishAge`, e);
        }}
        options={fishAges}
        getOptionLabel={(option: any) => option?.label || ''}
        label="Amžius"
        error={errors?.fishAge}
        showError={false}
        disabled={disabled}
      />
      <NumericTextField
        name={`newBatches.${index}.reviewAmount`}
        value={reviewAmount}
        onChange={(e) => setFieldValue(`newBatches.${index}.reviewAmount`, e)}
        label="Kiekis"
        error={errors?.amount}
        showError={false}
        right={<InputInnerLabel>vnt</InputInnerLabel>}
        disabled={disabled}
        wholeNumber={true}
        returnNumber={true}
      />
      <NumericTextField
        name={`newBatches.${index}.reviewWeight`}
        value={reviewWeight}
        onChange={(e) => setFieldValue(`newBatches.${index}.reviewWeight`, e)}
        label="Bendras svoris (Neprivaloma)"
        showError={false}
        error={errors?.weight}
        wholeNumber={false}
        right={<InputInnerLabel>kg</InputInnerLabel>}
        disabled={disabled}
        returnNumber={true}
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
  margin: 12px 0;
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

export default NewReviewFishRow;
