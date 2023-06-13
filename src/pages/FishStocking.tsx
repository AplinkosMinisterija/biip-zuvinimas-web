import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import Done from "../components/forms/Done";
import RegistrationForm from "../components/forms/Registration";
import Unfinished from "../components/forms/Unfinished";
import DefaultLayout from "../components/Layouts/Default";
import LoaderComponent from "../components/other/LoaderComponent";
import api from "../utils/api";
import { FishStockingStatus } from "../utils/constants";
import { handleResponse, isNew } from "../utils/functions";
import { slugs } from "../utils/routes";
import { FishStocking } from "../utils/types";

const FishStockingPage = () => {
  const [loading, setLoading] = useState(true);
  const [fishStocking, setFishStocking] = useState<FishStocking>();
  const [searchParams] = useSearchParams();
  const { repeat } = Object.fromEntries([...Array.from(searchParams)]);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const getRepeatedStocking = async () => {
    if (isNew(id!) && repeat) {
      setLoading(true);
      await handleResponse({
        endpoint: () => api.getFishStocking(repeat),
        onError: () => {
          navigate(slugs.fishStockings);
        },
        onSuccess: (item: FishStocking) => {
          const { eventTime, ...rest } = item;
          setFishStocking(rest);
          setLoading(false);
        }
      });

      return true;
    } else {
      return false;
    }
  };

  const getStocking = async () => {
    const isRepeatedStocking = await getRepeatedStocking();

    if (isRepeatedStocking) return;

    if (isNew(id!)) {
      setFishStocking(undefined);
      setLoading(false);
      return;
    }

    setLoading(true);

    await handleResponse({
      endpoint: () => api.getFishStocking(id!),
      onError: () => {
        navigate(slugs.fishStockings);
      },
      onSuccess: (item: FishStocking) => {
        setFishStocking(item);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getStocking();
  }, [location.pathname]);

  if (loading) return <LoaderComponent />;

  const renderForm = () => {
    if (isNew(id!)) {
      return <RegistrationForm fishStocking={fishStocking!} />;
    }

    if (
      [FishStockingStatus.ONGOING, FishStockingStatus.UPCOMING].includes(
        fishStocking?.status!
      )
    )
      return <Unfinished fishStocking={fishStocking!} />;

    return <Done fishStocking={fishStocking!} />;
  };

  return <DefaultLayout>{renderForm()}</DefaultLayout>;
};

export default FishStockingPage;
