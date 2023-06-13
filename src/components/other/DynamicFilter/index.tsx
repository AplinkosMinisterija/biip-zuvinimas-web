import { useMediaQuery } from "@material-ui/core";
import { map } from "lodash";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import styled from "styled-components";
import { device } from "../../../styles";
import api from "../../../utils/api";
import {
  formatDate,
  handleAlert,
  handleGetExcel,
  mapFishStockingsRequestParams
} from "../../../utils/functions";
import { buttonsTitles } from "../../../utils/texts";
import Icon from "../Icon";
import Loader from "../Loader";
import Popup from "../Popup";
import Filter, { FilterConfig, FilterInputTypes } from "./Filter";

const mapFilters = (
  filterConfig: { [key: string]: FilterConfig },
  filters?: { [key: string]: any }
): string[] => {
  const applied: { key: string; label: string }[] | any = [];
  if (filters) {
    map(filterConfig, (config) => {
      const optionLabel = config?.optionLabel;
      const hasOptionLabelFunction = !!optionLabel;

      const filter: any = filters?.[config.key];
      if (filter) {
        const multiSelects = [
          FilterInputTypes.multiselect,
          FilterInputTypes.asyncMultiSelect
        ];
        const selects = [
          FilterInputTypes.singleSelect,
          FilterInputTypes.asyncSingleSelect
        ];

        const label = `${config.label}:`;

        if (config.inputType === FilterInputTypes.date) {
          applied.push({
            key: config.key,
            label: `${label} ${formatDate(filter)}`
          });
        } else if (multiSelects.includes(config.inputType)) {
          applied.push(
            map(filter, (item: any) => {
              return {
                key: config.key,
                id: item.id,
                label: `${label} ${
                  hasOptionLabelFunction ? optionLabel(item) : item.label
                }`
              };
            })
          );
        } else if (selects.includes(config.inputType)) {
          applied.push({
            key: config.key,
            label: `${label} ${
              hasOptionLabelFunction ? optionLabel(filter) : filter.label
            }`
          });
        } else {
          applied.push({
            key: config.key,
            label: `${label} ${filter}`
          });
        }
      }
    });
  }
  return applied.flat();
};

const DynamicFilter = ({
  loading = false,
  disabled = false,
  className,
  filterConfig,
  rowConfig,
  onSetFilters,
  filters
}: any) => {
  const isMobile = useMediaQuery(device.mobileL);

  const [showFilters, setShowFilters] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<any>([]);

  useEffect(() => {
    setAppliedFilters(mapFilters(filterConfig, filters));
  }, [filters, filterConfig]);

  const params = mapFishStockingsRequestParams(filters);

  const excelMutation = useMutation((filter: any) => api.getExcel({ filter }), {
    onError: () => {
      handleAlert();
    },
    onSuccess: (data) => {
      handleGetExcel(data);
    }
  });

  return (
    <>
      <Container>
        {!isMobile &&
          map(appliedFilters, (appliedFilter, index) => (
            <Tag key={`${appliedFilter}_${index}`}>
              <TextContainer>{appliedFilter?.label}</TextContainer>
              <CloseIconContainer
                onClick={() => {
                  const { [appliedFilter.key]: key, ...rest } = filters;
                  if (appliedFilter.id) {
                    onSetFilters({
                      ...rest,
                      [appliedFilter.key]: key.filter(
                        (filter: any) => filter.id !== appliedFilter.id
                      )
                    });

                    return;
                  }

                  onSetFilters(rest);
                }}
              >
                <CloseIcon name="close" />{" "}
              </CloseIconContainer>
            </Tag>
          ))}
        <Wrapper
          className={className}
          disabled={disabled}
          onClick={() => setShowFilters(true)}
        >
          <StyledButton disabled={disabled}>
            <StyledIcon name="filter" />
            {loading ? <Loader color="white" /> : "Filtrai"}
            <Count>{appliedFilters.length}</Count>
          </StyledButton>
        </Wrapper>

        <StyledButton onClick={() => excelMutation.mutateAsync(params)}>
          <StyledIcon name={"download"} />
          {buttonsTitles.excel}
        </StyledButton>
      </Container>
      <Popup visible={showFilters} onClose={() => setShowFilters(false)}>
        <FilterWraper>
          <Filter
            values={filters}
            filters={filterConfig}
            rowConfig={rowConfig}
            onSubmit={(values) => {
              onSetFilters(values);
              setShowFilters(false);
            }}
          />
        </FilterWraper>
      </Popup>
    </>
  );
};

const Container = styled.div`
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
`;
const CloseIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 2rem;
`;

const CloseIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 4px;
  cursor: pointer;
`;

const TextContainer = styled.div`
  text-align: center;
  vertical-align: middle;
`;

const Wrapper = styled.div<{
  disabled: boolean;
}>`
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
  min-width: 100px;
`;

export const StyledButton = styled.button<{}>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-radius: 4px;
  background-color: white;
  color: #121926;
  border: 1px solid #cdd5df;
  font-weight: normal;
  font-size: 1.4rem;
  :hover {
    opacity: 0.6;
  }
  cursor: pointer;
  width: fit-content;
  padding: 12px;
  margin: 4px 8px 4px 0;
`;

const StyledIcon = styled(Icon)`
  color: #9aa4b2;
  margin-right: 14px;
`;

const Count = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 9px;
  width: 18px;
  height: 18px;
  justify-content: center;
  align-items: center;
  display: flex;
  color: white;
  font-size: 1rem;
  margin-left: 14px;
`;

const Tag = styled.div`
  background-color: ${({ theme }) => `${theme.colors.secondary}33`};
  height: 40px;
  padding: 12px 8px;
  color: ${({ theme }) => `${theme.colors.secondary}`};
  margin: 4px 8px 4px 0;
  border-radius: 4px;
  font-size: 1.2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FilterWraper = styled.div`
  padding: 0 24px 24px 24px;
`;

DynamicFilter.map = mapFilters;
export default DynamicFilter;
