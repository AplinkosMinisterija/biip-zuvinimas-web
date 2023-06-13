import styled from "styled-components";

export interface SwitchProps {
  isOn: boolean;
  onChange: () => void;
}

const Switch = ({ isOn, onChange }: SwitchProps) => {
  return (
    <>
      <StyledInput onChange={() => {}} checked={isOn} type="checkbox" />
      <StyledLabel onClick={onChange} checked={isOn}>
        {isOn && <IsOnText>Įjungta</IsOnText>}
        <span />
        {!isOn && <IsNotOnText>Išjungta</IsNotOnText>}
      </StyledLabel>
    </>
  );
};

export default Switch;

const StyledInput = styled.input`
  height: 0;
  width: 0;
  visibility: hidden;
`;

const IsOnText = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  margin-left: 7px;
`;

const IsNotOnText = styled.div`
  font-size: 1.2rem;
  color: #4b5565;
  margin-right: 7px;
`;

const StyledLabel = styled.label<{ checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ checked }) => (checked ? "flex-start" : "flex-end")};
  cursor: pointer;
  width: 76px;
  height: 24px;
  background: grey;
  border-radius: 24px;
  position: relative;
  transition: background-color 0.2s;
  background: #027a48 0% 0% no-repeat padding-box;

  span {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 45px;
    transition: 0.2s;
    background: #fff;
  }

  ${({ checked }) =>
    checked
      ? `
    background-color:#027a48;
    span{
    left: calc(100% - 2px);
    transform: translateX(-100%);
    }
  `
      : `
  background-color:#CDD5DF;
  `}
`;
