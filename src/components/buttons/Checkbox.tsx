import styled from "styled-components";

export interface CheckFieldProps {
  value: string[];
  onChange: (val: string[]) => void;
  disabled?: boolean;
  label?: string;
  options: any[];
}

const Checkbox = ({
  value,
  onChange,
  disabled = false,
  options
}: CheckFieldProps) => {
  const handleMultipleSelect = (option: any) => {
    const index = value.indexOf(option);
    if (index === -1) {
      return [...value, option];
    } else {
      return [
        ...value.slice(0, index),
        ...value.slice(index + 1, value.length)
      ];
    }
  };

  return (
    <>
      {options.map((option, index) => (
        <Container key={`checkbox-${index}`}>
          <InnerContainer>
            <CheckBox
              type="checkbox"
              checked={value.some((v) => v === option)}
              disabled={disabled}
              onChange={() => onChange(handleMultipleSelect(option))}
            />
            <Label />
          </InnerContainer>
          <TextLabel>{option}</TextLabel>
        </Container>
      ))}
    </>
  );
};

const Container = styled.div`
  display: flex;
  margin-bottom: 18px;
`;

const TextLabel = styled.div`
  text-align: left;
  font: 1.4rem;
  color: #231f20;
`;

const InnerContainer = styled.div`
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.primary};
  margin-right: 8px;
`;
const Label = styled.label`
  cursor: pointer;
  position: absolute;
  z-index: 4;
  width: 14px;
  height: 14px;
  left: 2px;
  top: 2px;

  background-color: white;

  &::after {
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
    filter: alpha(opacity=0);
    opacity: 0;
    content: "";
    position: absolute;
    width: 11px;
    height: 7px;
    background: transparent;
    top: 2px;
    left: 1px;
    border: 3px solid #fcfff4;
    border-top: none;
    border-right: none;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
`;
const CheckBox = styled.input<{ disabled: boolean }>`
  position: absolute;
  width: 20px;
  height: 20px;
  top: -4px;
  left: -4px;
  z-index: 7;
  opacity: 0;

  cursor: ${({ disabled }) => (disabled ? "text" : "pointer")};
  &:checked + label {
    background-color: transparent;
  }
  &:checked + label::after {
    -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
    filter: alpha(opacity=100);
    opacity: 1;
  }
`;

export default Checkbox;
