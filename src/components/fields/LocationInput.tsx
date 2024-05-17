import styled from 'styled-components';
import { inputLabels } from '../../utils/texts';
import Icon from '../other/Icon';
import { AsyncSelectField } from '@aplinkosministerija/design-system';
import { FishStockingLocation, Municipality, UETKLocation } from '../../utils/types';

export interface LocationFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value?: any;
  error?: string;
  showError?: boolean;
  editable?: boolean;
  left?: JSX.Element;
  handleLogs?: (data: any) => void;
  right?: JSX.Element;
  padding?: string;
  onChange: (option: UETKLocation) => void;
  disabled?: boolean;
  getOptionLabel: (option: any) => string;
  getInputLabel?: (option: any) => string;
  className?: string;
  placeholder?: string;
  backgroundColor?: string;
  hasBorder?: boolean;
  setSuggestionsFromApi: (input: any, page: number, id?: any) => any;
  getOptionValue?: (option: any) => any;
  dependantId?: string;
  optionsKey?: string;
  hasOptionKey?: boolean;
  primaryKey?: string;
  haveIncludeOptions?: boolean;
  municipalities: Municipality[];
}

const LocationField = ({
  value,
  error,
  onChange,
  setSuggestionsFromApi,
  municipalities,
}: LocationFieldProps) => {
  return (
    <AsyncSelectField
      label={inputLabels.location}
      hasOptionKey={false}
      value={value}
      error={error}
      onChange={(e: UETKLocation) => {
        onChange(e);
      }}
      getOptionLabel={(option: UETKLocation) =>
        `${option.name} (${option.cadastralId}) - ${option.municipality}`
      }
      loadOptions={setSuggestionsFromApi}
    />
  );
};

const StyledIcon = styled(Icon)`
  color: #cdd5df;
  font-size: 2.4rem;
  margin-right: 12px;
`;

export default LocationField;
