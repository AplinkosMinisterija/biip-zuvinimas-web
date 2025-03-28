import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import Cookies from 'universal-cookie';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { actions, UserReducerProps } from '../state/user/reducer';
import api from './api';
import { RolesTypes, ServerErrorCodes } from './constants';
import {
  clearCookies,
  emptyUser,
  getOnLineStatus,
  handleAlert,
  handleGetCurrentUser,
  handleSetProfile,
  isNew,
} from './functions';
import { routes, slugs } from './routes';
import { useSearchParams } from 'react-router-dom';

const cookies = new Cookies();

export const useFilteredRoutes = () => {
  const profile = useGetCurrentProfile();

  return routes.filter((route) => {
    if (!route?.slug) return false;
    if (route.tenantOwner) {
      if (!profile?.role) return false;

      return [RolesTypes.USER_ADMIN, RolesTypes.OWNER].includes(profile?.role);
    }

    return true;
  });
};

export const useFishTypes = () => {
  const { data, error } = useQuery({
    queryKey: ['fishTypes'],
    queryFn: api.getFishTypes,
  });
  useEffect(() => {
    if (error) handleAlert();
  }, [error]);

  return data?.rows || [];
};

export const useMunicipalities = () => {
  const { data, error } = useQuery({
    queryKey: ['municipalities'],
    queryFn: api.getMunicipalities,
  });
  useEffect(() => {
    if (error) handleAlert();
  }, [error]);
  return data?.rows || [];
};

export const useSignatureUsers = (id = '') => {
  const { data, error } = useQuery({
    queryKey: ['signatureUsers'],
    queryFn: () => api.geSignatureUsers(id),
  });
  useEffect(() => {
    if (error) handleAlert();
  }, [error]);
  return data || [];
};

export const useAssignedToUsers = () => {
  const { data, error } = useQuery({
    queryKey: ['usersByTenant'],
    queryFn: () => api.geUsersByTenant(),
    enabled: cookies.get('profileId') !== 'freelancer',
  });
  useEffect(() => {
    if (error) handleAlert();
  }, [error]);
  return data || [];
};

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>();

  useEffect(() => {
    if (navigator?.geolocation) {
      return navigator.geolocation.getCurrentPosition((location) => {
        const { latitude, longitude } = location.coords;
        if (latitude && longitude) {
          setLocation({ lat: latitude, lng: longitude });
        }
      });
    }
  }, []);
  return location;
};

export const useSettings = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['setting'],
    queryFn: api.getSettings,
  });
  useEffect(() => {
    if (error) handleAlert();
  }, [error]);
  return { loading: isLoading, minTime: data?.minTimeTillFishStocking || 0 };
};

export const useFishAges = () => {
  const { data, error } = useQuery({ queryKey: ['fishAges'], queryFn: api.getFishAges });
  useEffect(() => {
    if (error) handleAlert();
  }, [error]);
  return data?.rows || [];
};

export const useGetCurrentProfile = () => {
  const profiles = useAppSelector((state) => state.user.userData.profiles);
  const profileId = cookies.get('profileId');
  const currentProfile = profiles?.find(
    (profile) => profile.id.toString() === profileId?.toString(),
  );
  return currentProfile;
};

export const useIsFreelancer = () => {
  const profile = useGetCurrentProfile();
  return profile?.freelancer;
};

export const useNavigatorOnLine = () => {
  const [status, setStatus] = useState(getOnLineStatus());

  const setOnline = () => setStatus(true);
  const setOffline = () => setStatus(false);

  useEffect(() => {
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  return status;
};

export const useEGatesSign = () => {
  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: api.eGatesSign,
    onError: () => {
      handleAlert();
    },
    onSuccess: ({ url }) => {
      window.location.replace(url);
    },
    retry: false,
  });

  return { isLoading, mutateAsync };
};

export const useFishStockingCallbacks = () => {
  const queryClient = useQueryClient();
  const filters = useAppSelector((state) => state.filters.fishStocking);
  const navigate = useNavigate();
  const callBacks = {
    onError: () => {
      handleAlert();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['fishStockings', JSON.stringify(filters)] });
      navigate(slugs.fishStockings);
    },
  };

  return callBacks;
};

export const useCheckAuthMutation = () => {
  const dispatch = useAppDispatch();

  const { mutateAsync, isPending: isLoading } = useMutation({
    mutationFn: handleGetCurrentUser,
    onError: ({ response }: any) => {
      if (isEqual(response.status, ServerErrorCodes.NO_PERMISSION)) {
        clearCookies();
        dispatch(actions.setUser(emptyUser));

        return;
      }

      handleAlert();
    },
    onSuccess: (data: UserReducerProps) => {
      if (data) {
        handleSetProfile(data?.userData?.profiles);
        dispatch(actions.setUser(data));
      }
    },
    retry: 5,
  });

  return { isLoading, mutateAsync };
};

export const useLogoutMutation = () => {
  const dispatch = useAppDispatch();

  const { mutateAsync } = useMutation({
    mutationFn: api.logout,
    onError: () => {
      handleAlert();
    },
    onSuccess: () => {
      clearCookies();
      dispatch(actions.setUser(emptyUser));
    },
  });

  return { mutateAsync };
};

export const useFishStocking = () => {
  const [searchParams] = useSearchParams();
  const repeat = searchParams.get('repeat');
  const { id } = useParams();

  const fishStockingId = repeat || id;

  const {
    data: fishStocking,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['fishStocking', id],
    queryFn: () => api.getFishStocking(fishStockingId),
    enabled: !!fishStockingId && !isNew(fishStockingId),
  });

  return {
    fishStocking,
    isLoading,
    isFetching,
    isError,
    isRepeating: !!repeat && fishStocking?.id.toString() === repeat,
  };
};
