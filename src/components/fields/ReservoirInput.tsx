import { AsyncSelectField, CheckBox, TextField } from '@aplinkosministerija/design-system';
import { useEffect, useState } from 'react';
import { getLocationList, isManualLocation } from '../../utils/functions';
import { inputLabels } from '../../utils/texts';
import { FishStockingLocation } from '../../utils/types';

export interface ReservoirFieldProps {
  value?: FishStockingLocation;
  error?: string;
  onChange: (option?: FishStockingLocation) => void;
  disabled?: boolean;
}

const getOptionLabel = (option: any) =>
  `${option?.name} (${option?.cadastral_id}) - ${option?.municipality?.name}`;

const ReservoirField = ({ value, error, onChange, disabled }: ReservoirFieldProps) => {
  const [isManual, setIsManual] = useState(isManualLocation(value));

  useEffect(() => {
    if (value) setIsManual(isManualLocation(value));
  }, [value]);

  const handleModeChange = (manual: boolean) => {
    setIsManual(manual);
    onChange(undefined);
  };

  return (
    <>
      {isManual ? (
        <TextField
          name="fishOriginReservoir"
          label={inputLabels.waterBodyName}
          value={value?.name || ''}
          error={error}
          disabled={disabled}
          onChange={(waterBodyName: string) => onChange({ name: waterBodyName })}
        />
      ) : (
        <AsyncSelectField
          label={inputLabels.waterBody}
          name="fishOriginReservoir"
          value={value}
          error={error}
          disabled={disabled}
          onChange={(reservoir) => onChange(reservoir ?? undefined)}
          hasOptionKey={false}
          getOptionLabel={getOptionLabel}
          loadOptions={(input: string, page: number) => getLocationList(input, page)}
        />
      )}
      <CheckBox
        label={inputLabels.waterBodyNotInUetk}
        value={isManual}
        disabled={disabled}
        onChange={handleModeChange}
      />
    </>
  );
};

export default ReservoirField;
