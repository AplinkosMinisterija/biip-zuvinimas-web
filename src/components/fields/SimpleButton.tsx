import styled from 'styled-components';

const SimpleButton = (props: any) => {
  return (
    <Button {...props} onClick={props.onClick}>
      {props.children}
    </Button>
  );
};

const Button = styled.button<{ height?: string; textColor?: string }>`
  color: ${({ textColor, theme }) => textColor || theme.colors.primary};
  font-size: 1.6rem;
  padding: 0;
  margin-top: 16px;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
`;

export default SimpleButton;
