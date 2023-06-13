import styled from "styled-components";

import { Form, Formik } from "formik";
import { isEmpty } from "lodash";
import { useState } from "react";
import Button, { ButtonColors } from "../components/buttons/Button";
import TextField from "../components/fields/TextField";
import DefaultLayout from "../components/Layouts/Default";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { actions } from "../state/user/reducer";
import { device } from "../styles";
import api from "../utils/api";
import {
  handleGetCurrentUser,
  handleResponse,
  handleSuccess
} from "../utils/functions";
import {
  buttonsTitles,
  descriptions,
  inputLabels,
  toasts
} from "../utils/texts";
import { validateMyProfile } from "../utils/validations";

const MyProfile = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user?.userData);
  const [loading, setLoading] = useState(false);

  const updateMyProfile = async (data: { email?: string; phone?: string }) => {
    if (isEmpty(data)) return;
    setLoading(true);
    await handleResponse({
      endpoint: () => api.updateMyProfile(data),
      onSuccess: async () => {
        const currentUserData = await handleGetCurrentUser();
        if (currentUserData) {
          handleSuccess(toasts.profileUpdated);
          dispatch(actions.setUser(currentUserData));
        }
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      }
    });
  };

  const initialValues = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phone: user?.phone
  };

  return (
    <DefaultLayout>
      <Container>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          onSubmit={(values) =>
            updateMyProfile({ email: values.email, phone: values.phone })
          }
          validateOnChange={false}
          validationSchema={validateMyProfile}
        >
          {({ values, errors, handleSubmit, setFieldValue }) => {
            const disabled = !user?.id;

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
                <TopLine>
                  <H1>{descriptions.myProfile}</H1>
                </TopLine>
                <TextField
                  value={values.firstName}
                  label={inputLabels.firstName}
                  name="firstName"
                  onChange={(value) => setFieldValue("firstName", value)}
                  disabled={true}
                  error={errors.firstName}
                />
                <TextField
                  value={values.lastName}
                  label={inputLabels.lastName}
                  name="lastName"
                  onChange={(value) => setFieldValue("lastName", value)}
                  disabled={true}
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
                <DownBar>
                  <Button variant={ButtonColors.TRANSPARENT} type="reset">
                    {buttonsTitles.clear}
                  </Button>
                  <Button
                    loading={loading}
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
      </Container>
    </DefaultLayout>
  );
};

const Container = styled.div`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  padding: 32px;

  @media ${device.mobileL} {
    padding: 12px;
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0 auto;
  display: flex;
  &:focus {
    outline: none;
  }
  @media ${device.mobileL} {
    margin: 0;
  }
`;

const H1 = styled.h1`
  font-size: 2.4rem;
`;

const TopLine = styled.div`
  display: flex;
  width: 100%;
  min-width: 400px;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  @media ${device.mobileL} {
    flex-direction: column;
  }
`;

const DownBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
`;

export default MyProfile;
