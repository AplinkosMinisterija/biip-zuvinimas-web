import styled from "styled-components";
import { inputLabels } from "../../utils/texts";
import Icon from "../other/Icon";
import FieldWrapper from "./components/FieldWrapper";
import OptionsContainer from "./components/OptionsContainer";
import TextFieldInput from "./components/TextFieldInput";
import { useAsyncSelectData } from "./utils/hooks";

export interface AsyncSelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  value?: any;
  error?: string;
  showError?: boolean;
  editable?: boolean;
  left?: JSX.Element;
  handleLogs?: (data: any) => void;
  right?: JSX.Element;
  padding?: string;
  onChange: (option: any) => void;
  disabled?: boolean;
  getOptionLabel: (option: any) => string;
  getInputLabel?: (option: any) => string;
  className?: string;
  placeholder?: string;
  backgroundColor?: string;
  hasBorder?: boolean;
  setSuggestionsFromApi: (input: any, page: number, id?: any) => any;
  getOptionValue?: (option: any) => any;
  dependantId?: string;
  optionsKey?: string;
  hasOptionKey?: boolean;
  primaryKey?: string;
  haveIncludeOptions?: boolean;
}

const AsyncSelectField = ({
  label,
  value,
  error,
  showError = true,
  className,
  padding,
  hasOptionKey = true,
  optionsKey = "rows",
  onChange,
  name,
  disabled = false,
  getOptionLabel = (option) => option.label,
  getOptionValue = (option) => option.id,
  setSuggestionsFromApi,
  dependantId,
  placeholder = inputLabels.chooseOption
}: AsyncSelectFieldProps) => {
  const {
    loading,
    handleScroll,
    suggestions,
    handleInputChange,
    handleToggleSelect,
    input,
    showSelect,
    handleBlur,
    handleClick
  } = useAsyncSelectData({
    setSuggestionsFromApi,
    disabled,
    onChange,
    dependantId,
    optionsKey,
    hasOptionKey
  });
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
        rightIcon={<StyledIcon name={"dropdownArrow"} />}
        onChange={handleInputChange}
        disabled={disabled}
        placeholder={(value && getOptionLabel(value)) || placeholder}
        selectedValue={value}
      />

      <OptionsContainer
        loading={loading}
        handleScroll={handleScroll}
        values={suggestions}
        getOptionLabel={getOptionLabel}
        showSelect={showSelect}
        handleClick={handleClick}
      />
    </FieldWrapper>
  );
};

const StyledIcon = styled(Icon)`
  color: #cdd5df;
  font-size: 2.4rem;
  margin-right: 12px;
`;

export default AsyncSelectField;
