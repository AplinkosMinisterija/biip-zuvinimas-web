import { FieldArray } from 'formik';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { ButtonColors, device } from '../../styles';
import api from '../../utils/api';
import { FishOriginTypes } from '../../utils/constants';
import { getLocationList, getTenantsList, handleAlert } from '../../utils/functions';
import { useAssignedToUsers, useFishAges, useIsFreelancer, useSettings } from '../../utils/hooks';
import { buttonsTitles, formLabels, inputLabels } from '../../utils/texts';
import { FishStockingLocation, FishType } from '../../utils/types';
import {
  DatePicker,
  TextField,
  SelectField,
  AsyncSelectField,
  PhoneField,
  CheckBox,
  RadioOptions,
  Button,
} from '@aplinkosministerija/design-system';
import LocationInput from '../fields/LocationInput';
import TimePicker from '../fields/TimePicker';
import FishRow from '../other/FishRow';
import { fishOriginOptions } from '../../utils/options';
import { useEffect, useState } from 'react';

const RegistrationForm = ({
  values,
  errors,
  setFieldValue,
  setValues,
  isCustomer,
  setGeom,
  disabled,
  onShowMap,
}: {
  renderTabs?: JSX.Element;
  values: any;
  errors: any;
  setFieldValue: any;
  setValues: any;
  isCustomer: boolean;
  submitLoading: boolean;
  setGeom: (geom: any) => void;
  disabled: boolean;
  onShowMap: () => void;
}) => {
  const fishAges = useFishAges();
  const { minTime } = useSettings();
  const isFreelancer = useIsFreelancer();
  const users = useAssignedToUsers();
  const [isCustomerInformationVisible, setIsCustomerInformationVisible] = useState<boolean>(false);

  const { data, error: fishTypesError } = useQuery({
    queryKey: ['fishTypes'],
    queryFn: () => api.getFishTypes(),
  });

  useEffect(() => {
    if (fishTypesError) handleAlert();
  }, [fishTypesError]);

  useEffect(() => {
    values.stockingCustomer && setIsCustomerInformationVisible(true);
  }, [values]);

  const fishTypesFullList = data?.rows || [];

  const filterFishTypes = (batches: any[]) => {
    const batchesFishTypesIds = batches
      .filter((batch) => !!batch.fishType?.id)
      .map((batch) => batch.fishType?.id);

    return fishTypesFullList.filter((fishType) => {
      const inBatches = batchesFishTypesIds.includes(fishType.id);
      return !inBatches;
    });
  };

  const filteredFistTypes: FishType[] = filterFishTypes(values.batches || []);

  return (
    <>
      <LocationInput
        value={values.location}
        error={errors.location}
        onChange={(value: FishStockingLocation) => {
          setGeom(value.geom);
          setFieldValue('location', value);
        }}
        disabled={disabled}
      />
      <Link onClick={onShowMap}>Žymėti žemėlapyje</Link>
      <TimeRow>
        <DatePicker
          label="Data"
          minDate={new Date(new Date().setDate(new Date().getDate() + minTime))}
          name="eventTime"
          error={errors.eventTime}
          value={values.eventTime}
          onChange={(e: any) => setFieldValue('eventTime', e)}
          disabled={disabled}
        />
        <TimePicker
          label="Laikas"
          minDate={new Date(new Date().setDate(new Date().getDate() + minTime))}
          onChange={(e: Date) => setFieldValue('eventTime', e)}
          error={errors.eventTime}
          value={values.eventTime}
          disabled={disabled}
        />
      </TimeRow>
      <RadioOptions
        options={fishOriginOptions}
        label="Žuvų kilmė"
        name="fishOrigin"
        value={values.fishOrigin}
        error={errors.fishOrigin}
        onChange={(e: any) => {
          setValues({
            ...values,
            fishOrigin: e,
            fishOriginCompanyName: '',
            setFieldValue: '',
          });
        }}
        disabled={disabled}
      />

      {values.fishOrigin === FishOriginTypes.GROWN ? (
        <TextField
          label="Žuvivaisos įmonė"
          name="fishOriginCompanyName"
          value={values.fishOriginCompanyName}
          error={errors.fishOriginCompanyName}
          onChange={(value) => setFieldValue('fishOriginCompanyName', value)}
          disabled={disabled}
        />
      ) : (
        <AsyncSelectField
          label="Vandens telkinys"
          name="fishOriginReservoir"
          value={values.fishOriginReservoir}
          error={errors.fishOriginReservoir}
          onChange={(value) => {
            setFieldValue('fishOriginReservoir', value);
          }}
          hasOptionKey={false}
          // getInputLabel={(option) =>
          //   `${option?.name} (${option?.cadastral_id}) - ${option?.municipality?.name}`
          // }
          getOptionLabel={(option) =>
            `${option?.name} (${option?.cadastral_id}) - ${option?.municipality?.name}`
          }
          loadOptions={(input: string, page: number) => getLocationList(input, page)}
        />
      )}

      {!isFreelancer && (
        <>
          <Subheader>{formLabels.stockingPerform}</Subheader>
          <Row>
            <SelectField
              label="Vardas ir pavardė"
              name="assignedTo"
              getOptionLabel={(option: any) => `${option.firstName} ${option.lastName}`}
              value={values.assignedTo}
              error={errors.assignedTo}
              onChange={(value: any) => {
                setValues({
                  ...values,
                  assignedTo: value,
                  phone: value?.phone?.trim() || '',
                });
              }}
              options={users}
              disabled={isCustomer}
            />
            <PhoneField
              label={inputLabels.phone}
              name="phone"
              value={values.phone}
              error={errors.phone}
              onChange={(value) => setFieldValue('phone', value)}
              disabled={isCustomer}
            />
          </Row>
        </>
      )}

      <CheckBoxRow>
        <CheckBox
          label={inputLabels.customerCheckbox}
          disabled={disabled}
          onChange={(val) => {
            setIsCustomerInformationVisible(val);
            if (!val) {
              setFieldValue('stockingCustomer', undefined);
            }
          }}
          value={isCustomerInformationVisible}
        />
      </CheckBoxRow>
      {isCustomerInformationVisible && (
        <Row>
          <AsyncSelectField
            label="Nurodykite užsakovo įmonės pavadinimą"
            name="stockingCustomer"
            loadOptions={(input: string, page: number) => getTenantsList(input, page)}
            getOptionLabel={(option: any) => option?.name}
            value={values.stockingCustomer}
            error={errors.stockingCustomer}
            onChange={(value: any) => setFieldValue('stockingCustomer', value)}
            disabled={disabled}
          />
        </Row>
      )}

      <FieldArray
        name="batches"
        render={(arrayHelpers) => (
          <div>
            <Subheader>{formLabels.infoAboutFishes}</Subheader>
            {values.batches?.map((item, index) => {
              const fishErrors = errors.batches?.[index];
              return (
                <FishRow
                  key={`fish_row_${index}`}
                  index={index}
                  fishTypes={filteredFistTypes}
                  fishAges={fishAges}
                  item={item}
                  setFieldValue={(key, value) => {
                    setFieldValue(key, value);
                  }}
                  handleDelete={(e) => {
                    arrayHelpers.remove(e);
                  }}
                  showDelete={values.batches.length > 1}
                  errors={fishErrors}
                  disabled={disabled}
                />
              );
            })}
            {!disabled && (
              <AddButton
                variant={ButtonColors.TRANSPARENT}
                onClick={() => {
                  arrayHelpers.push({});
                }}
              >
                {buttonsTitles.addFish}
              </AddButton>
            )}
          </div>
        )}
      />
    </>
  );
};

const CheckBoxRow = styled.div`
  display: grid;
  gap: 12px;
  margin: 16px 0 0;
`;

const Row = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

const TimeRow = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 0.5fr;
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

const Subheader = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  margin-top: 18px;
  color: ${({ theme }) => theme.colors.tertiary};
`;

const Link = styled.div`
  color: #175cd3;
  text-decoration: underline;
  font-size: 1.4rem;
  :hover {
    opacity: 0.6;
  }
  display: none;
  @media ${device.mobileL} {
    display: block;
  }
`;

const AddButton = styled(Button)`
  padding: 4px 0;
`;

export default RegistrationForm;
