import { FieldArray } from 'formik';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import { device } from '../../styles';
import api from '../../utils/api';
import PhotoUploadField from '../fields/PhotoUploadField';
import { TextField, TextAreaField, NumericTextField } from '@aplinkosministerija/design-system';
import ApproveFishRow from '../other/ApproveFishRow';
import SignatureRow from '../other/SignatureRow';

const Review = ({ fishStocking, disabled, values, errors, setFieldValue }: any) => {
  return (
    <>
      <Row>
        <StyledTextInp
          label="Važtaraščio nr."
          name="waybillNo"
          value={values.waybillNo}
          error={errors.waybillNo}
          onChange={(e) => setFieldValue(`waybillNo`, e)}
          disabled={disabled}
        />
      </Row>
      <Subheader>VANDENS TEMPERATŪRA</Subheader>
      <Row>
        <TempStyledTextInput
          label="Pervežimo taroje"
          name="containerWaterTemp"
          value={values.containerWaterTemp}
          error={errors.containerWaterTemp}
          onChange={(e) => setFieldValue(`containerWaterTemp`, e)}
          right={<InputInnerLabel>°C</InputInnerLabel>}
          disabled={disabled}
          returnNumber={true}
        />
        <TempStyledTextInput
          label="Telkininyje"
          name="waterTemp"
          value={values.waterTemp}
          error={errors.waterTemp}
          onChange={(e) => setFieldValue(`waterTemp`, e)}
          right={<InputInnerLabel>°C</InputInnerLabel>}
          disabled={disabled}
          returnNumber={true}
        />
      </Row>
      <Subheader>INFORMACIJA IŠ VETERINAJOS</Subheader>
      <InfoRow>
        <StyledTextInput
          label="Patvirtinimo nr."
          name="veterinaryApprovalNo"
          value={values.veterinaryApprovalNo}
          error={errors.veterinaryApprovalNo}
          onChange={(e) => setFieldValue(`veterinaryApprovalNo`, e)}
          disabled={disabled}
        />
        <StyledTextInput
          label="Patvirtinimo įsakymo nr."
          name="veterinaryApprovalOrderNo"
          subLabel="(neprivalomas)"
          value={values.veterinaryApprovalOrderNo}
          error={errors.veterinaryApprovalOrderNo}
          disabled={disabled}
          onChange={(e) => setFieldValue(`veterinaryApprovalOrderNo`, e)}
        />
      </InfoRow>
      {!isEmpty(values.batches) && (
        <Row>
          <FieldArray
            name="batches"
            render={(arrayHelpers) => (
              <div>
                <Subheader>FAKTINIS KIEKIS</Subheader>
                {values.batches?.map((item, index) => {
                  return (
                    <ApproveFishRow
                      disabled={disabled}
                      key={item.id}
                      item={item}
                      setFieldValue={setFieldValue}
                      arrayHelpers={arrayHelpers}
                      index={index}
                      errors={errors.batches?.[index]}
                      last={index === values.batches.length - 1}
                      showBottomLabel={true}
                    />
                  );
                })}
              </div>
            )}
          />
        </Row>
      )}
      <PhotoUploadField
        name={'images'}
        disabled={disabled}
        onUpload={async (photos: File[]) => {
          const uploadedPhotos = await api.uploadFiles(fishStocking.id, photos);
          setFieldValue('images', [...values.images, ...uploadedPhotos]);
        }}
        handleDelete={async (id, index) => {
          if (!values.images) return;

          setFieldValue('images', [
            ...values.images.slice(0, index as number),
            ...values.images.slice((index as number) + 1),
          ]);

          await api.deletePhoto(id);
        }}
        photos={values.images}
        getSrc={(photo) => `${photo?.url}`}
      />

      <SignatureRow
        setFieldValue={setFieldValue}
        signatures={values.signatures}
        errors={errors.signatures}
        disabled={disabled}
        municipalityId={fishStocking?.location?.municipality?.id}
      />

      <StyledTextArea
        label="Pastabos"
        disabled={disabled}
        name="comment"
        value={values.comment}
        error={errors.comment}
        onChange={(e: string) => setFieldValue(`comment`, e)}
        rows={4}
      />
    </>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  @media ${device.mobileL} {
    flex-direction: column;
  }
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  @media ${device.mobileL} {
    flex-direction: column;
  }
`;

const Subheader = styled.h1`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.tertiary};
  margin-top: 16px;
`;

const StyledTextArea = styled(TextAreaField)`
  margin-top: 16px;
`;

const StyledTextInput = styled(TextField)`
  flex: 1;
  min-width: 115px;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const StyledTextInp = styled(TextField)`
  width: 408px;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const TempStyledTextInput = styled(NumericTextField)`
  flex: 1;
  min-width: 115px;
  max-width: 200px;
  margin-bottom: 8px;
`;

const InputInnerLabel = styled.div`
  margin: auto 8px;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.primary + '8F'};
`;

export default Review;
