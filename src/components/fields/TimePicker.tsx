import { format } from "date-fns";
import lt from "date-fns/locale/lt";
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import TextField from "../fields/TextField";
import Icon from "../other/Icon";

registerLocale("lt", lt);

export interface TimepickerProps {
  label?: string;
  value?: Date;
  error?: string;
  padding?: string;
  onChange: (option: any) => void;
  disabled?: boolean;
  className?: string;
  maxDate?: Date;
  minDate?: Date;
}

const TimePicker = ({
  value,
  error,
  onChange,
  label,
  disabled,
  padding,
  className,
  minDate,
  maxDate
}: TimepickerProps) => {
  const [open, setOpen] = useState(false);

  const handleBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
    }
  };

  const filterTime = (time: Date) => {
    if (minDate && time < new Date(minDate)) {
      return false;
    }

    if (maxDate && time > new Date(maxDate)) {
      return false;
    }

    return true;
  };

  return (
    <TimeContainer
      onClick={() => setOpen(!open)}
      className={className}
      tabIndex={1}
      onBlur={handleBlur}
    >
      <StyledTextInput
        readOnly={true}
        showError={false}
        label={label}
        padding={padding}
        value={value ? format(new Date(value), "HH:mm") : ""}
        error={error}
        rightIcon={<TimeIcon name={"time"} />}
        disabled={disabled}
      />
      {open && !disabled ? (
        <DatePicker
          locale="lt"
          //@ts-ignore
          filterTime={filterTime}
          open={open}
          showTimeSelect
          {...(maxDate ? { maxDate: new Date(maxDate) } : {})}
          {...(minDate ? { minDate: new Date(minDate) } : {})}
          showTimeSelectOnly
          timeIntervals={30}
          selected={value ? new Date(value as any) : null}
          onChange={(date: Date) => {
            if (maxDate && date > new Date(maxDate)) {
              return onChange(maxDate);
            }

            if (minDate && date < new Date(minDate)) {
              return onChange(minDate);
            }

            onChange(date);
            setOpen(false);
          }}
          inline
        ></DatePicker>
      ) : null}
    </TimeContainer>
  );
};

const TimeContainer = styled.div`
  cursor: pointer;
  &:focus {
    outline: none;
  }
  width: 100%;

  position: relative;
  .react-datepicker {
    top: 80px;
    position: absolute;
    z-index: 8;
    background-color: #ffffff;
    box-shadow: 0px 2px 16px #121a5529;
    border-radius: 10px;
    border: none;
  }
  .react-datepicker--time-only {
    width: 100%;
  }
  .react-datepicker__time-container {
    width: 100% !important;
    padding: 18px 0px;
  }
  .react-datepicker__time-box {
    width: 100% !important;
    text-align: start !important;
  }
  .react-datepicker__time-list-item {
    font: normal normal 500 1.6rem/22px Manrope !important;
    color: #121a55 !important;
  }
  .react-datepicker__time-list-item--disabled {
    color: ${({ theme }) => theme.colors.grey} !important;
  }
  .react-datepicker__time-list-item--selected {
    background-color: ${({ theme }) => theme.colors.secondary} !important;
  }
  .react-datepicker__header--time {
    display: none;
  }
`;

const TimeIcon = styled(Icon)`
  color: rgb(122, 126, 159);
  vertical-align: middle;
  margin-right: 8px;
  font-size: 2.8rem;
  align-self: center;
`;

const StyledTextInput = styled(TextField)`
  cursor: pointer !important;
`;

export default TimePicker;
