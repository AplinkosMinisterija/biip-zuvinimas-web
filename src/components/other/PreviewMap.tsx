import { useRef, useState } from 'react';
import styled from 'styled-components';
import { device } from '../../styles';
import { Url } from '../../utils/texts';
import LoaderComponent from './LoaderComponent';

export interface MapProps {
  height: string;
  value: string;
  display: boolean;
}

const PreviewMap = ({ height, value, display }: MapProps) => {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<any>(null);

  const getMapUrl = () => {
    const url = new URL(Url.DRAW);
    const params = new URLSearchParams(url.search);
    params.append('preview', 'true');
    url.search = params.toString();
    return url.href;
  };
  const src = getMapUrl();
  const handleLoadMap = () => {
    setLoading(false);

    iframeRef?.current?.contentWindow?.postMessage(JSON.stringify({ geom: value }), '*');
  };

  return (
    <>
      {loading ? <LoaderComponent /> : null}
      <Container display={display}>
        <InnerContainer>
          <StyledIframe
            ref={iframeRef}
            src={src}
            width={'100%'}
            height={height}
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
  display: ${({ display }) => (display ? 'flex' : 'none')};
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

export default PreviewMap;
