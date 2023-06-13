import styled from "styled-components";
export interface NumericTextFieldProps {
  value?: string | number;
  name?: string;
  error?: string;
  showError?: boolean;
  label?: string | JSX.Element;
  icon?: JSX.Element;
  className?: string;
  left?: JSX.Element;
  right?: JSX.Element;
  padding?: string;
  onChange: (option: any) => void;
  onClick?: () => void;
  ref?: HTMLHeadingElement;
  bottomLabel?: string;
  disabled?: boolean;
  height?: number;
  readOnly?: boolean;
  onInputClick?: () => void;
  secondLabel?: JSX.Element;
  subLabel?: string;
}

const MonthDayField = ({
  value,
  name,
  error,
  showError = true,
  label,
  className,
  left,
  right,
  padding,
  onChange,
  onClick,
  disabled,
  height,
  onInputClick
}: NumericTextFieldProps) => {
  const getMonthAndDay = (value: string | number) => {
    //@ts-ignore
    const [, month, day] = value?.replace(/-/g, "").match(/(\d{0,2})(\d{0,2})/);

    return { month, day };
  };

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      const { month, day } = getMonthAndDay(value!);
      if (day && day.length !== 2) {
        onChange(`${month}-0${day[0]}`);
      }

      if (!day) {
        onChange("");
      }
    }
  };

  const handleChange = (e: any) => {
    let input: string = e.target.value;
    const regex = /^[0-9]{0,2}-?[0-9]{0,2}$/;

    const { month, day } = getMonthAndDay(input);

    if (regex.test(input)) {
      if (input[1] == "-") {
        return onChange(`0${month[0]}-`);
      }

      if (month > 12) {
        return onChange(`0${month[0]}-${month[1]}`);
      }

      if (day > 31) {
        return onChange(`${month}-31`);
      }

      if (day) {
        return onChange(`${month}-${day}`);
      }

      onChange(input);
    }
  };

  return (
    <Container className={className} padding={padding || "0"} onClick={onClick}>
      {!!label && (
        <LabelContainer>
          <Label>{label}</Label>
        </LabelContainer>
      )}
      <InputContainer
        error={!!error}
        height={height || 40}
        disabled={disabled || false}
      >
        {left}
        <TextInput
          onBlur={handleBlur}
          onClick={() => (onInputClick ? onInputClick() : null)}
          readOnly={!!disabled}
          type="text"
          name={name}
          autoComplete="off"
          value={value === 0 ? "0" : value || ""}
          onChange={handleChange}
          placeholder={"01-31"}
          min={"0"}
          disabled={disabled}
        />
        {right}
      </InputContainer>
      {showError && !!error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

const Container = styled.div<{ padding: string }>`
  display: block;
  padding: ${({ padding }) => padding};
`;

const InputContainer = styled.div<{
  error: boolean;
  height: number;
  disabled: boolean;
}>`
  display: flex;
  height: ${({ height }) => (height ? `${height}px` : `40px`)};
  background-color: white;
  justify-content: space-between;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid
    ${({ theme, error }) => (error ? theme.colors.error : theme.colors.border)};
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
  :focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const TextInput = styled.input<{ readOnly: boolean }>`
  border: none;
  padding: 0 12px;
  width: 100%;
  display: inline-block;
  cursor: ${({ readOnly }) => (readOnly ? "not-allowed" : "text")};

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
    color: ${({ theme }) => theme.colors.label + "8F"};
  }
  ::-moz-placeholder {
    color: ${({ theme }) => theme.colors.label + "8F"};
  }
  ::-ms-placeholder {
    color: ${({ theme }) => theme.colors.label + "8F"};
  }
  ::placeholder {
    color: ${({ theme }) => theme.colors.label + "8F"};
  }
`;

const Label = styled.label`
  text-align: left;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.label};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-items: flex-start;
`;

const ErrorMessage = styled.label`
  width: 100%;
  color: ${({ theme }) => theme.colors.error};
  font-size: 1.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default MonthDayField;
