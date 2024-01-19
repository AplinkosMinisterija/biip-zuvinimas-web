import styled from 'styled-components';
import { device } from '../../styles';
import Icon from './Icon';
import Modal from './Modal';

const Popup = ({ children, onClose, visible = true }: any) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <Container>
        <IconContainer onClick={onClose}>
          <StyledIcon name="close" />
        </IconContainer>
        <div>{children}</div>
      </Container>
    </Modal>
  );
};

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2rem;
`;

const Container = styled.div<{ width?: string }>`
  background-color: white;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  position: relative;
  height: fit-content;
  min-width: 440px;
  width: ${({ width }) => width};

  background-color: white;
  flex-basis: auto;
  margin: auto;

  @media ${device.mobileL} {
    min-width: 100%;
    min-height: 100%;
    border-radius: 0px;
  }
`;

const IconContainer = styled.div`
  margin: 0 0 0 auto;
  padding: 24px;
  width: fit-content;
`;

export default Popup;
