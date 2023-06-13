import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { device } from "../../styles";
import Button, { ButtonColors } from "../buttons/Button";
import Icon from "../other/Icon";
export interface DeleteCardProps {
  title: string;
  description: string;
  name: string;
  onSetClose: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  deleteInProgress: boolean;
  declineLabel?: string;
  agreeLabel?: string;
  action?: string;
}

const DeleteCard = ({
  title,
  description,
  name,
  onSetClose,
  handleDelete,
  deleteInProgress,
  declineLabel = "Atšaukti",
  agreeLabel = "Ištrinti"
}: DeleteCardProps) => {
  const cardRef = useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (cardRef?.current && !cardRef.current.contains(event.target)) {
      onSetClose(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <Container ref={cardRef}>
      <IconContainer onClick={() => onSetClose(false)}>
        <StyledIcon name="close" />
      </IconContainer>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Name>{name}</Name>
      <ButtonRow>
        <StyledButton
          type="button"
          onClick={() => onSetClose(false)}
          variant={ButtonColors.TRANSPARENT}
        >
          {declineLabel}
        </StyledButton>
        <StyledButton
          type="button"
          onClick={() => handleDelete()}
          variant={ButtonColors.DANGER}
          loading={deleteInProgress}
        >
          {agreeLabel}
        </StyledButton>
      </ButtonRow>
    </Container>
  );
};

const Container = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 18px 41px #121a5529;
  border-radius: 10px;
  max-width: 410px;
  padding: 40px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  @media ${device.mobileL} {
    padding: 20px;
  }
`;

const Title = styled.div`
  font: normal normal bold 2.4rem/33px;
  color: #fe5b78;
`;

const Description = styled.div`
  text-align: center;
  font: normal normal medium 16px/26px;
  color: #7a7e9f;
  margin-top: 16px;
`;

const Name = styled.div`
  text-align: center;
  font: normal normal bold 16px/26px;
  color: #121a55;
`;
const StyledButton = styled(Button)`
  margin-top: 32px;
  @media ${device.mobileL} {
    margin-top: 16px;
  }
`;
const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  @media ${device.mobileS} {
    flex-direction: column;
    width: 100%;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;
`;

const StyledIcon = styled(Icon)`
  color: rgb(122, 126, 159);
  font-size: 3rem;
  margin: 10px 10px auto auto;
`;

export default DeleteCard;
