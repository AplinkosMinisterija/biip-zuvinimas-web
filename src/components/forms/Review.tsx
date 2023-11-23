import { useMediaQuery } from "@material-ui/core";
import { FieldArray, Form, Formik } from "formik";
import { isEmpty } from "lodash";
import { useState } from "react";
import { useMutation } from "react-query";
import { useParams } from "react-router";

import styled from "styled-components";
import { device } from "../../styles";
import api from "../../utils/api";
import {
  useCurrentLocation,
  useFishStockingCallbacks
} from "../../utils/hooks";
import { buttonsTitles } from "../../utils/texts";
import { FishStocking } from "../../utils/types";
import { validateFishStockingReview } from "../../utils/validations";
import Button, { ButtonColors } from "../buttons/Button";
import NumericTextField from "../fields/NumericTextField";
import PhotoUploadField from "../fields/PhotoUploadField";
import TextAreaField from "../fields/TextAreaField";
import TextField from "../fields/TextField";
import ApproveFishRow from "../other/ApproveFishRow";
import DeleteCard from "../other/DeleteCard";
import Modal from "../other/Modal";
import FishStockingPageTitle from "../other/PageTitle";
import Map from "../other/PreviewMap";
import SignatureRow from "../other/SignatureRow";

export interface FishStockingFactFormProps {
  fishStocking: FishStocking;
  disabled?: boolean;
  renderTabs: JSX.Element;
}

interface ReviewProps {
  containerWaterTemp: number;
  waterTemp: number | undefined;
  reviewLocation?: {
    lat: number;
    lng: number;
  };
  comment: string;
  images: any[];
  batches: any[];
  veterinaryApprovalNo: string | undefined;
  waybillNo: string | undefined;
  veterinaryApprovalOrderNo: string | undefined;
  signatures?: {
    organization: string;
    signedBy: string;
    signature?: string;
    phone?: string;
  }[];
}

const Review = ({
  fishStocking,
  disabled,
  renderTabs
}: FishStockingFactFormProps) => {
  const currentLocation = useCurrentLocation();
  const { id } = useParams();
  const isMobile = useMediaQuery(device.mobileL);
  const [showModal, setShowModal] = useState(false);

  const callBacks = useFishStockingCallbacks();

  const cancelFishStockingMutation = useMutation(
    () => api.cancelFishStocking(id!),
    { ...callBacks }
  );

  const reviewFishStockingMutation = useMutation(
    (params: any) => api.reviewFishStocking(params),
    { ...callBacks }
  );

  const submitLoading = [
    reviewFishStockingMutation.isLoading,
    cancelFishStockingMutation.isLoading
  ].some((loading) => loading);

  const handleCancel = async () => {
    cancelFishStockingMutation.mutateAsync();
  };
  const handleSubmit = async (values: ReviewProps) => {
    const {
      waybillNo,
      signatures,
      veterinaryApprovalNo,
      veterinaryApprovalOrderNo,
      containerWaterTemp,
      waterTemp,
      batches,
      comment
    } = values;
    const params = {
      waybillNo,
      id: fishStocking.id,
      veterinaryApprovalNo,
      veterinaryApprovalOrderNo,
      comment,
      containerWaterTemp: parseFloat(containerWaterTemp.toString()!),
      waterTemp: parseFloat(waterTemp?.toString()!),
      reviewLocation: currentLocation,
      signatures,
      batches: batches.map((batch) => {
        return {
          id: batch.id,
          reviewAmount: batch.reviewAmount,
          reviewWeight: batch.reviewWeight
        };
      })
    };

    reviewFishStockingMutation.mutateAsync(params);
  };

  const inspector = fishStocking?.inspector;

  const initialValues: ReviewProps = {
    containerWaterTemp: fishStocking?.containerWaterTemp || 0,
    waterTemp: fishStocking?.waterTemp,
    images: fishStocking.images || [],
    batches:
      fishStocking?.batches &&
      fishStocking?.batches.map((batch) => ({
        id: batch.id,
        fishType: batch.fishType,
        fishAge: batch.fishAge,
        amount: batch.reviewAmount || "",
        weight: batch.reviewWeight || "",
        reviewWeight: batch.reviewWeight,
        reviewAmount: batch.reviewAmount,
        planned: `${batch.amount
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} vnt.`
      })),
    veterinaryApprovalNo: fishStocking?.veterinaryApprovalNo,
    waybillNo: fishStocking?.waybillNo,
    veterinaryApprovalOrderNo: fishStocking?.veterinaryApprovalOrderNo,
    comment: "",
    signatures: !isEmpty(inspector)
      ? [
          {
            organization: inspector.organization!,
            signature: "",
            phone: inspector.phone,
            signedBy: `${inspector?.firstName} ${inspector.lastName}`
          }
        ]
      : []
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validateFishStockingReview}
        validateOnChange={false}
      >
        {({ values, errors, handleSubmit, setFieldValue }) => {
          return (
            <InnerContainer>
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
                <FishStockingPageTitle status={fishStocking?.status!} />
                {renderTabs}
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
                  />
                  <TempStyledTextInput
                    label="Telkininyje"
                    name="waterTemp"
                    value={values.waterTemp}
                    error={errors.waterTemp}
                    onChange={(e) => setFieldValue(`waterTemp`, e)}
                    right={<InputInnerLabel>°C</InputInnerLabel>}
                    disabled={disabled}
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
                    onChange={(e) =>
                      setFieldValue(`veterinaryApprovalOrderNo`, e)
                    }
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
                  name={"images"}
                  disabled={disabled}
                  onUpload={async (photos: File[]) => {
                    const uploadedPhotos = await api.uploadFiles(
                      fishStocking.id,
                      photos
                    );
                    setFieldValue("images", [
                      ...values.images,
                      ...uploadedPhotos
                    ]);
                  }}
                  handleDelete={async (id, index) => {
                    setFieldValue("images", [
                      ...values.images?.slice(0, index as number),
                      ...values.images?.slice((index as number) + 1)
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
                  municipalityId={fishStocking?.location?.municipality?.id!}
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

                <ButtonRow>
                  {!!fishStocking && (
                    <StyledButtons
                      type="button"
                      variant={ButtonColors.DANGER}
                      disabled={disabled}
                      onClick={() => setShowModal(true)}
                    >
                      {buttonsTitles.cancelFishStcoking}
                    </StyledButtons>
                  )}
                  <StyledButtons
                    type="submit"
                    loading={submitLoading}
                    disabled={disabled}
                  >
                    {buttonsTitles.save}
                  </StyledButtons>
                </ButtonRow>
                <Modal visible={showModal}>
                  <DeleteCard
                    action={buttonsTitles.cancelFishStcoking}
                    title={""}
                    agreeLabel={buttonsTitles.yes}
                    declineLabel={buttonsTitles.no}
                    description={"Ar tikrai norite atšaukti būsimą ižuvinima?"}
                    onSetClose={() => setShowModal(false)}
                    handleDelete={() => handleCancel()}
                    deleteInProgress={false}
                    name={""}
                  />
                </Modal>
              </StyledForm>
              <Map
                display={!isMobile}
                value={fishStocking.geom}
                height="100%"
              />
            </InnerContainer>
          );
        }}
      </Formik>
    </>
  );
};

const StyledForm = styled(Form)`
  display: flex;
  padding: 32px;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  @media ${device.mobileL} {
    padding: 12px;
  }
`;

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
  color: ${({ theme }) => theme.colors.primary + "8F"};
`;

const StyledButtons = styled(Button)`
  @media ${device.mobileL} {
    width: 100%;
  }
`;

export default Review;
