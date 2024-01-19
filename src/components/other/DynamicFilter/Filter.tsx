import { Formik } from 'formik';
import { map } from 'lodash';
import styled from 'styled-components';
import { device } from '../../../styles';
import { handleDateRestriction } from '../../../utils/functions';
import { buttonsTitles } from '../../../utils/texts';
import Button from '../../buttons/Button';
import AsyncMultiSelect from '../../fields/AsyncMultiSelect';
import AsyncSelectField from '../../fields/AsyncSelect';
import Datepicker from '../../fields/DatePicker';
import MultiSelect from '../../fields/MultiSelect';
import SelectField from '../../fields/SelectField';
import TextField from '../../fields/TextField';

export interface LabelsProps {
  [key: string]: string;
}

export interface LoginLayoutProps {
  filters: { [key: string]: FilterConfig };
  rowConfig: string[][];
  onSubmit: (values: any) => void;
  values?: any;
}

export enum FilterInputTypes {
  text = 'text',
  date = 'date',
  multiselect = 'multiselect',
  singleSelect = 'singleselect',
  asyncSingleSelect = 'asyncSingleSelect',
  asyncMultiSelect = 'asyncMultiSelect',
}

export interface FilterConfig {
  label: string;
  key: string;
  optionLabel?: (value: any) => string;
  inputType: FilterInputTypes;
  options?: any[];
  customSetValue?: (setFieldValue: () => void, input: string) => void;
  getDependId?: (values: any) => string;
  optionsApi?: (input?: string, page?: number) => Promise<any>;
  refreshOptions?: (input?: string, page?: number) => Promise<any>;
  getOptionValue?: (value: any) => string;
  default?: any;
}

