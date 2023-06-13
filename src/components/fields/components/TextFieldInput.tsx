import styled from "styled-components";
export interface TextFieldProps {
  value?: string | number;
  name?: string;
  error?: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  onChange?: (option?: any) => void;
  disabled?: boolean;
  height?: number;
  readOnly?: boolean;
  onInputClick?: () => void;
  placeholder?: string;
  type?: string;
  selectedValue?: boolean;
}

const TextFieldInput = ({
  value,
  name,
  error,
  readOnly = false,
  leftIcon,
  rightIcon,
  onChange,
  placeholder,
  type,
  disabled,
  height,
  selectedValue = false,
  onInputClick,
  ...rest
}: TextFieldProps) => {
  return (
    <InputContainer
      error={!!error}
      height={height || 40}
      disabled={disabled || false}
    >
      {leftIcon}
      <TextInput
        selectedValue={selectedValue}
        onClick={() => (onInputClick ? onInputClick() : null)}
        readOnly={readOnly}
        type={type || "text"}
        name={name}
        autoComplete="off"
        value={value || ""}
        onChange={(e) => onChange && onChange(e?.target?.value || "")}
        placeholder={placeholder}
        disabled={disabled}
        {...rest}
      />
      {rightIcon}
    </InputContainer>
  );
};

const InputContainer = styled.div<{
  error: boolean;
  height: number;
  disabled: boolean;
}>`
  display: flex;
  height: ${({ height }) => (height ? `${height}px` : `40px`)};
  background-color: white;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid
    ${({ theme, error }) => (error ? theme.colors.error : theme.colors.border)};
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "text")};
  :focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const TextInput = styled.input<{ readOnly: boolean; selectedValue: boolean }>`
  border: none;
  padding: 0 12px;
  width: 100%;
  height: 100%;

  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "text")};

  background-color: white;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.label};

  &:focus {
    outline: none;
  }

  [type="number"] {
    -moz-appearance: textfield;
  }
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-input-placeholder {
    color: ${({ theme, selectedValue }) =>
      theme.colors.label + `${!selectedValue ? "8F" : ""}`};
  }
  ::-moz-placeholder {
    color: ${({ theme, selectedValue }) =>
      theme.colors.label + `${!selectedValue ? "8F" : ""}`};
  }
  ::-ms-placeholder {
    color: ${({ theme, selectedValue }) =>
      theme.colors.label + `${!selectedValue ? "8F" : ""}`};
  }
  ::placeholder {
    color: ${({ theme, selectedValue }) =>
      theme.colors.label + `${!selectedValue ? "8F" : ""}`};
  }
`;

export default TextFieldInput;
