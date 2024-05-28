import { useNavigate } from 'react-router';
import Done from '../components/forms/Done';
import Unfinished from '../components/forms/Unfinished';
import DefaultLayout from '../components/Layouts/Default';
import LoaderComponent from '../components/other/LoaderComponent';
import { FishStockingStatus } from '../utils/constants';
import { slugs } from '../utils/routes';
import { useFishStocking } from '../utils/hooks';
import { useEffect } from 'react';

const FishStockingPage = () => {
  const navigate = useNavigate();
  const { fishStocking, isLoading, isError, isRepeating } = useFishStocking();

  useEffect(() => {
    if (isError) {
      navigate(slugs.fishStockings);
    }
  }, [isError]);

  if (isLoading) return <LoaderComponent />;

  const showFinishedFishStocking =
    fishStocking &&
    [FishStockingStatus.FINISHED, FishStockingStatus.INSPECTED].includes(fishStocking.status) &&
    isRepeating;

  const renderContent = () => {
    if (showFinishedFishStocking) {
      return <Done />;
    } else {
      return <Unfinished />;
    }
  };

  return <DefaultLayout>{renderContent()}</DefaultLayout>;
};

export default FishStockingPage;
