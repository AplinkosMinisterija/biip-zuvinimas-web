import { useMediaQuery } from '@material-ui/core';
import { useRef } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import SignatureCanvas from 'react-signature-canvas';
import styled from 'styled-components';
import Button from '../../components/buttons/Button';
import { device } from '../../styles';
import Icon from '../other/Icon';

interface handleSignatureInterface {
  isSignatureEmpty: boolean;
  sign: string;
}

export interface SignatureProps {
  onSubmit: ({ isSignatureEmpty, sign }: handleSignatureInterface) => void;
  onClose: () => void;
  visible: boolean;
}

const SignatureComponent = ({ onSubmit, onClose, visible }: SignatureProps) => {
  const isMObile = useMediaQuery(device.mobileL);
  const signature = useRef<any>(null);
  const { width, height, ref } = useResizeDetector();

  const onClear = () => {
    signature.current.clear();
  };

  const canvasStyle = {
    width: isMObile ? width : 605,
    height: isMObile ? height! * 0.85 : 356,
    border: '1px solid #121A553D',
    backgroundColor: '#F3F3F7',
    borderRadius: 4,
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  return (
    <>
      <Container
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSubmit({
              isSignatureEmpty: signature.current.isEmpty(),
              sign: signature.current.toDataURL('image/png'),
            });
          }
        }}
        $visible={visible}
        ref={ref}
      >
        {!isMObile && (
          <Row onClick={() => onClose()}>
            <StyledCloseButton name={'close'} />
          </Row>
        )}
        <SignatureCanvas
          penColor="#000000"
          backgroundColor="transparent"
          ref={signature}
          canvasProps={{
            width: isMObile ? width : 605,
            height: isMObile ? height! * 0.85 : 356,
            style: canvasStyle,
          }}
        />
        <BottomRow>
          <SubRow>
            <StyledButtonLarge
              variant={Button.colors.TRANSPARENT}
              onClick={onClear}
              height={44}
              type="button"
            >
              Išvalyti
            </StyledButtonLarge>

            <StyledButton
              type="button"
              signature={true}
              variant={Button.colors.TRANSPARENT}
              onClick={onClose}
              height={44}
            >
              Atšaukti
            </StyledButton>
          </SubRow>
          <StyledButton
            type="button"
            signature={true}
            onClick={() =>
              onSubmit({
                isSignatureEmpty: signature.current.isEmpty(),
                sign: signature.current.toDataURL('image/png'),
              })
            }
            height={44}
          >
            Atlikta
          </StyledButton>
        </BottomRow>
      </Container>
    </>
  );
};

const Container = styled.div<{ $visible: boolean }>`
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 18px 41px #121a5529;
  border-radius: 10px;
  display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
  flex-direction: column;
  width: 767px;
  margin: auto;
  @media ${device.mobileL} {
    width: 100%;
    height: 100%;
    border-radius: 0;
    margin: 0;
    padding: 45px 32px;
    box-shadow: none;
  }
`;

const StyledCloseButton = styled(Icon)`
  color: rgb(122, 126, 159);
  font-size: 3.2rem;
  cursor: pointer;
  margin: auto 30px auto auto;
  @media ${device.mobileL} {
    display: none;
  }
`;

const Row = styled.div`
  display: flex;
  flex: 1;
  padding: 30px 0;
  @media ${device.mobileL} {
    padding: 0;
  }
`;

const BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 45px 81px;

  @media ${device.mobileL} {
    width: 100%;
    padding: 45px 0 0 0;
    display: flex;
    flex-wrap: wrap-reverse;
  }
`;

const SubRow = styled.div`
  display: flex;
  @media ${device.mobileL} {
    width: 100%;
  }
  @media ${device.mobileS} {
    width: 100%;
    flex-direction: column;
  }
`;

const StyledButtonLarge = styled(Button)`
  display: flex;
  min-width: 150px;
  flex: 1;
  padding: 4px;
`;

const StyledButton = styled(Button)`
  display: flex;
  min-width: 120px;
  flex: 1;
  button {
    padding: 0;
  }
  padding: 4px;
`;

export default SignatureComponent;
