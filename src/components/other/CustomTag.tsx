import styled from "styled-components";

export interface CustomTagProps {
  text: string;
  color?: string;
  icon?: JSX.Element;
  isFilter?: boolean;
  margin?: string;

  isPressed?: boolean;
  className?: string;
}

const CustomTag = ({
  color = "#7A7E9F",
  icon,
  text,
  isFilter = false,
  margin = "0",
  isPressed = false,
  className
}: CustomTagProps) => {
  return (
    <Container margin={margin} className={className}>
      {icon}
      <LabelContainer isPressed={isPressed} isFilter={isFilter} color={color}>
        <Label color={isPressed ? "white" : color}>{text}</Label>
      </LabelContainer>
    </Container>
  );
};

const Container = styled.div<{ margin: string }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: ${({ margin }) => (margin ? margin : ` 0 2px`)};
`;

const LabelContainer = styled.div<{
  color: string;
  isPressed: boolean;
  isFilter: boolean;
}>`
  height: ${({ isFilter }) => (isFilter ? `30px` : `20px`)};
  padding: 0 8px;
  border: 1px solid ${({ color }) => color};
  background-color: ${({ color, isPressed }) =>
    isPressed ? "#121A55" : `${color}14`};
  border-radius: 4px;
  margin: 2px;
  display: flex;
  align-items: center;
`;

const Label = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 1.2rem;
  vertical-align: middle;
  text-transform: capitalize;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export default CustomTag;
