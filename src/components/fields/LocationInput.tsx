import { AsyncSelectField, CheckBox, TextField } from '@aplinkosministerija/design-system';
import * as turf from '@turf/turf';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getUetkLocationList, isManualLocation } from '../../utils/functions';
import { inputLabels, validationTexts } from '../../utils/texts';
import { FishStockingLocation } from '../../utils/types';

export interface LocationFieldProps {
  name?: string;
  value?: FishStockingLocation;
  error?: string;
  onChange: (option?: FishStockingLocation) => void;
  disabled?: boolean;
}

const getInputValue = (location: any) =>
  location ? `${location?.name}, ${location?.cadastral_id || location?.cadastralId}` : '';

const LocationField = ({ name, value, error, onChange, disabled }: LocationFieldProps) => {
  const [isManual, setIsManual] = useState(isManualLocation(value));

  useEffect(() => {
    if (value) setIsManual(isManualLocation(value));
  }, [value]);

  const handleModeChange = (manual: boolean) => {
    setIsManual(manual);
    if (!manual) return onChange(undefined);
    // always emit a location so the form value itself carries the manual flag —
    // the map reads it to know it must not look the point up in UETK
    onChange({ name: value?.name || '', municipality: value?.municipality, geom: value?.geom });
  };

  return (
    <>
      {isManual ? (
        <TextField
          name={name || 'location'}
          label={inputLabels.waterBodyName}
          value={value?.name || ''}
          error={error}
          disabled={disabled}
          onChange={(waterBodyName: string) =>
            onChange({ ...value, name: waterBodyName, cadastral_id: undefined })
          }
        />
      ) : (
        <AsyncSelectField
          name={name || 'location'}
          value={value}
          disabled={disabled}
          error={error}
          label={inputLabels.selectWaterBody}
          onChange={(val) => {
            const {
              municipality,
              municipalityCode,
              length,
              area,
              name,
              categoryTranslate,
              cadastralId,
              geom,
            } = val;

            const centroid = turf.pointOnFeature(geom);

            const featureCollection = {
              type: 'FeatureCollection',
              features: [centroid],
            };

            onChange({
              name,
              geom: featureCollection,
              length,
              area,
              category: categoryTranslate,
              cadastral_id: cadastralId,
              municipality: { name: municipality, id: municipalityCode },
            });
          }}
          getOptionLabel={getInputValue}
          loadOptions={(input: string, page: number | string) => getUetkLocationList(input, page)}
        />
      )}
      <CheckBox
        label={inputLabels.waterBodyNotInUetk}
        value={isManual}
        disabled={disabled}
        onChange={handleModeChange}
      />
      {isManual && !value?.municipality && (
        <Hint>{validationTexts.requireLocationMunicipality}</Hint>
      )}
    </>
  );
};

const Hint = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.label};
`;

export default LocationField;
