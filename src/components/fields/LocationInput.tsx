import { AsyncSelectField, CheckBox, TextField } from '@aplinkosministerija/design-system';
import * as turf from '@turf/turf';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getUetkLocationList, isManualLocation } from '../../utils/functions';
import { inputLabels, validationTexts } from '../../utils/texts';
import { FishStockingLocation, GeomFeature, UetkLocationOption } from '../../utils/types';

export interface LocationFieldProps {
  name?: string;
  value?: FishStockingLocation;
  error?: string;
  onChange: (option?: FishStockingLocation) => void;
  disabled?: boolean;
}

const toOption = (location?: FishStockingLocation): UetkLocationOption | undefined =>
  location ? { name: location.name, cadastralId: location.cadastral_id } : undefined;

const getOptionLabel = (option: UetkLocationOption) =>
  [option.name, option.cadastralId].filter(Boolean).join(', ');

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
        <AsyncSelectField<UetkLocationOption>
          name={name || 'location'}
          value={toOption(value)}
          disabled={disabled}
          error={error}
          label={inputLabels.selectWaterBody}
          onChange={(option) => {
            if (!option?.geom) return onChange(undefined);
            const centroid = turf.pointOnFeature(option.geom as turf.AllGeoJSON);
            onChange({
              name: option.name || '',
              geom: { type: 'FeatureCollection', features: [centroid as GeomFeature] },
              length: option.length,
              area: option.area,
              category: option.categoryTranslate,
              cadastral_id: option.cadastralId,
              // municipalityCode stays untouched: the admin scope matches it as a number
              municipality: { name: option.municipality || '', id: option.municipalityCode ?? '' },
            });
          }}
          getOptionLabel={getOptionLabel}
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
