import styled from "styled-components";
import Icon from "../other/Icon";

export interface IconLinkProps {
  text: string;
  onClick: () => void;
}

const IconLink = ({ text, onClick }: IconLinkProps) => {
  return (
    <Container>
      {text}
      <IconContainer
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <StyledIcons name={"eye"} />
      </IconContainer>
    </Container>
  );
};

const Container = styled.div`
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div`
  margin-left: 4px;
`;

const StyledIcons = styled(Icon)`
  font-size: 1.6rem;
  vertical-align: middle;
  &:hover {
    opacity: 50%;
  }
`;
export default IconLink;
