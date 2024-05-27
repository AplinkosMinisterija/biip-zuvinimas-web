import { useRef, useState } from 'react';
import styled from 'styled-components';
import Cookies from 'universal-cookie';
import { FishOriginTypes, FishStockingStatus } from '../../utils/constants';
import { FishStocking, FishType, RegistrationFormData, ReviewFormData } from '../../utils/types';
import Registration from './Registration';
import Review from './Review';
import { handleAlert, isNew } from '../../utils/functions';
import { useSearchParams } from 'react-router-dom';
import { useParams } from 'react-router';
import Map from '../other/RegistrationMap';
import { Form, Formik } from 'formik';
import { device } from '../../styles';
import { useMediaQuery } from '@material-ui/core';
import { buttonsTitles } from '../../utils/texts';
import { validateFishStocking, validateFreelancerFishStocking } from '../../utils/validations';
import { useAppSelector } from '../../state/hooks';
import { useMutation, useQuery } from 'react-query';
import api from '../../utils/api';
import {
  useCurrentLocation,
  useFishStockingCallbacks,
  useIsFreelancer,
  useSettings,
} from '../../utils/hooks';
import FishStockingPageTitle from '../other/PageTitle';
import Modal from '../other/Modal';
import DeleteCard from '../other/DeleteCard';
import { Button } from '@aplinkosministerija/design-system';
import { isEmpty } from 'lodash';

const tabs = [
  { label: 'Registracijos duomenys', route: FishStockingStatus.UPCOMING },
  { label: 'Faktiniai duomenys', route: FishStockingStatus.ONGOING },
];

const cookies = new Cookies();

