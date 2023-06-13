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
  fish_origin_reservoir: "Vandens telkinio pavadinimas"
};

const FishStockingCompleted = ({
  fishStocking
}: FishStockingCompletedProps) => {
  const status = fishStocking?.status;
  const navigate = useNavigate();
  const isMobile = useMediaQuery(device.mobileL);

  const showAdditionalInfo = ![
    FishStockingStatus.NOT_FINISHED,
    FishStockingStatus.CANCELED
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
        label: "Įžuvinimo vieta"
      },
      {
        type: "date",
        value: format(
          new Date(fishStocking?.reviewTime || fishStocking.eventTime!),
          "yyyy-MM-dd HH:mm"
        ),
        label: "Data"
      },
      {
        type: "phone",
        value: fishStocking.phone,
        label: "Telefonas"
      }
    ],
    [
      {
        type: "info",
        value: `${fishStocking.location?.name}, ${fishStocking.location?.cadastral_id}`,
        label: "Telkinys"
      },
      {
        type: "user",
        value: `${fishStocker?.firstName} ${fishStocker?.lastName}`,
        label: "Atsakingas asmuo"
      }
    ]
  ];
  if (showAdditionalInfo) {
    info.push([
      {
        type: "temp",
        value: fishStocking.containerWaterTemp
          ? fishStocking.containerWaterTemp + "\u00b0C"
          : "Nežinoma temperatūra",
        label: "Vandens temperatūra taroje"
      },
      {
        type: "water",
        value: fishStocking.waterTemp
          ? fishStocking.waterTemp + "\u00b0C"
          : "Nežinoma temperatūra",
        label: "Vandens temperatūra telkinyje"
      }
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
                    repeat: fishStocking?.id!.toString()
                  }).toString()
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

const SignedContainer = styled.div`
  display: flex;
  margin: 40px 0px;
  flex-direction: column;
`;

export default FishStockingCompleted;
