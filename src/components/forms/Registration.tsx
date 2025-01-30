import { useMediaQuery } from '@material-ui/core';
import { FieldArray, Form, Formik } from 'formik';
import { useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import { useAppSelector } from '../../state/hooks';
import { device } from '../../styles';
import api from '../../utils/api';
import { FishOriginTypes } from '../../utils/constants';
import { getLocationList, getTenantsList, handleAlert, isNew } from '../../utils/functions';
import {
  useAssignedToUsers,
  useFishAges,
  useFishStockingCallbacks,
  useIsFreelancer,
  useSettings,
} from '../../utils/hooks';
import { buttonsTitles, formLabels, inputLabels, queryStrings } from '../../utils/texts';
import { FishStocking, FishType, RegistrationFormValues } from '../../utils/types';
import { validateFishStocking, validateFreelancerFishStocking } from '../../utils/validations';
import Button from '../buttons/Button';
import RadioOptions from '../buttons/RadioOptionts';
import SimpleButton from '../buttons/SimpleButton';
import AsyncSelectField from '../fields/AsyncSelect';
import Datepicker from '../fields/DatePicker';
import LocationInput from '../fields/LocationInput';
import SelectField from '../fields/SelectField';
import TextField from '../fields/TextField';
import TimePicker from '../fields/TimePicker';
import DeleteCard from '../other/DeleteCard';
import FishRow from '../other/FishRow';
import LoaderComponent from '../other/LoaderComponent';
import Modal from '../other/Modal';
import FishStockingPageTitle from '../other/PageTitle';
import Map from '../other/RegistrationMap';
import { fishOriginOptions } from '../../utils/options';
import NumericTextField from '../fields/NumericTextField';
const cookies = new Cookies();

const RegistrationForm = ({
  fishStocking,
  renderTabs,
  disabled,
}: {
  fishStocking?: FishStocking;
  renderTabs?: JSX.Element;
  disabled?: boolean;
}) => {
  const [showMap, setShowMap] = useState(false);
  const [isMapPreviewMode, toggleMapPreviewMode] = useState(false);
  const [queryString, setQueryString] = useState('');
  const isMobile = useMediaQuery(device.mobileL);
  const fishAges = useFishAges();
  const { minTime, loading } = useSettings();
  const isFreelancer = useIsFreelancer();
  const iframeRef = useRef<any>(null);
  const user = useAppSelector((state) => state?.user?.userData);
  const [showModal, setShowModal] = useState(false);
  const users = useAssignedToUsers();
  const [searchParams] = useSearchParams();
  const { repeat } = Object.fromEntries([...Array.from(searchParams)]);

  const { data, isLoading: fihTypesLoading } = useQuery('fishTypes', () => api.getFishTypes(), {
    onError: () => {
      handleAlert();
    },
  });

  const fishTypesFullList = data?.rows || [];

  const callBacks = useFishStockingCallbacks();

  const createFishStockingMutation = useMutation(
    (params: FishStocking) => api.registerFishStocking(params),
    { ...callBacks },
  );

  const updateFishStockingMutation = useMutation(
    (params: FishStocking) => api.updateFishStocking(params, id!),
    { ...callBacks },
  );

  const cancelFishStockingMutation = useMutation(() => api.cancelFishStocking(id!), {
    ...callBacks,
  });

  const deleteFishStockingMutation = useMutation(() => api.cancelFishStocking(id!), {
    ...callBacks,
  });

  const submitLoading = [
    createFishStockingMutation.isLoading,
    updateFishStockingMutation.isLoading,
    cancelFishStockingMutation.isLoading,
    deleteFishStockingMutation.isLoading,
  ].some((loading) => loading);

  const isCustomer = fishStocking?.stockingCustomer?.id === cookies.get('profileId');
  const isDisabledSubmit = isCustomer || submitLoading;

  const { id } = useParams();

  if (loading || fihTypesLoading) return <LoaderComponent />;

  const assignedTo = fishStocking?.assignedTo || fishStocking?.createdBy || null;

  const initialValues: RegistrationFormValues = {
    eventTime: fishStocking?.eventTime && !repeat ? new Date(fishStocking.eventTime) : undefined,
    fishOriginCompanyName: fishStocking?.fishOriginCompanyName || '',
    assignedTo: fishStocking?.assignedTo || user || undefined,
    fishOriginReservoir: fishStocking?.fishOriginReservoir || undefined,
    stockingCustomer: fishStocking?.stockingCustomer || undefined,
    phone: fishStocking?.phone || assignedTo?.phone || user?.phone || '',
    id: 0,
    fishOrigin: fishStocking?.fishOrigin || FishOriginTypes.GROWN,
    location: fishStocking?.location || undefined,
    batches: fishStocking?.batches || [{}],
    geom: fishStocking?.geom || undefined,
  };

  const handleSubmit = async (values: any) => {
    const {
      eventTime,
      phone,
      geom,
      location,
      assignedTo,
      fishOriginReservoir,
      fishOrigin,
      fishOriginCompanyName,
      stockingCustomer,
      batches,
    } = values;
    const params = {
      eventTime,
      phone: phone || undefined,
      geom,
      assignedTo: assignedTo?.id,
      stockingCustomer: stockingCustomer?.id,
      location: location,
      fishOrigin: fishOrigin.toUpperCase(),
      fishOriginCompanyName,
      ...(fishOriginReservoir && {
        fishOriginReservoir,
      }),
      batches: batches.map((batch) => {
        return {
          amount: batch.amount || undefined,
          weight: batch.weight || undefined,
          fishType: batch?.fishType?.id || undefined,
          fishAge: batch?.fishAge?.id || undefined,
        };
      }),
    };
    await handleCreateOrUpdate(params);
  };

  const handleCreateOrUpdate = async (params: any) => {
    if (isNew(id)) {
      return await createFishStockingMutation.mutateAsync(params);
    }

    return await updateFishStockingMutation.mutateAsync(params);
  };

  const handleDelete = async () => {
    deleteFishStockingMutation.mutateAsync();
  };

  const handleCancel = async () => {
    cancelFishStockingMutation.mutateAsync();
  };

  const getDeleteInfo = () => {
    const canDelete =
      fishStocking?.eventTime &&
      new Date(new Date().setDate(new Date().getDate() + minTime)) <
        new Date(fishStocking.eventTime);

    if (canDelete) {
      return {
        name: buttonsTitles.delete,
        description: 'Ar tikrai norite ištrinti būsimą įžuvinimą?',
        function: handleDelete,
      };
    }

    return {
      name: buttonsTitles.cancelFishStcoking,
      description: 'Ar tikrai norite atšaukti būsimą įžuvinimą?',
      function: handleCancel,
    };
  };

  const deleteInfo = getDeleteInfo();

  const validationSchema = () => {
    const applySchema = isFreelancer ? validateFreelancerFishStocking : validateFishStocking;
    return applySchema(minTime);
  };

  const filterFishTypes = (batches: any[]) => {
    const batchesFishTypesIds = batches.filter((b) => !!b.fishType?.id).map((b) => b.fishType?.id);
    return fishTypesFullList.filter((fishType) => {
      const inBatches = batchesFishTypesIds.includes(fishType.id);
      return !inBatches;
    });
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
      >
        {({ values, errors, handleSubmit, handleChange, setFieldValue }: any) => {
          const filteredFistTypes: FishType[] = filterFishTypes(values.batches || []);
          return (
            <InnerContainer>
              <StyledForm
                $display={!isMobile || !showMap}
                noValidate={true}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                tabIndex={0}
                onSubmit={handleSubmit}
              >
                <FishStockingPageTitle status={fishStocking?.status} />
                {renderTabs}
                <LocationInput
                  error={errors.location}
                  disabled={disabled}
                  value={values?.location?.name}
                  onOpen={() => toggleMapPreviewMode(true)}
                  handleSelectMap={() => {
                    toggleMapPreviewMode(false);
                    setQueryString(queryStrings.draw);
                    setShowMap(true);
                    setFieldValue('geom', undefined);
                    setFieldValue('location', undefined);
                  }}
                  onChange={(location: any) => {
                    toggleMapPreviewMode(true);
                    const { geom, ...rest } = location;
                    iframeRef?.current?.contentWindow?.postMessage(JSON.stringify({ geom }), '*');
                    setFieldValue('geom', geom);
                    setFieldValue('location', rest);
                  }}
                />
                <TimeRow>
                  <Datepicker
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
                    setFieldValue('fishOrigin', e);
                    setFieldValue('fishOriginCompanyName', '');
                    setFieldValue('fishOriginReservoir', '');
                  }}
                  disabled={disabled}
                />
                <Row>
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
                      onChange={(value) => setFieldValue('fishOriginReservoir', value)}
                      hasOptionKey={false}
                      getOptionValue={(option) => option?.cadastral_id}
                      getOptionLabel={(option) => {
                        return option?.name;
                      }}
                      setSuggestionsFromApi={(input: string, page: number) =>
                        getLocationList(input, page)
                      }
                    />
                  )}
                </Row>
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
                          setFieldValue('assignedTo', value);
                          setFieldValue('phone', value?.phone?.trim() || '');
                        }}
                        options={users}
                        disabled={isCustomer}
                      />

                      <NumericTextField
                        value={values.phone}
                        label={inputLabels.phone}
                        name="phone"
                        placeholder="064222222"
                        onChange={(value) => setFieldValue('phone', value)}
                        disabled={isCustomer}
                        error={errors.phone}
                      />
                    </Row>
                  </>
                )}

                <Subheader>{formLabels.stockingCustomer}</Subheader>
                <Row>
                  <AsyncSelectField
                    label="Įmonės pavadinimas"
                    name="stockingCustomer"
                    setSuggestionsFromApi={(input: string, page: number) =>
                      getTenantsList(input, page)
                    }
                    getOptionLabel={(option: any) => option?.name}
                    value={values.stockingCustomer}
                    error={errors.stockingCustomer}
                    onChange={(value: any) => setFieldValue('stockingCustomer', value)}
                    disabled={disabled}
                  />
                </Row>

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
                        <SimpleButton
                          onClick={() => {
                            arrayHelpers.push({});
                          }}
                        >
                          {buttonsTitles.addFish}
                        </SimpleButton>
                      )}
                    </div>
                  )}
                />
                <ButtonRow>
                  {!!fishStocking && (
                    <StyledButtons
                      type="button"
                      variant={Button.colors.DANGER}
                      onClick={() => setShowModal(true)}
                      disabled={isDisabledSubmit}
                    >
                      {deleteInfo.name}
                    </StyledButtons>
                  )}
                  <StyledButtons type="submit" loading={submitLoading} disabled={isDisabledSubmit}>
                    {buttonsTitles.save}
                  </StyledButtons>
                </ButtonRow>
                <Modal visible={showModal}>
                  <DeleteCard
                    agreeLabel={buttonsTitles.yes}
                    declineLabel={buttonsTitles.no}
                    action={deleteInfo.name}
                    title={''}
                    description={deleteInfo.description}
                    onSetClose={() => setShowModal(false)}
                    handleDelete={deleteInfo.function}
                    deleteInProgress={false}
                    name={''}
                  />
                </Modal>
              </StyledForm>
              <Map
                iframeRef={iframeRef}
                isMapPreviewMode={isMapPreviewMode}
                display={!isMobile || showMap}
                onClose={() => setShowMap(false)}
                value={values.geom}
                onSave={(geom, location) => {
                  setFieldValue('geom', geom);
                  setFieldValue('location', location);
                  setShowMap(false);
                }}
                queryString={queryString}
                height="100%"
              />
            </InnerContainer>
          );
        }}
      </Formik>
    </>
  );
};

const StyledForm = styled(Form)<{ $display: boolean }>`
  padding: 32px;
  flex-direction: column;
  gap: 12px;
  display: ${({ $display }) => ($display ? 'flex' : 'none')};
  overflow-y: auto;

  @media ${device.mobileL} {
    padding: 12px;
  }

  @media ${device.mobileL} {
    padding: 12px;
  }
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
const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 12px;
  padding: 10px 0 34px 0;
  @media ${device.mobileL} {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
`;

const StyledButtons = styled(Button)`
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const StyledTextInput = styled(TextField)``;

const Subheader = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.tertiary};
`;

export default RegistrationForm;