const Unfinished = ({ fishStocking }: { fishStocking?: FishStocking }) => {
  const [showMap, setShowMap] = useState(false);
  const [queryString, setQueryString] = useState('');
  const isMobile = useMediaQuery(device.mobileL);
  const iframeRef = useRef<any>(null);
  const [showModal, setShowModal] = useState(false);

  const [geom, setGeom] = useState(fishStocking?.geom);

  const { minTime, loading } = useSettings();
  const isFreelancer = useIsFreelancer();

  const user = useAppSelector((state) => state?.user?.userData);

  const [searchParams] = useSearchParams();
  const { repeat } = Object.fromEntries([...Array.from(searchParams)]);
  const { id } = useParams();

  const currentLocation = useCurrentLocation();

  const repeating = fishStocking?.id.toString() === repeat;

  const [selectedTab, setSelectedTab] = useState(
    !fishStocking || fishStocking?.status === FishStockingStatus.UPCOMING || repeating
      ? FishStockingStatus.UPCOMING
      : FishStockingStatus.ONGOING,
  );

  const { data, isLoading: fihTypesLoading } = useQuery('fishTypes', () => api.getFishTypes(), {
    onError: () => {
      handleAlert();
    },
  });

  const fishTypesFullList = data?.rows || [];

  const callBacks = useFishStockingCallbacks();

  const createOrUpdateFishStockingMutation = useMutation(
    (params: RegistrationFormData) =>
      fishStocking?.id && !repeating
        ? api.updateFishStocking(params, fishStocking.id.toString())
        : api.registerFishStocking(params),
    { ...callBacks },
  );

  const reviewFishStockingMutation = useMutation((params: any) => api.reviewFishStocking(params), {
    ...callBacks,
  });

  const cancelFishStockingMutation = useMutation(() => api.cancelFishStocking(id!), {
    ...callBacks,
  });

  const deleteFishStockingMutation = useMutation(() => api.cancelFishStocking(id!), {
    ...callBacks,
  });

  const submitLoading = [
    createOrUpdateFishStockingMutation.isLoading,
    reviewFishStockingMutation.isLoading,
    cancelFishStockingMutation.isLoading,
    deleteFishStockingMutation.isLoading,
  ].some((loading) => loading);

  const isCustomer = fishStocking?.stockingCustomer?.id === cookies.get('profileId');
  const isDisabledSubmit = isCustomer || submitLoading;

  const handleDelete = async () => {
    await deleteFishStockingMutation.mutateAsync();
  };

  const handleCancel = async () => {
    await cancelFishStockingMutation.mutateAsync();
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

  const assignedTo = fishStocking?.assignedTo || fishStocking?.createdBy || null;

  const inspector = fishStocking?.inspector;

  const initialBatches = () => {
    if (fishStocking) {
      return fishStocking?.batches.map((batch) => ({
        id: batch.id,
        fishType: batch.fishType,
        fishAge: batch.fishAge,
        amount: batch.amount || '',
        weight: batch.weight || '',
        reviewWeight: repeating ? undefined : batch.reviewWeight || '',
        reviewAmount: repeating ? undefined : batch.reviewAmount || '',
      }));
    }
    return [{}];
  };

  const initialValues: any = {
    id: repeating ? fishStocking?.id : undefined,
    eventTime: repeating || !fishStocking ? undefined : new Date(fishStocking.eventTime),
    fishOriginCompanyName: fishStocking?.fishOriginCompanyName || '',
    assignedTo: fishStocking?.assignedTo || user || undefined,
    fishOriginReservoir: fishStocking?.fishOriginReservoir || undefined,
    stockingCustomer: fishStocking?.stockingCustomer || undefined,
    phone: fishStocking?.phone || assignedTo?.phone || user?.phone || '',
    fishOrigin: fishStocking?.fishOrigin || FishOriginTypes.GROWN,
    location: fishStocking?.location || undefined,
    batches: initialBatches(),
    containerWaterTemp: repeating ? undefined : fishStocking?.containerWaterTemp || 0,
    waterTemp: repeating ? undefined : fishStocking?.waterTemp || 0,
    images: repeating ? undefined : fishStocking?.images || [],
    veterinaryApprovalNo: repeating ? undefined : fishStocking?.veterinaryApprovalNo,
    waybillNo: repeating ? undefined : fishStocking?.waybillNo,
    veterinaryApprovalOrderNo: repeating ? undefined : fishStocking?.veterinaryApprovalOrderNo,
    comment: repeating ? undefined : fishStocking?.comment || '',
    signatures: repeating
      ? []
      : !isEmpty(inspector)
      ? [
          {
            organization: inspector?.organization,
            signature: '',
            phone: inspector?.phone,
            signedBy: `${inspector?.firstName} ${inspector?.lastName}`,
          },
        ]
      : [],
  };

  const submitReview = async (values: any) => {
    if (!fishStocking?.id) {
      return;
    }
    const {
      waybillNo,
      signatures,
      veterinaryApprovalNo,
      veterinaryApprovalOrderNo,
      containerWaterTemp,
      waterTemp,
      batches,
      comment,
    } = values;

    const params: ReviewFormData = {
      id: fishStocking.id,
      waybillNo,
      veterinaryApprovalNo,
      veterinaryApprovalOrderNo,
      comment,
      containerWaterTemp: parseFloat(containerWaterTemp?.toString()),
      waterTemp: parseFloat(waterTemp?.toString()),
      reviewLocation: currentLocation,
      signatures,
      batches: batches.map((batch) => {
        return {
          id: batch.id,
          reviewAmount: batch.reviewAmount,
          reviewWeight: batch.reviewWeight,
        };
      }),
    };

    await reviewFishStockingMutation.mutateAsync(params);
  };

  const submitRegistration = async (values: any) => {
    const {
      eventTime,
      phone,
      location,
      assignedTo,
      fishOriginReservoir,
      fishOrigin,
      fishOriginCompanyName,
      stockingCustomer,
      batches,
    } = values;

    const params: RegistrationFormData = {
      geom,
      eventTime,
      location: {
        name: location?.name,
        cadastral_id: location?.cadastral_id,
        municipality: location?.municipality,
        area: location?.area || 0,
      },
      stockingCustomer: stockingCustomer?.id,
      fishOrigin: fishOrigin.toUpperCase(),
      ...(fishOrigin === 'CAUGHT' ? { fishOriginReservoir } : { fishOriginCompanyName }),
      phone: phone || undefined,
      assignedTo: assignedTo?.id,
      batches: batches.map((batch) => {
        return {
          amount: batch.amount || undefined,
          weight: batch.weight || undefined,
          fishType: batch?.fishType?.id || undefined,
          fishAge: batch?.fishAge?.id || undefined,
        };
      }),
    };

    await createOrUpdateFishStockingMutation.mutateAsync(params);
  };

  const handleSubmit = async (values: any) => {
    if (selectedTab === FishStockingStatus.UPCOMING) {
      await submitRegistration(values);
    } else {
      await submitReview(values);
    }
  };

  const renderTabs = (
    <TabsContainer>
      {tabs.map((tab) => (
        <MenuButton
          key={tab.route}
          $isSelected={tab.route === selectedTab}
          onClick={() => setSelectedTab(tab.route)}
        >
          {tab.label}
        </MenuButton>
      ))}
    </TabsContainer>
  );

  const disabledRegistration =
    !!fishStocking &&
    (fishStocking?.status !== FishStockingStatus.UPCOMING ||
      fishStocking?.stockingCustomer?.id === cookies.get('profileId')) &&
    !repeating;

  const disabledReview = !repeating && fishStocking?.status !== FishStockingStatus.ONGOING;

  const renderContent = ({ errors, values, setFieldValue, setValues }: any) => {
    if (selectedTab === FishStockingStatus.ONGOING) {
      return (
        <Review
          disabled={disabledReview}
          fishStocking={fishStocking!}
          values={values}
          errors={errors}
          setFieldvalue={setFieldValue}
        />
      );
    }

    return (
      <Registration
        fishStocking={fishStocking}
        errors={errors}
        values={values}
        isCustomer={isCustomer}
        setFieldValue={setFieldValue}
        setValues={setValues}
        submitLoading={submitLoading}
        setGeom={setGeom}
        disabled={disabledRegistration}
      />
    );
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        validateOnChange={false}
      >
        {(formikParams: any) => {
          const { setFieldValue, handleSubmit } = formikParams;
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
                {renderContent(formikParams)}
                <ButtonRow>
                  {!!fishStocking && (
                    <StyledButtons
                      type="button"
                      variant="danger"
                      disabled={false}
                      onClick={() => setShowModal(true)}
                    >
                      {deleteInfo.name}
                    </StyledButtons>
                  )}
                  <StyledButtons type="submit" loading={submitLoading} disabled={submitLoading}>
                    {buttonsTitles.save}
                  </StyledButtons>
                </ButtonRow>
                <Modal visible={showModal}>
                  <DeleteCard
                    title={''}
                    agreeLabel={buttonsTitles.yes}
                    declineLabel={buttonsTitles.no}
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
                display={!isMobile || showMap}
                onClose={() => setShowMap(false)}
                value={geom}
                onSave={({ geom, data }) => {
                  setGeom(geom);
                  setFieldValue('location', data);
                  setShowMap(false);
                }}
                queryString={queryString}
                height="100%"
                disabled={!!id}
              />
            </InnerContainer>
          );
        }}
      </Formik>
    </>
  );
};

const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

const MenuButton = styled.div<{ $isSelected: boolean }>`
  color: ${({ theme, $isSelected }) => ($isSelected ? 'white' : theme.colors.primary)};
  font-size: 1.4rem;
  cursor: pointer;
  position: relative;
  padding: 0 0 4px 0;
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary : 'transparent'};
  padding: 8px 16px;
  border-radius: 24px;
  text-align: center;
  justify-content: center;
`;

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

const StyledForm = styled(Form)<{ $display?: boolean }>`
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
  width: fit-content;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

export default Unfinished;
