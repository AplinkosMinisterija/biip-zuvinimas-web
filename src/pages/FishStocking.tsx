import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import Done from '../components/forms/Done';
import RegistrationForm from '../components/forms/Registration';
import Unfinished from '../components/forms/Unfinished';
import DefaultLayout from '../components/Layouts/Default';
import LoaderComponent from '../components/other/LoaderComponent';
import api from '../utils/api';
import { FishStockingStatus } from '../utils/constants';
import { isNew } from '../utils/functions';
import { slugs } from '../utils/routes';

const FishStockingPage = () => {
  const [searchParams] = useSearchParams();
  const { repeat } = Object.fromEntries([...Array.from(searchParams)]);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: fishStocking, isLoading } = useQuery(['fishStocking', id], () => getStocking(), {
    onError: () => {
      navigate(slugs.fishStockings);
    },
  });
  const getStocking = async () => {
    if (isNew(id) && repeat) {
      return await api.getFishStocking(repeat);
    } else if (id) {
      return api.getFishStocking(id);
    }
    return;
  };

  if (isLoading) return <LoaderComponent />;

  const showNewFishStocking = isNew(id) && !repeat;
  const showRepeatFishStocking = isNew(id) && repeat && fishStocking;
  const showUnfinishedFishStocking =
    fishStocking &&
    ![FishStockingStatus.FINISHED, FishStockingStatus.INSPECTED].includes(fishStocking.status);
  const showFinishedFishStocking =
    fishStocking &&
    [FishStockingStatus.FINISHED, FishStockingStatus.INSPECTED].includes(fishStocking.status);

  if (
    !showNewFishStocking &&
    !showRepeatFishStocking &&
    !showUnfinishedFishStocking &&
    !showFinishedFishStocking
  ) {
    // There is nothing to render
    navigate(-1);
    return null;
  }

  const renderContent = () => {
    if (showNewFishStocking) {
      return <RegistrationForm />;
    } else if (showRepeatFishStocking) {
      return <RegistrationForm fishStocking={fishStocking} />;
    } else if (showUnfinishedFishStocking) {
      return <Unfinished fishStocking={fishStocking} />;
    } else if (showFinishedFishStocking) {
      return <Done fishStocking={fishStocking} />;
    }
  };

  return <DefaultLayout>{renderContent()}</DefaultLayout>;
};

export default FishStockingPage;
