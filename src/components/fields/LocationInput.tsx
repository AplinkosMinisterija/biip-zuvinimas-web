import { inputLabels } from '../../utils/texts';
import { AsyncSelectField } from '@aplinkosministerija/design-system';
import { FishStockingLocation } from '../../utils/types';
import api from '../../utils/api';

export interface LocationFieldProps {
  value?: any;
  error?: string;
  onChange: (option: FishStockingLocation) => void;
  disabled?: boolean;
}

const LocationField = ({ value, error, onChange, disabled }: LocationFieldProps) => {
  return (
    <AsyncSelectField
      label={inputLabels.location}
      hasOptionKey={false}
      value={value}
      error={error}
      onChange={(e: FishStockingLocation) => {
        onChange(e);
      }}
      getOptionLabel={(option: FishStockingLocation) =>
        `${option.name} (${option.cadastral_id}) - ${option.municipality.name}`
      }
      loadOptions={(input: string, page: number) =>
        api.getRecentLocations({ filter: { name: input }, page })
      }
      disabled={disabled}
    />
  );
};

export default LocationField;
