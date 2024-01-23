import styled from 'styled-components';

const InstallButton = ({ onClick }: any) => {
  return (
    <StyledButton type="button" onClick={onClick}>
      Įdiegti
    </StyledButton>
  );
};

const StyledButton = styled.button`
  width: 100%;
  padding: 6px;
  background-color: #60b456;
  color: #ffffff;
`;
export default InstallButton;
