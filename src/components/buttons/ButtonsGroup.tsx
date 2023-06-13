import { map } from "lodash";
import styled from "styled-components";
import { device } from "../../styles";
import FieldWrapper from "../fields/components/FieldWrapper";

export interface ToggleButtonProps {
  options: any[];
  onChange: (option?: any) => void;
  isSelected: (option: any) => boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  getOptionLabel?: (option: any) => string;
  error?: string;
  showError?: boolean;
}

const ButtonsGroup = ({
  options,
  onChange,
  disabled,
  isSelected,
  className,
  label,
  getOptionLabel,
  error,
  showError = false
}: ToggleButtonProps) => {
  return (
    <FieldWrapper error={error} showError={showError} label={label}>
      <Container className={className}>
        {map(options, (option, index) => (
          <StyledButton
            type="button"
            disabled={disabled || option?.disabled}
            key={`group-button${index}`}
            left={index === 0}
            right={index === options.length - 1}
            selected={isSelected(option)}
            error={!!error}
            onClick={() => (disabled ? {} : onChange(option))}
          >
            {getOptionLabel ? getOptionLabel(option) : option.name}
          </StyledButton>
        ))}
      </Container>
    </FieldWrapper>
  );
};

const Container = styled.div`
  border-radius: 4px;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%/3, max(64px, 100%/5)), 1fr)
  );
  @media ${device.mobileS} {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-items: flex-start;
  padding-bottom: 4px;
`;

const Label = styled.div`
  font-size: 1.4rem;
  color: #231f20;
`;

const StyledButton = styled.button<{
  left: boolean;
  right: boolean;
  selected: boolean;
  disabled?: boolean;
  error?: boolean;
}>`
  display: flex;
  justify-content: center;

  align-items: center;
  height: 40px;
  padding: 12px;
  border-color: ${({ error, selected, theme }) =>
    !error
      ? selected
        ? theme.colors.primary
        : "#cdd5df"
      : theme.colors.error};
  border-style: solid;
  font-weight: normal;
  font-size: 1.4rem;
  line-height: 13px;
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
  :hover {
    opacity: ${({ disabled }) => (disabled ? 0.48 : 0.6)};
  }
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary + "1F" : "white"};
  color: #121926;
  justify-content: center;
  border-width: 1px;
  border-top-left-radius: ${({ left }) => (left ? "4px" : 0)};
  border-bottom-left-radius: ${({ left }) => (left ? "4px" : 0)};
  border-top-right-radius: ${({ right }) => (right ? "4px" : 0)};
  border-bottom-right-radius: ${({ right }) => (right ? "4px" : 0)};
`;

const ErrorMessage = styled.label`
  position: relative;
  color: ${({ theme }) => theme.colors.error};
  font-size: 1.4rem;
  margin-left: 8px;
`;

export default ButtonsGroup;
