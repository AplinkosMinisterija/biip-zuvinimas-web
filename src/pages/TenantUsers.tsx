import { useEffect, useState } from "react";

import { Form, Formik } from "formik";
import styled from "styled-components";

import Cookies from "universal-cookie";
import Button, { ButtonColors } from "../components/buttons/Button";
import SelectField from "../components/fields/SelectField";
import TextField from "../components/fields/TextField";
import DefaultLayout from "../components/Layouts/Default";
import Avatar from "../components/other/Avatar";
import DeleteCard from "../components/other/DeleteCard";
import Icon from "../components/other/Icon";
import LoaderComponent from "../components/other/LoaderComponent";
import Modal from "../components/other/Modal";
import { device } from "../styles";
import api, { GetAllResponse } from "../utils/api";
import { RolesTypes } from "../utils/constants";
import { handleResponse } from "../utils/functions";
import { useGetCurrentProfile } from "../utils/hooks";
import {
  buttonsTitles,
  descriptions,
  formLabels,
  inputLabels
} from "../utils/texts";
import { TenantUser, User } from "../utils/types";
import {
  validateNewTenantUser,
  validateUpdateTenantUser
} from "../utils/validations";
const options = [
  { label: "Administratorius", value: RolesTypes.USER_ADMIN },
  { label: "Naudotojas", value: RolesTypes.USER }
];

const initUser = {
  id: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  personalCode: "",
  role: options[1]?.value
};

