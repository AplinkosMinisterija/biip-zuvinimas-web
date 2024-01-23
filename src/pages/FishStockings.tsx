import { useMediaQuery } from '@material-ui/core';
import { isEmpty } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Button from '../components/buttons/Button';
import DefaultLayout from '../components/Layouts/Default';
import DisplayMap from '../components/other/DisplayMap';
import DynamicFilter from '../components/other/DynamicFilter';
import EventItem from '../components/other/EventItem';
import LoaderComponent from '../components/other/LoaderComponent';
import { actions } from '../state/filters/reducer';
import { useAppSelector } from '../state/hooks';
import { RootState } from '../state/store';
import { device } from '../styles';
import api from '../utils/api';
import { intersectionObserverConfig } from '../utils/configs';
import { getFishStockingStatusOptions, mapFishStockingsRequestParams } from '../utils/functions';
import { useFishTypes, useMunicipalities } from '../utils/hooks';
import { slugs } from '../utils/routes';
import { buttonsTitles, descriptions, fishStockingsFiltersLabels } from '../utils/texts';
import { FishStockingFilters, FishType, Municipality } from '../utils/types';
import { FilterInputTypes } from '../utils/constants';

const rowConfig = [
  ['locationName'],
  ['municipality'],
  ['eventTimeFrom', 'eventTimeTo'],
  ['fishTypes'],
  ['status'],
];

interface FilterConfig {
  municipalities: Municipality[];
  fishTypes: FishType[];
}

const filterConfig = ({ municipalities, fishTypes }: FilterConfig) => ({
  eventTimeFrom: {
    label: fishStockingsFiltersLabels.dateFrom,
    key: 'eventTimeFrom',
    inputType: FilterInputTypes.date,
  },
  eventTimeTo: {
    label: fishStockingsFiltersLabels.dateTo,
    key: 'eventTimeTo',
    inputType: FilterInputTypes.date,
  },
  fishTypes: {
    label: fishStockingsFiltersLabels.fishes,
    key: 'fishTypes',
    inputType: FilterInputTypes.multiselect,
    options: fishTypes,
  },
  municipality: {
    label: fishStockingsFiltersLabels.municipality,
    key: 'municipality',
    inputType: FilterInputTypes.singleSelect,
    options: municipalities,
    optionLabel: (option: any) => `${option?.name}`,
  },
  locationName: {
    label: fishStockingsFiltersLabels.locationName,
    key: 'locationName',
    inputType: FilterInputTypes.text,
  },
  status: {
    label: fishStockingsFiltersLabels.status,
    key: 'status',
    inputType: FilterInputTypes.multiselect,
    options: getFishStockingStatusOptions(),
  },
});
const FishStockings = () => {
  const isMobile = useMediaQuery(device.mobileL);
  const fishTypes = useFishTypes();
  const municipalities = useMunicipalities();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filters = useAppSelector((state: RootState) => state.filters.fishStocking);

  const handleFilterStockings = (filters: FishStockingFilters) => {
    dispatch(actions.setFishStocking(filters));
  };

  const getStockings = async (page: number) => {
    const fishStockings = await api.getFishStockings({
      filter: mapFishStockingsRequestParams(filters),
      page: page,
    });

    return {
      data: fishStockings.rows,
      page: fishStockings.page < fishStockings.totalPages ? fishStockings.page + 1 : undefined,
    };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery(
    ['fishStockings', filters],
    ({ pageParam }) => getStockings(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.page,
      cacheTime: 60000,
    },
  );

  const observerRef = useRef<any>(null);

  useEffect(() => {
    const currentObserver = observerRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, intersectionObserverConfig);

    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data]);

  const isNoFishStockings = isEmpty(data?.pages?.[0]?.data) && isEmpty(filters);

  const renderContent = () => {
    if (isEmpty(data?.pages?.[0]?.data))
      return isFetching ? (
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
        {data?.pages.map((page, pageIndex) => {
          return (
            <React.Fragment key={pageIndex}>
              {page.data.map((fishStocking, index) => (
                <div key={fishStocking.id}>
                  <EventItem
                    fishStocking={fishStocking}
                    onClick={() => navigate(slugs.fishStocking(`${fishStocking?.id}`))}
                  />
                  {pageIndex === data.pages.length - 1 && index === page.data.length - 1 && (
                    <div ref={observerRef}></div>
                  )}
                </div>
              ))}
            </React.Fragment>
          );
        })}
        {observerRef && <Invisible ref={observerRef} />}
        {isFetching && <LoaderComponent />}
      </>
    );
  };

  return (
    <DefaultLayout>
      <InnerContainer>
        <Container>
          <DynamicFilter
            filters={filters}
            filterConfig={filterConfig({ fishTypes, municipalities })}
            rowConfig={rowConfig}
            onSetFilters={handleFilterStockings}
            disabled={isFetching}
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

const Invisible = styled.div`
  width: 10px;
  height: 16px;
`;

const Description = styled.div`
  text-align: center;
  font-size: 1.6rem;
  line-height: 26px;
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