const Filter = ({ values, filters, rowConfig, onSubmit }: LoginLayoutProps) => {
  const generateDefaultValues = () => {
    const defaultValues: any = {};
    map(filters, (filter: any) => {
      defaultValues[filter.key] =
        filter.default || (filter.inputType === FilterInputTypes.text ? '' : null);
    });
    return defaultValues;
  };

  const renderRow = (row: string[], values: any, setFieldValue: any, index: number) => (
    <Content key={`row_${index}`}>
      {map(row, (rowKey: string, index: number) => {
        const filter = filters[rowKey];
        const singleItem = row.length === 1;
        const optionLabel = filter?.optionLabel;
        const optionValue = filter?.getOptionValue;
        const hasOptionValue = !!optionValue;
        const hasOptionLabelFunction = !!optionLabel;
        const customSetValue = filter?.customSetValue;

        if (filter) {
          if (filter.inputType === FilterInputTypes.date) {
            return (
              <InputWrapper single={singleItem} key={filter.key} isLast={index === row.length - 1}>
                <Datepicker
                  name={filter.key}
                  value={values[filter.key]}
                  {...(!!handleDateRestriction(filter, values) &&
                    handleDateRestriction(filter, values))}
                  onChange={(value) => setFieldValue(filter.key, value)}
                  label={filter.label}
                />
              </InputWrapper>
            );
          } else if (filter.inputType === FilterInputTypes.singleSelect) {
            return (
              <InputWrapper single={singleItem} key={filter.key} isLast={index === row.length - 1}>
                <SelectField
                  name={filter.key}
                  label={filter.label}
                  value={values[filter.key]}
                  dependantId={filter.getDependId && filter.getDependId(values)}
                  isClearable={true}
                  options={filter.options || []}
                  onChange={(value) =>
                    !!customSetValue
                      ? customSetValue(setFieldValue, value)
                      : setFieldValue(filter.key, value)
                  }
                  getOptionLabel={(option) =>
                    hasOptionLabelFunction ? optionLabel(option) : option.label
                  }
                  getInputLabel={(option) => option.label}
                  refreshOptions={filter.refreshOptions}
                />
              </InputWrapper>
            );
          } else if (filter.inputType === FilterInputTypes.multiselect) {
            return (
              <InputWrapper single={singleItem} key={filter.key} isLast={index === row.length - 1}>
                <MultiSelect
                  name={filter.key}
                  label={filter.label}
                  values={values[filter.key] || []}
                  options={filter.options || []}
                  onChange={(value) => setFieldValue(filter.key, value)}
                  getOptionLabel={(option) => option.label}
                  refreshOptions={filter.refreshOptions}
                />
              </InputWrapper>
            );
          } else if (filter.inputType === FilterInputTypes.asyncSingleSelect) {
            return (
              <InputWrapper single={singleItem} key={filter.key} isLast={index === row.length - 1}>
                <AsyncSelectField
                  name={filter.key}
                  label={filter.label}
                  value={values[filter.key]}
                  onChange={(value) => setFieldValue(filter.key, value)}
                  getOptionLabel={(option) =>
                    hasOptionLabelFunction ? optionLabel(option) : option.name
                  }
                  setSuggestionsFromApi={(input, page) =>
                    filter.optionsApi && filter.optionsApi(input, page)
                  }
                />
              </InputWrapper>
            );
          } else if (filter.inputType === FilterInputTypes.asyncMultiSelect) {
            return (
              <InputWrapper single={singleItem} key={filter.key} isLast={index === row.length - 1}>
                <AsyncMultiSelect
                  name={filter.key}
                  label={filter.label}
                  values={values[filter.key] || []}
                  onChange={(value) => setFieldValue(filter.key, value)}
                  getOptionLabel={(option) =>
                    hasOptionLabelFunction ? optionLabel(option) : option.name
                  }
                  setSuggestionsFromApi={(input, page) =>
                    filter.optionsApi && filter.optionsApi(input, page)
                  }
                  getOptionValue={(option) => (hasOptionValue ? optionValue(option) : option.id)}
                />
              </InputWrapper>
            );
          }
          return (
            <InputWrapper single={singleItem} key={filter.key} isLast={index === row.length - 1}>
              <TextField
                name={filter.key}
                key={filter.key}
                onChange={(value) => setFieldValue(filter.key, value)}
                value={values[filter.key]}
                label={filter.label}
              />
            </InputWrapper>
          );
        }
      })}
    </Content>
  );

  return (
    <Container>
      <Formik
        enableReinitialize={true}
        initialValues={values || generateDefaultValues()}
        onSubmit={onSubmit}
        validateOnChange={false}
      >
        {({ values, errors, setFieldValue, handleSubmit, handleReset }: any) => (
          <>
            {map(rowConfig, (row, index) => {
              return renderRow(row, values, setFieldValue, index);
            })}
            <Row key="form_actions">
              <ClearButton
                onClick={(e) => {
                  handleReset(e);
                  onSubmit(null);
                }}
              >
                {buttonsTitles.clearAll}
              </ClearButton>
              <StyledButton type="submit" onClick={handleSubmit}>
                {buttonsTitles.filter}
              </StyledButton>
            </Row>
          </>
        )}
      </Formik>
    </Container>
  );
};

const Container = styled.div`
  max-width: 500px;
  @media ${device.mobileL} {
    max-width: 100%;
  }
`;

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const InputWrapper = styled.div<{ isLast: boolean; single: boolean }>`
  padding: 0 ${({ isLast }) => (isLast ? 0 : '12px')} 0 0;
  min-width: ${({ single }) => (single ? '400px' : 'auto')};
  flex: 2;
  margin-top: 8px;

  @media ${device.mobileL} {
    min-width: 100%;
  }
`;

const StyledButton = styled(Button)`
  margin-top: 24px;
  align-self: flex-end;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  margin-left: auto;
`;

const ClearButton = styled.button`
  margin-top: 24px;
  align-self: flex-end;
  height: 40px;
  padding: 0 20px;
  cursor: pointer;
  color: #175cd3;
  text-decoration: underline;
  :hover {
    opacity: 0.6;
  }
`;

export default Filter;
