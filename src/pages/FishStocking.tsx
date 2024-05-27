import { useMutation, useQuery } from 'react-query';
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
import { buttonsTitles } from '../utils/texts';
import { useFishStockingCallbacks, useSettings } from '../utils/hooks';
import { FishStocking, RegistrationFormData } from '../utils/types';

const FishStockingPage = () => {
  const [searchParams] = useSearchParams();
  const { repeat } = Object.fromEntries([...Array.from(searchParams)]);
  const { id } = useParams();
  const navigate = useNavigate();

  const getStocking = async () => {
    if (isNew(id) && repeat) {
      return await api.getFishStocking(repeat);
    } else if (id && !isNew(id)) {
      return api.getFishStocking(id);
    }
    return;
  };

  const { data: fishStocking, isLoading } = useQuery(['fishStocking', id], getStocking, {
    onError: () => {
      navigate(slugs.fishStockings);
    },
  });

  if (isLoading) return <LoaderComponent />;

  const showFinishedFishStocking =
    fishStocking &&
    [FishStockingStatus.FINISHED, FishStockingStatus.INSPECTED].includes(fishStocking.status) &&
    fishStocking.id.toString() != repeat;

  const renderContent = () => {
    if (showFinishedFishStocking) {
      return <Done fishStocking={fishStocking} />;
    } else {
      return <Unfinished fishStocking={fishStocking} />;
    }
  };

  return <DefaultLayout>{renderContent()}</DefaultLayout>;
};

export default FishStockingPage;
