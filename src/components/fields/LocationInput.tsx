import { isEmpty } from "lodash";
import { useState } from "react";
import styled from "styled-components";
import { useRecentLocations } from "../../utils/hooks";
import { inputLabels } from "../../utils/texts";
import Icon from "../other/Icon";
import FieldWrapper from "./components/FieldWrapper";
import TextFieldInput from "./components/TextFieldInput";

const LocationInput = ({
  onChange,
  error,
  disabled,
  value,
  handleSelectMap
}: any) => {
  const [showSelect, setShowSelect] = useState(false);

  const recentLocations = useRecentLocations();

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowSelect(false);
    }
  };
  const handleToggleSelect = () => {
    !disabled && setShowSelect(!showSelect);
  };

  return (
    <FieldWrapper
      onClick={handleToggleSelect}
      handleBlur={handleBlur}
      label={inputLabels.location}
      error={error}
    >
      <TextFieldInput
        error={error}
        value={value}
        readOnly={true}
        disabled={disabled}
        rightIcon={<StyledIcon name={"Searchlocation"} />}
      />
      {showSelect && !disabled ? (
        <OptionsContainer>
          <OptionRowContainer
            onClick={() => {
              setShowSelect(false);
              handleSelectMap();
            }}
          >
            <StyledOptionhIcon name={"map"} />
            <Options>{inputLabels.selectFromMap}</Options>
          </OptionRowContainer>
          {/* <OptionRowContainer
            onClick={() => {
              setShowSelect(false);
            }}
          >
            <StyledOptionhIcon name={"current"} />
            <Options>{inputLabels.currentLocation}</Options>
          </OptionRowContainer> */}
          {!isEmpty(recentLocations) && (
            <>
              <HistoryTitle>Paskutinės paieškos</HistoryTitle>
              {recentLocations.map((recentLocation: any) => {
                return (
                  <OptionRowContainer
                    onClick={() => onChange(recentLocation)}
                    key={recentLocation?.cadastral_id}
                  >
                    <StyledOptionhIcon name={"Searchlocation"} />

                    <Options>
                      {recentLocation?.name}
                      {", "}
                      {recentLocation?.municipality?.name}{" "}
                    </Options>
                  </OptionRowContainer>
                );
              })}
            </>
          )}
        </OptionsContainer>
      ) : null}
    </FieldWrapper>
  );
};

const OptionsContainer = styled.div`
  position: absolute;
  z-index: 9999;
  width: 100%;
  background-color: #ffffff;
  padding: 19px 0px 20px 0px;
  box-shadow: 0px 2px 16px #121a5529;
  border-radius: 4px;
  top: 70px;

  border: none;
  > * {
    &:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
  }
  > * {
    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
`;

const StyledIcon = styled(Icon)`
  color: rgb(122, 126, 159);
  font-size: 2.4rem;
  margin-right: 8px;
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
const StyledOptionhIcon = styled(Icon)`
  margin: 0px 30px;
  font-size: 1.9rem;
  color: #13c9e7;
`;

const Container = styled.div`
  display: block;
`;

const HistoryTitle = styled.div`
  font: normal normal 600 12px/40px Manrope;
  letter-spacing: 0.48px;
  color: #b3b5c4;
  margin-left: 23px;
`;

const Options = styled.div`
  cursor: pointer;
  font: normal normal 500 1.6rem/38px Manrope;
  color: #0b1f51;
  border: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
`;

const OptionRowContainer = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  &:hover {
    background-color: #f3f3f7;
  }
`;

const SearchContainer = styled.div<{ disabled: boolean }>`
  position: relative;
  width: 100%;
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
`;

const Input = styled.input`
  border: none;
  width: 100%;

  :focus {
    outline: none;
  }
  background-color: ${({ theme }) => theme.colors.input};
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.label};

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
  :focus {
    outline: none;
  }
`;

const Label = styled.label`
  text-align: left;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.label};
  opacity: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  height: 2.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SubLabel = styled.div`
  display: inline-block;
  font-size: 1.2rem;
  font-weight: 600;
  color: #0b1f518f;
  max-width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2rem;
`;

const ErrormMessage = styled.label<{ visible: boolean }>`
  display: inline-block;
  width: 100%;
  color: ${({ theme }) => theme.colors.error};
  font-size: 1.4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
`;

export default LocationInput;
