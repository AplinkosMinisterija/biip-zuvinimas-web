import { useMediaQuery } from "@material-ui/core";
import { format } from "date-fns";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";
import styled from "styled-components";
import { device } from "../../styles";
import { FishStockingStatus } from "../../utils/constants";
import { slugs } from "../../utils/routes";
import { buttonsTitles } from "../../utils/texts";
import { FishStocking } from "../../utils/types";
import Button from "../buttons/Button";
import PhotoUploadField from "../fields/PhotoUploadField";
import Icon from "../other/Icon";
import FishStockingInfo from "../other/Info";
import InfoColumn from "../other/InfoColumn";
import Map from "../other/Map";
import FishStockingPageTitle from "../other/PageTitle";
import SignatureList from "../other/SignatureList";
import FishStockingTable from "../other/Table";
import { fishOrigins } from "./Registration";

export interface FishStockingCompletedProps {
  fishStocking: FishStocking;
  disabled?: boolean;
}
const locale = {
  vet_no_0: "Vet. patvirtinimo nr.",
  vet_no_1: "Vet. patvirtinimo įsakymo nr.",
  waybill_no: "Važtaraščio nr.",
  fish_origin_company: "Žuvivaisos įmonės pavadinimas",
  fish_origin_reservoir: "Vandens telkinio pavadinimas",
};

const FishStockingCompleted = ({
  fishStocking,
  disabled,
}: FishStockingCompletedProps) => {
  const status = fishStocking?.status;
  const navigate = useNavigate();
  const isMobile = useMediaQuery(device.mobileL);

  const showAdditionalInfo = ![
    FishStockingStatus.NOT_FINISHED,
    FishStockingStatus.CANCELED,
  ].includes(status!);

  const fishStocker =
    fishStocking.reviewedBy ||
    fishStocking.assignedTo ||
    fishStocking.createdBy;

  const info = [
    [
      {
        type: "location",
        value: fishStocking?.location?.municipality?.name,
        label: "Įžuvinimo vieta",
      },
      {
        type: "date",
        value: format(
          new Date(fishStocking?.reviewTime || fishStocking.eventTime!),
          "yyyy-MM-dd HH:mm"
        ),
        label: "Data",
      },
      {
        type: "phone",
        value: fishStocking.phone,
        label: "Telefonas",
      },
    ],
    [
      {
        type: "info",
        value: `${fishStocking.location?.name}, ${fishStocking.location?.cadastral_id}`,
        label: "Telkinys",
      },
      {
        type: "user",
        value: `${fishStocker?.firstName} ${fishStocker?.lastName}`,
        label: "Atsakingas asmuo",
      },
    ],
  ];
  if (showAdditionalInfo) {
    info.push([
      {
        type: "temp",
        value: fishStocking.containerWaterTemp
          ? fishStocking.containerWaterTemp + "\u00b0C"
          : "Nežinoma temperatūra",
        label: "Vandens temperatūra taroje",
      },
      {
        type: "water",
        value: fishStocking.waterTemp
          ? fishStocking.waterTemp + "\u00b0C"
          : "Nežinoma temperatūra",
        label: "Vandens temperatūra telkinyje",
      },
    ]);
  }

  return (
    <InnerContainer>
      <Container>
        <FishStockingPageTitle status={fishStocking?.status!} />
        <FishStockingInfo
          fishStocking={fishStocking}
          additionalInfo={showAdditionalInfo}
          info={info}
        />

        <FishStockingMobile>
          <div>
            {showAdditionalInfo && (
              <>
                <Row>
                  {fishStocking?.fishOrigin === fishOrigins[0].value ? (
                    <InfoColumn
                      label={locale.fish_origin_company}
                      value={fishStocking?.fishOriginCompanyName}
                    />
                  ) : (
                    <InfoColumn
                      label={locale.fish_origin_reservoir}
                      value={fishStocking?.fishOriginReservoir?.name}
                    />
                  )}
                </Row>
                <Row>
                  <InfoColumn
                    label={locale.vet_no_0}
                    value={fishStocking?.veterinaryApprovalNo}
                  />
                  <InfoColumn
                    label={locale.vet_no_1}
                    value={fishStocking?.veterinaryApprovalOrderNo}
                  />
                  <InfoColumn
                    label={locale.waybill_no}
                    value={fishStocking?.waybillNo}
                  />
                </Row>
              </>
            )}

            {fishStocking?.batches && (
              <FishStockingTable fishStocking={fishStocking} />
            )}
            {fishStocking?.comment && (
              <InfoColumn
                label="Pastaba"
                value={fishStocking?.comment}
                reverse={true}
              />
            )}

            {!isEmpty(fishStocking.images) && (
              <PhotoUploadField
                name={"images"}
                photos={fishStocking?.images!}
                getSrc={(photo) => `${photo?.url}`}
                disabled={true}
              />
            )}
            {!isEmpty(fishStocking?.signatures) && (
              <SignedContainer>
                <Label>{"Įžuvinime dalyvavo"}</Label>
                <SignatureList
                  data={fishStocking?.signatures}
                  municipalityId={fishStocking?.location?.municipality?.id}
                />
              </SignedContainer>
            )}
          </div>
          <ButtonRow>
            <Button
              onClick={() => {
                navigate({
                  pathname: slugs.newFishStockings,
                  search: createSearchParams({
                    repeat: fishStocking?.id!.toString(),
                  }).toString(),
                });
              }}
            >
              {buttonsTitles.repeat}
            </Button>
          </ButtonRow>
        </FishStockingMobile>
      </Container>
      <Map display={!isMobile} value={fishStocking.geom} height="100%" />
    </InnerContainer>
  );
};

const Container = styled.div`
  padding: 0 32px;
  overflow-y: auto;
  @media ${device.mobileL} {
    padding: 12px;
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
const FishStockingMobile = styled.div`
  @media ${device.mobileL} {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 30px 16px 0px 16px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 12px 0 32px 0;

  @media ${device.mobileL} {
    flex-direction: column;
    align-items: center;
  }
`;
const Label = styled.label`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  padding: 24px 0 0 0;
  width: auto;
  @media ${device.mobileL} {
    flex-direction: column;
    padding: 0;
  }
`;

const StyledImgRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 4px;
`;

const StyledImgContainer = styled.div`
  margin: 16px 0px;
`;

const StyledImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 5px;
  margin: 0px 8px 0px 0px;
  cursor: pointer;
`;

const SignedContainer = styled.div`
  display: flex;
  margin: 40px 0px;
  flex-direction: column;
`;

const SignedBy = styled.div`
  font: normal normal 600 1.6rem/22px Manrope;
  margin-right: 21px;
  color: #121a55;
`;

const StyledSignature = styled.img`
  height: 63px;
`;

const Modal = styled.div`
  display: flex;
  position: fixed;
  z-index: 401;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.52);
  justify-content: center;
  align-items: center;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
  justify-content: center;
`;

const ImagePreview = styled.img`
  max-width: 767px;
  max-height: 80%;
  border-radius: 6px;
  box-shadow: 0px 18px 41px #121a5529;
  margin-left: 24px;
  @media ${device.mobileL} {
    max-width: 80%;
  }
`;

const IconContainer = styled.div`
  cursor: pointer;
  height: fit-content;
  width: 24px;
`;
const StyledIcon = styled(Icon)`
  color: #ffffff;
  font-size: 2.4rem;
`;

export default FishStockingCompleted;
