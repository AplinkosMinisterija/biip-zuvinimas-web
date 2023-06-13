import FieldWrapper from "./components/FieldWrapper";
import MultiTextField from "./components/MultiTextFieldInput";
import OptionsContainer from "./components/OptionsContainer";
import { filterSelectedOptions, handleRemove } from "./utils/functions";
import { useAsyncSelectData } from "./utils/hooks";

export interface SelectOption {
  id?: string;
  label?: string;
  [key: string]: any;
}

export interface SelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  values?: any[];
  error?: string;
  showError?: boolean;
  editable?: boolean;
  left?: JSX.Element;
  right?: JSX.Element;
  padding?: string;
  onChange: (option: any) => void;
  handleLogs?: (data: any) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  backgroundColor?: string;
  hasBorder?: boolean;
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => any;
  isSearchable?: boolean;
  setSuggestionsFromApi: (input: any, page: number, id?: any) => any;
  dependantId?: string;
  handleRefresh?: () => void;
  optionsKey?: string;
}

const AsyncMultiSelect = ({
  label,
  values = [],
  name,
  error,
  hasBorder,
  showError = true,
  editable = true,
  className,
  left,
  right,
  padding,
  optionsKey = "rows",
  onChange,
  handleLogs,
  disabled = false,
  backgroundColor,
  getOptionLabel = (option) => option.label,
  getOptionValue = (option) => option.id,
  isSearchable = false,
  setSuggestionsFromApi,
  dependantId,
  handleRefresh,
  ...rest
}: SelectFieldProps) => {
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
    onChange: (option: any) => onChange([...values, option]),
    dependantId,
    optionsKey
  });

  return (
    <FieldWrapper
      onClick={handleToggleSelect}
      label={label}
      error={error}
      handleBlur={handleBlur}
    >
      <MultiTextField
        values={values}
        onRemove={({ index }) => {
          handleRemove(index, onChange, values);
        }}
        input={input}
        error={error}
        disabled={disabled}
        handleInputChange={handleInputChange}
        getOptionLabel={getOptionLabel}
      />
      <OptionsContainer
        values={filterSelectedOptions(suggestions, values, getOptionValue)}
        getOptionLabel={getOptionLabel}
        loading={loading}
        showSelect={showSelect}
        handleClick={handleClick}
        handleScroll={handleScroll}
      />
    </FieldWrapper>
  );
};

export default AsyncMultiSelect;
