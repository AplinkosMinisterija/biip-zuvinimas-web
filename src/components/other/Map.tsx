import { useMediaQuery } from "@material-ui/core";
import { useRef, useState } from "react";
import styled from "styled-components";
import { device } from "../../styles";
import { Url } from "../../utils/texts";
import Button from "../buttons/Button";
import Icon from "./Icon";
import LoaderComponent from "./LoaderComponent";

export interface MapProps {
  height?: string;
  onSave?: (geom: any, data: any) => void;
  onClose?: () => void;
  error?: string;
  queryString?: string;
  value?: string;
  display: boolean;
}

const Map = ({ height, onSave, onClose, value, display }: MapProps) => {
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<any>(null);
  const isMobile = useMediaQuery(device.mobileL);

  const src = `${Url.DRAW}`;

  const handleLoadMap = () => {
    setLoading(false);

    iframeRef?.current?.contentWindow?.postMessage(
      JSON.stringify({ geom: value }),
      "*"
    );
  };

  return (
    <>
      {loading ? <LoaderComponent /> : null}
      <Container display={display}>
        {isMobile && (
          <StyledButton
            popup
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (!!onClose) {
                return onClose();
              }

              setShowModal(!showModal);
            }}
          >
            <StyledIconContainer>
              <StyledIcon name={"close"} />
            </StyledIconContainer>
          </StyledButton>
        )}

        <InnerContainer>
          <StyledIframe
            ref={iframeRef}
            src={src}
            width={"100%"}
            height={showModal ? "100%" : `${height || "230px"}`}
            style={{ border: 0 }}
            allowFullScreen={true}
            onLoad={handleLoadMap}
            aria-hidden="false"
            tabIndex={1}
          />
        </InnerContainer>
      </Container>
    </>
  );
};

const Container = styled.div<{ display: boolean }>`
  width: 100%;
  height: 100%;
  display: ${({ display }) => (display ? "flex" : "none")};
`;

const StyledIcon = styled(Icon)`
  font-size: 2rem;
  color: #6b7280;
`;

const InnerContainer = styled.div<{}>`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media ${device.mobileL} {
    padding: 0;
  }
`;

const StyledIframe = styled.iframe<{
  height: string;
  width: string;
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
`;

const StyledButton = styled(Button)<{ popup: boolean }>`
  position: absolute;
  z-index: 10;
  top: 100px;
  right: ${({ popup }) => (popup ? 28 : 11)}px;
  min-width: 28px;

  height: 28px;
  @media ${device.mobileL} {
    top: 180px;
    right: 10px;
  }
  button {
    border-color: #e5e7eb;
    background-color: white !important;
    width: 30px;
    height: 30px;
    padding: 0;
    box-shadow: 0px 18px 41px #121a5529;
  }
`;

const StyledIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Map;
