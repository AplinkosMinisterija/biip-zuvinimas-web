import { useEffect, useRef, useState } from 'react';

import { Form, Formik } from 'formik';
import styled from 'styled-components';

import Cookies from 'universal-cookie';
import {
  SelectField,
  TextField,
  Button,
  NumericTextField,
  PhoneField,
} from '@aplinkosministerija/design-system';
import DefaultLayout from '../components/Layouts/Default';
import Avatar from '../components/other/Avatar';
import DeleteCard from '../components/other/DeleteCard';
import Icon from '../components/other/Icon';
import LoaderComponent from '../components/other/LoaderComponent';
import Modal from '../components/other/Modal';
import { ButtonColors, device } from '../styles';
import api from '../utils/api';
import { RolesTypes } from '../utils/constants';
import { handleAlert } from '../utils/functions';
import { useGetCurrentProfile } from '../utils/hooks';

import React from 'react';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { intersectionObserverConfig } from '../utils/configs';
import { buttonsTitles, descriptions, formLabels, inputLabels } from '../utils/texts';
import { User } from '../utils/types';
import { validateNewTenantUser, validateUpdateTenantUser } from '../utils/validations';

const options = [
  { label: 'Administratorius', value: RolesTypes.USER_ADMIN },
  { label: 'Naudotojas', value: RolesTypes.USER },
];

const initUser = {
  id: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  personalCode: '',
  role: options[1]?.value,
};

