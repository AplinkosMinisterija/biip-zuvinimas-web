import { Formik } from "formik";
import { useState } from "react";
import styled from "styled-components";
import Button from "../components/buttons/Button";
import PasswordField from "../components/fields/PasswordField";
import TextField from "../components/fields/TextField";
import { LoginLayout } from "../components/Layouts/Login";
import { useAppDispatch } from "../state/hooks";
import { actions } from "../state/user/reducer";
import api from "../utils/api";
import {
  handleEGatesSign,
  handleGetCurrentUser,
  handleResponse,
  handleUpdateTokens
} from "../utils/functions";
import { buttonLabels, formLabels, inputLabels } from "../utils/texts";
import { loginSchema } from "../utils/validations";

export const Login = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [eLoading, setELoading] = useState(false);

  const handleSubmit = async ({
    email,
    password
  }: {
    email: string;
    password: string;
  }) => {
    const params = { email, password };
    setLoading(true);

    await handleResponse({
      endpoint: () => api.login(params),
      onSuccess: handleSuccess
    });
  };

  const handleSuccess = async (data: any) => {
    handleUpdateTokens(data);
    const currentUserData = await handleGetCurrentUser(true);
    if (currentUserData) {
      dispatch(actions.setUser(currentUserData));
    }
    setLoading(false);
  };

  const handleEGateSIgn = async () => {
    setELoading(true);
    await handleEGatesSign();
    setELoading(false);
  };

  return (
    <LoginLayout>
      <Formik
        validationSchema={loginSchema}
        initialValues={{ email: "", password: "" }}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ values, errors, setFieldValue, handleSubmit }) => (
          <FormContainer
            onSubmit={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          >
            <H1>{formLabels.login}</H1>
            {
              //process.env.NODE_ENV !== "production" && (
              <InnerContainer>
                <TextField
                  label={inputLabels.email}
                  type="email"
                  value={values.email}
                  error={errors.email}
                  onChange={(e) => setFieldValue("email", e)}
                />
                <PasswordField
                  label={inputLabels.password}
                  value={values.password}
                  error={errors.password}
                  onChange={(e) => setFieldValue("password", e)}
                />
                <ButtonContainer>
                  <StyledButton loading={loading} type="submit">
                    {buttonLabels.login}
                  </StyledButton>
                </ButtonContainer>

                <OrContainer>
                  <Or>
                    <Separator />
                    <SeparatorLabelContainer>
                      <SeparatorLabel> {buttonLabels.or}</SeparatorLabel>
                    </SeparatorLabelContainer>
                  </Or>
                </OrContainer>
              </InnerContainer>
            }
            <StyledButton
              loading={eLoading}
              type="button"
              onClick={handleEGateSIgn}
            >
              {buttonLabels.eLogin}
            </StyledButton>
          </FormContainer>
        )}
      </Formik>
    </LoginLayout>
  );
};

const StyledButton = styled(Button)`
  width: 100%;
  max-width: 300px;
`;

const ButtonContainer = styled.div`
  margin-top: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const H1 = styled.h1`
  text-align: center;
  font: normal normal bold 32px/44px;
  letter-spacing: 0px;
  color: #121a55;
  opacity: 1;
  padding-bottom: 24px;
  @media only screen and (max-width: 1000px) {
    padding-bottom: 0px;
  }
`;

const FormContainer = styled.form`
  width: 100%;
  height: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrContainer = styled.div`
  width: 100%;
`;

const Or = styled.div`
  width: 100%;
  height: 50px;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const SeparatorLabelContainer = styled.div`
  font: normal normal 600 16px/40px;
  letter-spacing: 1.02px;
  color: #0b1f518f;
  position: absolute;
  max-width: 400px;
  width: 100%;
  text-align: center;
  opacity: 1;
`;

const SeparatorLabel = styled.span`
  font: normal normal 600 16px/40px;
  letter-spacing: 1.02px;
  color: #0b1f518f;
  background-color: white;
  padding: 0 8px;
  margin: 0 auto;
  vertical-align: middle;
  opacity: 1;
`;

const Separator = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme?.colors?.border};
  margin: auto 0;
  position: absolute;
  max-width: 400px;
  width: 100%;
  margin: 24px 0;
`;
