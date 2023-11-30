import { FieldArray } from 'formik';
import { find } from 'lodash';
import styled from 'styled-components';
import { device } from '../../styles';
import { useSignatureUsers } from '../../utils/hooks';
import { buttonsTitles } from '../../utils/texts';
import SimpleButton from '../buttons/SimpleButton';
import NumericTextField from '../fields/NumericTextField';
import SuggestionsSelect from '../fields/SuggestionsSelect';
import Icon from '../other/Icon';
import SignatureField from './Signature';

export interface SignatureRowProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  disabled?: boolean;
  errors?: any;
  signatures?: {
    organization?: string; //'ZUV', 'AAD', 'SAV'
    signature?: string;
    phone?: string;
    signedBy?: any;
  }[];
  municipalityId?: string;
}

const SignatureRow = ({
  setFieldValue,
  signatures,
  disabled,
  errors,
  municipalityId,
}: SignatureRowProps) => {
  const signatureUsers: { id: string; name: string; users: string[] }[] =
    useSignatureUsers(municipalityId);

  return (
    <FieldArray
      name="signatures"
      render={(arrayHelpers) => (
        <div>
          {signatures?.map((item, index) => {
            const error = errors?.[index];

            const signatureUser = find(signatureUsers, (signatureUser) => {
              return item?.organization === signatureUser.id;
            });
            const users = signatureUser?.users || [];

            const organization = signatureUser?.name || '';

            return (
              <Row key={index}>
                <SuggestionsSelect
                  getOptionLabel={(option) => {
                    return option?.name;
                  }}
                  getInputLabel={(option) => {
                    return option;
                  }}
                  options={signatureUsers}
                  label="Organizacija"
                  name="organization"
                  showError={false}
                  value={organization}
                  error={error?.organization}
                  onSelect={(value) => {
                    setFieldValue(`signatures.${index}.organization`, value?.id);
                  }}
                  onChange={(value) => {
                    setFieldValue(`signatures.${index}.organization`, value);
                  }}
                />

                <SuggestionsSelect
                  label="Vardas ir pavardė"
                  name="signedBy"
                  showError={false}
                  disabled={!item?.organization}
                  value={item.signedBy}
                  error={error?.signedBy}
                  getOptionLabel={(option) => option.fullName}
                  options={users}
                  onSelect={(value) => {
                    setFieldValue(`signatures.${index}.signedBy`, value?.fullName);
                  }}
                  onChange={(value) => {
                    setFieldValue(`signatures.${index}.signedBy`, value);
                  }}
                  getInputLabel={(option) => {
                    return option;
                  }}
                />
                <NumericTextField
                  label="Telefonas"
                  name="phone"
                  value={item?.phone}
                  wholeNumber={true}
                  placeholder=""
                  error={error?.phone}
                  onChange={(value) => {
                    setFieldValue(`signatures.${index}.phone`, value);
                  }}
                  disabled={disabled}
                />

                <SignatureField
                  value={item.signature}
                  onChange={(e: any) => {
                    setFieldValue(`signatures.${index}.signature`, e);
                  }}
                />
                <DeleteButton onClick={() => arrayHelpers.remove(Number(index))}>
                  <DeleteIcon name={'delete'} />
                </DeleteButton>
              </Row>
            );
          })}
          {!disabled && (
            <SimpleButton
              onClick={() => {
                arrayHelpers.push({
                  organization: '',
                  signedBy: '',
                  signature: '',
                });
              }}
            >
              {buttonsTitles.addSignature}
            </SimpleButton>
          )}
        </div>
      )}
    />
  );
};

const Row = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr 50px;
  margin-bottom: 12px;
  gap: 12px;
  width: 100%;
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

const DeleteButton = styled.div`
  margin-top: auto;
  height: 40px;
  display: flex;
  @media ${device.mobileL} {
    margin-bottom: 0px;
    height: auto;
  }
`;

const DeleteIcon = styled(Icon)`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.error};
  font-size: 2.4rem;
  margin: auto 0 auto 0px;
  @media ${device.mobileL} {
    margin: 8px 0 16px 0;
  }
`;

export default SignatureRow;