const cookies = new Cookies();
const NariaiPage = () => {
  const [open, setOpen] = useState('');
  const currentProfile = useGetCurrentProfile();
  const [currentUser, setCurrentUser] = useState<any>(initUser); //TODO: should be defined another type for form instead of used type that will be returned from api

  const fetchTenantUsers = async (page: number) => {
    const tenantUsers = await api.tenantUsers({ page });

    const newUsers = tenantUsers?.rows.map((tenantUser) => {
      return {
        ...tenantUser.user,
        id: tenantUser.id,
        role: tenantUser.role,
      };
    });

    return {
      data: newUsers,
      page: tenantUsers.page < tenantUsers.totalPages ? tenantUsers.page + 1 : undefined,
    };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isFetching } =
    useInfiniteQuery({
      queryKey: ['tenantUsers'],
      queryFn: ({ pageParam }) => fetchTenantUsers(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.page,
    });

  const observerRef = useRef(null);

  useEffect(() => {
    const currentObserver = observerRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, intersectionObserverConfig);

    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data]);

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => api.deleteTenantUser(id),
    onError: () => {
      handleAlert();
    },
    onSuccess: () => {
      setOpen('');
      refetch();
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (params: User) => api.createTenantUser(params),
    onError: () => {
      handleAlert();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (user: User) => api.updateTenantUser({ role: user.role }, user?.id),
    onError: () => {
      handleAlert();
    },
  });

  const submitLoading = [updateUserMutation.isPaused, createUserMutation.isPending].some(
    (loading) => loading,
  );

  const handleSubmit = async (user: User) => {
    await createOrUpdateUser(user);
    setOpen('');
    refetch();
  };

  const createOrUpdateUser = async (user: User) => {
    const params = { ...user, tenant: parseInt(cookies.get('profileId')) };
    if (user.id) {
      await updateUserMutation.mutateAsync(user);
    } else {
      await createUserMutation.mutateAsync(params);
    }
  };

  const validationSchema = currentUser.id ? validateUpdateTenantUser : validateNewTenantUser;

  return (
    <DefaultLayout maxWidth="830px">
      <Container>
        <TopLine>
          <H1>
            {currentProfile?.name} {formLabels.members}
          </H1>
          <div style={{ width: 160 }}>
            <Button
              onClick={() => {
                setCurrentUser(initUser);
                setOpen('form');
              }}
              variant={ButtonColors.SECONDARY}
            >
              {buttonsTitles.add}
            </Button>
          </div>
        </TopLine>
        <CardContainer>
          {data?.pages.map((page: any, pageIndex) => {
            return (
              <React.Fragment key={pageIndex}>
                {page.data.map((user, index) => {
                  return (
                    <div key={user.id}>
                      <Card key={user.id}>
                        <InnerCardContainer
                          onClick={() => {
                            setCurrentUser(user);
                            setOpen('form');
                          }}
                        >
                          <Avatar name={user.firstName!} surname={user.lastName!} />
                          <NameContainer>
                            <Title>
                              {user.firstName} {user.lastName}
                            </Title>
                            <SubTitle>
                              {user.phone} {user.email}
                            </SubTitle>
                          </NameContainer>
                        </InnerCardContainer>

                        <IconContainer
                          onClick={() => {
                            setCurrentUser(user);
                            setOpen('remove');
                          }}
                        >
                          <Dots name="trashcan" />
                        </IconContainer>
                      </Card>
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
          {observerRef && <Invisible ref={observerRef} />}
          {isFetching && <LoaderComponent />}
        </CardContainer>
      </Container>
      <Modal
        onClose={() => {
          setOpen('');
        }}
        visible={!!open}
      >
        {open === 'form' ? (
          <PopContainer>
            <Close onClick={() => setOpen('')}>
              <Icon name="close" />
            </Close>
            <Formik
              enableReinitialize={true}
              initialValues={currentUser}
              onSubmit={handleSubmit}
              validateOnChange={false}
              validationSchema={validationSchema}
            >
              {({ values, errors, handleSubmit, setFieldValue }) => {
                const disabled = !!currentUser?.id;

                return (
                  <StyledForm
                    noValidate={true}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit();
                      }
                    }}
                    tabIndex={0}
                    onSubmit={handleSubmit}
                  >
                    <SubH1Container>
                      <H1>{!values.id ? descriptions.inviteUser : descriptions.updateUserInfo}</H1>
                      {!disabled && <SubH1>{descriptions.email}</SubH1>}
                    </SubH1Container>
                    <TextField
                      value={values.firstName}
                      label={inputLabels.firstName}
                      name="firstName"
                      onChange={(value) => setFieldValue('firstName', value)}
                      disabled={disabled}
                      error={errors.firstName}
                    />
                    <TextField
                      value={values.lastName}
                      label={inputLabels.lastName}
                      name="lastName"
                      onChange={(value) => setFieldValue('lastName', value)}
                      disabled={disabled}
                      error={errors.lastName}
                    />
                    <PhoneField
                      value={values.phone}
                      label={inputLabels.phone}
                      name="phone"
                      onChange={(value) => setFieldValue('phone', value)}
                      disabled={disabled}
                      error={errors.phone}
                    />
                    <TextField
                      value={values.email}
                      label={inputLabels.email}
                      name="email"
                      onChange={(value) => setFieldValue('email', value)}
                      disabled={disabled}
                      error={errors.email}
                    />
                    {!currentUser?.id && (
                      <NumericTextField
                        value={values.personalCode}
                        label={inputLabels.personalCode}
                        name="personalCode"
                        onChange={(value) => setFieldValue('personalCode', value)}
                        error={errors.personalCode}
                      />
                    )}
                    <SelectField
                      options={options}
                      getOptionLabel={(option) => option.label}
                      value={options.find((opt) => opt.value === values.role)}
                      label={inputLabels.role}
                      name="role"
                      onChange={(val) => setFieldValue('role', val.value)}
                      error={errors.role}
                    />
                    <DownBar>
                      <Button
                        variant="transparent"
                        type="reset"
                        onClick={() => {
                          setOpen('');
                        }}
                      >
                        {buttonsTitles.cancel}
                      </Button>
                      <Button
                        loading={submitLoading}
                        variant="primary"
                        type="submit"
                        disabled={submitLoading}
                      >
                        {buttonsTitles.save}
                      </Button>
                    </DownBar>
                  </StyledForm>
                );
              }}
            </Formik>
          </PopContainer>
        ) : (
          <DeleteCardContainer>
            <DeleteCard
              action="Pašalinti"
              title={''}
              description={'Ar norite pašalinti įmonės darbuotoją'}
              name={`${currentUser?.firstName} ${currentUser?.lastName}`}
              onSetClose={() => setOpen('')}
              handleDelete={() =>
                currentUser?.id ? deleteUserMutation.mutateAsync(currentUser.id) : {}
              }
              deleteInProgress={deleteUserMutation.isPending}
            />
          </DeleteCardContainer>
        )}
      </Modal>
    </DefaultLayout>
  );
};

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  &:focus {
    outline: none;
  }
`;

const TopLine = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  @media ${device.mobileL} {
    flex-direction: column;
  }
`;

const Container = styled.div`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  padding: 8px;

  @media ${device.mobileL} {
    padding: 12px;
  }
`;

const H1 = styled.h1`
  font-size: 2.4rem;
`;

const IconContainer = styled.div`
  color: #121a558a;
  cursor: pointer;
`;

const Dots = styled(Icon)`
  color: rgb(122, 126, 159);
  font-size: 3rem;
  margin: 0px 10px auto auto;
`;
const Title = styled.h3`
  text-align: left;
  font: normal normal bold 16px/22px;
  letter-spacing: 0px;
  color: #121a55;
  padding: 0;
  margin: 0;
`;
const SubTitle = styled.h4`
  text-align: left;
  font: normal normal medium 14px/19px;
  letter-spacing: 0px;
  color: #121a558f;
  padding: 0;
  margin: 0;
`;
const NameContainer = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;
`;
const Card = styled.div`
  padding-left: 10px;
  display: flex;
  min-width: 564px;
  height: 72px;
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 8px 16px #121a5514;
  justify-content: space-between;
  border: 1px solid #b3b5c48f;
  border-radius: 8px;
  opacity: 1;
  flex-direction: row;
  align-items: center;
  @media ${device.mobileL} {
    min-width: 100%;
  }
`;
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0px;
  @media ${device.mobileL} {
    padding: 12px;
  }
`;

const InnerCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

const Close = styled.div`
  position: absolute;
  cursor: pointer;
  right: 10px;
  top: 10px;
  font-size: 3rem;
`;

const PopContainer = styled.div`
  position: relative;
  display: flex;
  padding: 64px;
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 10px;
  flex-direction: column;
  background-color: white;
  box-shadow: 0px 18px 41px #121a5529;
  border-radius: 10px;
  @media ${device.mobileL} {
    border-radius: 0px;
    margin: 0px;
    width: 100%;
    max-width: 100%;
    padding: 32px;
  }
`;

const DeleteCardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Invisible = styled.div`
  width: 10px;
  height: 16px;
`;

const SubH1Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-bottom: 31px;
`;
const SubH1 = styled.div`
  text-align: center;
  font: normal normal medium 16px/26px;
  letter-spacing: 0px;
  color: #7a7e9f;
  opacity: 1;
  max-width: 400px;
`;

const DownBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
`;

export default NariaiPage;
