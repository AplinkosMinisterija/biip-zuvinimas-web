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
      return await api.getFishStocking(repeat!);
    }

    if (isNew(id)) return;

    return api.getFishStocking(id!);
  };

  if (isLoading) return <LoaderComponent />;

  const renderForm = () => {
    if (isNew(id!) || !fishStocking) {
      return <RegistrationForm fishStocking={fishStocking!} />;
    }

    if ([FishStockingStatus.ONGOING, FishStockingStatus.UPCOMING].includes(fishStocking?.status!))
      return <Unfinished fishStocking={fishStocking!} />;

    return <Done fishStocking={fishStocking!} />;
  };

  return <DefaultLayout>{renderForm()}</DefaultLayout>;
};

export default FishStockingPage;
