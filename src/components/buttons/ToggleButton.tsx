import styled from "styled-components";
import { device } from "../../styles";

export interface ToggleButtonProps {
  options?: { name: string; value: boolean }[];
  onChange: (value: boolean) => void;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const ToggleButton = ({
  options,
  onChange,
  disabled,
  selected,
  className,
  label
}: ToggleButtonProps) => {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <Container className={className} disabled={disabled || false}>
        {(options || []).map((option, index) => {
          return (
            <Button
              type="button"
              key={`toggle-button_${index}`}
              selected={option.value === selected}
              onClick={() => (disabled ? {} : onChange(option.value))}
            >
              {option.name}
            </Button>
          );
        })}
      </Container>
    </div>
  );
};

const Container = styled.div<{
  disabled: boolean;
}>`
  border-radius: 4px;
  opacity: 1;
  display: flex;
  align-items: center;
  background-color: #d1d2d1;
  opacity: 1;
  @media ${device.mobileL} {
    margin-top: 16px;
  }
`;

const Label = styled.div`
  font-size: 1.4rem;
  color: #231f20;
  margin-bottom: 4px;
`;

const Button = styled.button<{
  selected: boolean;
}>`
  border-radius: 4px;
  padding: 5px 17px;
  font-size: 1.6rem;
  color: ${({ selected }) => (selected ? "#ffffff" : "#868787")};
  background-color: ${({ selected }) => (selected ? "#257D6A" : "#D1D2D1")};
`;

export default ToggleButton;
