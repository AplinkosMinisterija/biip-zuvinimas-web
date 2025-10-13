import { AsyncSelectField } from '@aplinkosministerija/design-system';
import * as turf from '@turf/turf';
import { getUetkLocationList } from '../../utils/functions';
import { FishStockingLocation } from '../../utils/types';

export interface LocationFieldProps {
  name?: string;
  value?: any;
  error?: string;
  onChange: (option: FishStockingLocation) => void;
  disabled?: boolean;
}

const getInputValue = (location: any) =>
  location ? `${location?.name}, ${location?.cadastral_id || location?.cadastralId}` : '';

const LocationField = ({ name, value, error, onChange, disabled }: LocationFieldProps) => {
  return (
    <AsyncSelectField
      name={name || 'location'}
      value={value}
      disabled={disabled}
      error={error}
      label={'Pasirinkite vandens telkinį'}
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
  );
};

export default LocationField;
