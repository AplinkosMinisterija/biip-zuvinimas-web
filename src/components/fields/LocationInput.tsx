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

const StyledOptionhIcon = styled(Icon)`
  margin: 0px 30px;
  font-size: 1.9rem;
  color: #13c9e7;
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

export default LocationInput;
