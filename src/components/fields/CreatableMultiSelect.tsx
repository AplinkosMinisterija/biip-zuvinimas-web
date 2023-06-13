import { useState } from "react";
import FieldWrapper from "./components/FieldWrapper";
import MultiTextField from "./components/MultiTextFieldInput";
import OptionsContainer from "./components/OptionsContainer";
import { handleRemove } from "./utils/functions";

export interface SelectOption {
  id?: string;
  label?: string;
  [key: string]: any;
}

export interface SelectFieldProps {
  id?: string;
  name: string;
  label?: string;
  values?: any;
  error?: string;
  showError?: boolean;
  editable?: boolean;
  padding?: string;
  onChange: (option: any) => void;
  handleLogs?: (data: any) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  backgroundColor?: string;
  isSearchable?: boolean;
}

const CreatableMultiSelect = ({
  label,
  values,
  error,
  showError = true,
  className,
  placeholder = "Įveskite sinonimus",
  padding,
  onChange,
  disabled = false
}: SelectFieldProps) => {
  const [input, setInputValue] = useState<any>("");
  const [showSelect, setShowSelect] = useState(false);
  const isExist = values.some((value: any) => value === input);

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      handleAdd();
    }
  };

  const clear = () => {
    setShowSelect(false);
    setInputValue("");
  };

  const handleAdd = () => {
    if (!isExist && input) {
      onChange([...values, input]);
    }
    clear();
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <FieldWrapper
      showError={showError}
      padding={padding}
      className={className}
      label={label}
      error={error}
      handleBlur={handleBlur}
    >
      <MultiTextField
        values={values}
        placeholder={placeholder}
        input={input}
        error={error}
        handleKeyDown={handleKeyDown}
        onRemove={({ index }) => {
          handleRemove(index, onChange, values);
        }}
        disabled={disabled}
        handleInputChange={(input) => {
          setShowSelect(input?.length > 0);
          setInputValue(input);
        }}
        getOptionLabel={(option) => `${option}`}
      />
      <OptionsContainer
        values={[
          isExist ? "Toks sinonimas jau egzistuoja" : `Sukurti: ${input}`
        ]}
        getOptionLabel={(option) => `${option}`}
        showSelect={showSelect}
        handleClick={handleAdd}
      />
    </FieldWrapper>
  );
};

export default CreatableMultiSelect;
