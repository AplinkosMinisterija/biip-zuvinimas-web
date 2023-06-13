import { useState } from "react";
import FieldWrapper from "./components/FieldWrapper";
import OptionsContainer from "./components/OptionsContainer";
import TextFieldInput from "./components/TextFieldInput";
import { getFilteredOptions } from "./utils/functions";

export interface SelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value?: any;
  error?: string;
  showError?: boolean;
  readOnly?: boolean;
  options?: any[];
  left?: JSX.Element;
  right?: JSX.Element;
  padding?: string;
  onChange: (option: any) => void;
  onSelect: (option: any) => void;
  disabled?: boolean;
  getOptionLabel: (option: any) => string;
  getInputLabel?: (option: any) => string;
  className?: string;
  placeholder?: string;
  backgroundColor?: string;
  hasBorder?: boolean;
  isClearable?: boolean;
  dependantId?: string;
  refreshOptions?: (dependantId?: string) => any;
}

const SuggestionsSelect = ({
  label,
  value,
  name,
  error,
  hasBorder,
  showError = true,
  readOnly = false,
  placeholder,
  options,
  className,
  left,
  right,
  padding,
  getOptionLabel,
  onChange,
  disabled,
  backgroundColor,
  getInputLabel,
  isClearable = false,
  dependantId,
  onSelect,
  refreshOptions,
  ...rest
}: SelectFieldProps) => {
  const [input, setInputValue] = useState<any>(null);
  const [showSelect, setShowSelect] = useState(false);

  const [suggestions, setSuggestions] = useState(options);

  const handleToggleSelect = () => {
    !disabled && setShowSelect(!showSelect);
  };

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSelect(false);
    }
  };

  const handleOnChange = (input: string) => {
    if (!options) return;

    if (input) {
      setShowSelect(true);
    }
    setInputValue(input);
    onChange(input);
    setSuggestions(getFilteredOptions(options, input, getOptionLabel));
  };

  return (
    <FieldWrapper
      onClick={handleToggleSelect}
      handleBlur={handleBlur}
      padding={padding}
      className={className}
      label={label}
      error={error}
      showError={showError}
    >
      <TextFieldInput
        value={input}
        name={name}
        error={error}
        onChange={handleOnChange}
        disabled={disabled}
        placeholder={
          (value && getInputLabel
            ? getInputLabel(value)
            : getOptionLabel(value)) || placeholder
        }
        selectedValue={value}
      />
      <OptionsContainer
        hideNoOptions={true}
        values={suggestions}
        getOptionLabel={getOptionLabel}
        showSelect={showSelect}
        handleClick={(val) => {
          setInputValue(getOptionLabel(value));
          onSelect(val);
          setShowSelect(false);
        }}
      />
    </FieldWrapper>
  );
};

export default SuggestionsSelect;