const cookies = new Cookies();
const NariaiPage = () => {
  const [open, setOpen] = useState("");
  const currentProfile = useGetCurrentProfile();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(initUser);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState(false);

  const getUsers = async (page: number) => {
    setLoading(true);

    await handleResponse({
      endpoint: () => api.tenantUsers({ page: page }),
      onSuccess: (list: GetAllResponse<TenantUser>) => {
        setCurrentPage(list.page);
        setHasMore(list.page < list.totalPages);

        const newUsers = list?.rows.map((tenantUser) => {
          return {
            ...tenantUser.user,
            id: tenantUser.id,
            role: tenantUser.role
          };
        });

        if (page == 1) {
          setUsers(newUsers);
        } else {
          setUsers([...users, ...newUsers]);
        }
        setLoading(false);
      }
    });

    setLoading(false);
  };

  const handleScroll = async (e: any) => {
    const element = e.currentTarget;
    const isTheBottom =
      Math.abs(
        element.scrollHeight - element.clientHeight - element.scrollTop
      ) < 1;

    if (isTheBottom && hasMore && !loading) {
      getUsers(currentPage + 1);
    }
  };

  const deleteUser = async (id?: string) => {
    if (!id) return;
    setDeleteLoading(true);
    await handleResponse({
      endpoint: () => api.deleteTenantUser(id),
      onSuccess: () => {
        getUsers(1);
        setOpen("");
      }
    });
    setDeleteLoading(false);
  };

  useEffect(() => {
    getUsers(1);
  }, []);

  const handleSubmit = async (user: any) => {
    setSubmitLoading(true);
    await createOrUpdateUser(user);
    setSubmitLoading(false);

    getUsers(1);
    setOpen("");
  };

  const createOrUpdateUser = async (user: User) => {
    const params = { ...user, tenant: parseInt(cookies.get("profileId")) };
    if (!!user.id) {
      await handleResponse({
        endpoint: () => api.updateTenantUser({ role: user.role }, user?.id!),
        onSuccess: () => {}
      });
    } else {
      await handleResponse({
        endpoint: () => api.createTenantUser(params),
        onSuccess: () => {}
      });
    }
  };

  return (
    <DefaultLayout onScroll={handleScroll} maxWidth="830px">
      <Container>
        <TopLine>
          <H1>
            {currentProfile?.name} {formLabels.members}
          </H1>
          <div style={{ width: 160 }}>
            <Button
              height={40}
              onClick={() => {
                setCurrentUser(initUser);
                setOpen("form");
              }}
              variant={ButtonColors.SECONDARY}
            >
              {buttonsTitles.add}
            </Button>
          </div>
        </TopLine>
        <CardContainer>
          {(users || []).map((user) => {
            return (
              <div key={user.id}>
                <Card key={user.id}>
                  <InnerCardContainer
                    onClick={() => {
                      setCurrentUser(user);
                      setOpen("form");
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
                      setOpen("remove");
                    }}
                  >
                    <Dots name="trashcan" />
                  </IconContainer>
                </Card>
              </div>
            );
          })}
          {loading && <LoaderComponent />}
        </CardContainer>
      </Container>
      <Modal
        onClose={() => {
          setOpen("");
        }}
        visible={!!open}
      >
        {open === "form" ? (
          <PopContainer>
            <Close onClick={() => setOpen("")}>
              <Icon name="close" />
            </Close>
            <Formik
              enableReinitialize={true}
              initialValues={currentUser}
              onSubmit={handleSubmit}
              validateOnChange={false}
              validationSchema={
                currentUser.id
                  ? validateUpdateTenantUser
                  : validateNewTenantUser
              }
            >
              {({ values, errors, handleSubmit, setFieldValue }) => {
                const disabled = !!currentUser?.id;

                return (
                  <StyledForm
                    noValidate={true}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                    tabIndex={0}
                    onSubmit={handleSubmit}
                  >
                    <SubH1Container>
                      <H1>
                        {!values.id
                          ? descriptions.inviteUser
                          : descriptions.updateUserInfo}
                      </H1>
                      {!disabled && <SubH1>{descriptions.email}</SubH1>}
                    </SubH1Container>
                    <TextField
                      value={values.firstName}
                      label={inputLabels.firstName}
                      name="firstName"
                      onChange={(value) => setFieldValue("firstName", value)}
                      disabled={disabled}
                      error={errors.firstName}
                    />
                    <TextField
                      value={values.lastName}
                      label={inputLabels.lastName}
                      name="lastName"
                      onChange={(value) => setFieldValue("lastName", value)}
                      disabled={disabled}
                      error={errors.lastName}
                    />
                    <TextField
                      value={values.phone}
                      label={inputLabels.phone}
                      name="phone"
                      placeholder="864222222"
                      onChange={(value) => setFieldValue("phone", value)}
                      disabled={disabled}
                      error={errors.phone}
                    />
                    <TextField
                      value={values.email}
                      label={inputLabels.email}
                      name="email"
                      onChange={(value) => setFieldValue("email", value)}
                      disabled={disabled}
                      error={errors.email}
                    />
                    {!currentUser?.id && (
                      <TextField
                        value={values.personalCode}
                        label={inputLabels.personalCode}
                        name="personalCode"
                        onChange={(value) =>
                          setFieldValue("personalCode", value)
                        }
                        error={errors.personalCode}
                      />
                    )}
                    <SelectField
                      options={options}
                      getOptionLabel={(option) => option.label}
                      value={options.find((opt) => opt.value === values.role)}
                      label={inputLabels.role}
                      name="role"
                      onChange={(val) => setFieldValue("role", val.value)}
                      error={errors.role}
                    />
                    <DownBar>
                      <Button
                        variant={ButtonColors.TRANSPARENT}
                        type="reset"
                        onClick={() => {
                          setOpen("");
                        }}
                      >
                        {buttonsTitles.cancel}
                      </Button>
                      <Button
                        loading={submitLoading}
                        variant={ButtonColors.PRIMARY}
                        type="submit"
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
              title={""}
              description={"Ar norite pašalinti įmonės darbuotoją"}
              name={`${currentUser?.firstName} ${currentUser?.lastName}`}
              onSetClose={() => setOpen("")}
              handleDelete={() => deleteUser(currentUser?.id)}
              deleteInProgress={deleteLoading}
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
    width:100%
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
