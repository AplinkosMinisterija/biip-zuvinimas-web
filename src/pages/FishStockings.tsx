import { useMediaQuery } from "@material-ui/core";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import styled from "styled-components";
import DefaultLayout from "../components/Layouts/Default";
import Button from "../components/buttons/Button";
import DisplayMap from "../components/other/DisplayMap";
import DynamicFilter from "../components/other/DynamicFilter";
import { FilterInputTypes } from "../components/other/DynamicFilter/Filter";
import EventItem from "../components/other/EventItem";
import LoaderComponent from "../components/other/LoaderComponent";
import { actions } from "../state/filters/reducer";
import { useAppSelector } from "../state/hooks";
import { RootState } from "../state/store";
import { device } from "../styles";
import api, { GetAllResponse } from "../utils/api";
import {
  getFishStockingStatusOptions,
  handleResponse,
  mapFishStockingsRequestParams,
} from "../utils/functions";
import { useFishTypes, useMunicipalities } from "../utils/hooks";
import { slugs } from "../utils/routes";
import {
  buttonsTitles,
  descriptions,
  fishStockingsFiltersLabels,
} from "../utils/texts";
import {
  FishStocking,
  FishStockingFilters,
  FishType,
  Municipality,
} from "../utils/types";

const rowConfig = [
  ["locationName"],
  ["municipality"],
  ["eventTimeFrom", "eventTimeTo"],
  ["fishTypes"],
  ["status"],
];

interface FilterConfig {
  municipalities: Municipality[];
  fishTypes: FishType[];
}

const filterConfig = ({ municipalities, fishTypes }: FilterConfig) => ({
  eventTimeFrom: {
    label: fishStockingsFiltersLabels.dateFrom,
    key: "eventTimeFrom",
    inputType: FilterInputTypes.date,
  },
  eventTimeTo: {
    label: fishStockingsFiltersLabels.dateTo,
    key: "eventTimeTo",
    inputType: FilterInputTypes.date,
  },
  fishTypes: {
    label: fishStockingsFiltersLabels.fishes,
    key: "fishTypes",
    inputType: FilterInputTypes.multiselect,
    options: fishTypes,
  },
  municipality: {
    label: fishStockingsFiltersLabels.municipality,
    key: "municipality",
    inputType: FilterInputTypes.singleSelect,
    options: municipalities,
    optionLabel: (option: any) => `${option?.name}`,
  },
  locationName: {
    label: fishStockingsFiltersLabels.locationName,
    key: "locationName",
    inputType: FilterInputTypes.text,
  },
  status: {
    label: fishStockingsFiltersLabels.status,
    key: "status",
    inputType: FilterInputTypes.multiselect,
    options: getFishStockingStatusOptions(),
  },
});
const FishStockings = () => {
  const [loading, setLoading] = useState(true);
  const [fishStockings, setFishStockings] = useState<FishStocking[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState(false);
  const isMobile = useMediaQuery(device.mobileL);
  const fishTypes = useFishTypes();
  const municipalities = useMunicipalities();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filters = useAppSelector(
    (state: RootState) => state.filters.fishStocking
  );

  const handleFilterStockings = (filters: FishStockingFilters) => {
    dispatch(actions.setFishStocking(filters));
  };

  const getStockings = async (page: number) => {
    setLoading(true);
    handleResponse({
      endpoint: () =>
        api.getFishStockings({
          filter: mapFishStockingsRequestParams(filters),
          page: page,
        }),
      onSuccess: (list: GetAllResponse<FishStocking>) => {
        setCurrentPage(list.page);
        setHasMore(list.page < list.totalPages);
        if (page == 1) {
          setFishStockings(list?.rows);
        } else {
          setFishStockings([...fishStockings, ...list?.rows]);
        }
        setLoading(false);
      },
    });
  };

  const handleScroll = async (e: any) => {
    const element = e.currentTarget;
    const isTheBottom =
      Math.abs(
        element.scrollHeight - element.clientHeight - element.scrollTop
      ) < 1;

    if (isTheBottom && hasMore && !loading) {
      getStockings(currentPage + 1);
    }
  };

  useEffect(() => {
    getStockings(1);
  }, [filters]);

  const isNoFishStockings = isEmpty(fishStockings) && isEmpty(filters);

  const renderContent = () => {
    if (isEmpty(fishStockings))
      return loading ? (
        <LoaderComponent />
      ) : (
        <NotFoundContainer>
          <Description>
            {isNoFishStockings
              ? descriptions.stockingsNotFound
              : descriptions.stockingsNotFoundbyFilter}
          </Description>
          {isNoFishStockings && (
            <StyledButton
              onClick={() => navigate(slugs.newFishStockings)}
              height={40}
              padding="0"
              disabled={false}
            >
              {buttonsTitles.newFishStocking}
            </StyledButton>
          )}
        </NotFoundContainer>
      );

    return (
      <>
        {fishStockings.map((fishStocking) => (
          <EventItem
            key={fishStocking.id}
            fishStocking={fishStocking}
            onClick={() => navigate(slugs.fishStocking(`${fishStocking?.id}`))}
          />
        ))}
        {loading && <LoaderComponent />}
      </>
    );
  };

  return (
    <DefaultLayout>
      <InnerContainer>
        <Container onScroll={handleScroll}>
          <DynamicFilter
            filters={filters}
            filterConfig={filterConfig({ fishTypes, municipalities })}
            rowConfig={rowConfig}
            onSetFilters={handleFilterStockings}
            disabled={loading}
          />
          {renderContent()}
        </Container>
        {!isMobile && <DisplayMap />}
      </InnerContainer>
    </DefaultLayout>
  );
};

export default FishStockings;

const NotFoundContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

const Description = styled.div`
  text-align: center;
  font: normal normal medium 1.6rem/26px Manrope;
  letter-spacing: 0px;
  color: #7a7e9f;
  width: 70%;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

const Container = styled.div`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  padding: 32px;

  @media ${device.mobileL} {
    padding: 12px;
  }
`;

const StyledButton = styled(Button)``;
