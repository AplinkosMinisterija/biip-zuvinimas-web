import { useState } from 'react';
import styled from 'styled-components';
import { inputLabels } from '../../utils/texts';
import FieldWrapper from '../fields/components/FieldWrapper';
import Modal from './Modal';
import SignatureComponent from './SignatureComponent';

const SignatureField = ({ value, error, onChange, padding }: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Container>
        <FieldWrapper label={inputLabels.signature} onClick={() => setVisible(true)}>
          <InputContainer error={error}>{value && <Sign src={value} />}</InputContainer>
        </FieldWrapper>
      </Container>

      {visible && (
        <Modal visible={visible}>
          <SignatureComponent
            onSubmit={(e: any) => {
              onChange(e.sign);
              setVisible(false);
            }}
            onClose={() => setVisible(false)}
            visible={visible}
          />
        </Modal>
      )}
    </>
  );
};

const InputContainer = styled.div<{
  padding?: string;
  error?: boolean;
  height?: number;
  disabled?: boolean;
}>`
  width: 100%;
  display: flex;
  height: ${({ height }) => (height ? `${height}px` : `40px`)};
  background-color: white;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid ${({ theme, error }) => (error ? theme.colors.error : theme.colors.border)};
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'text')};
  :focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const Sign = styled.img`
  max-height: 48px;
`;

const Container = styled.div`
  width: 100%;
`;
export default SignatureField;
