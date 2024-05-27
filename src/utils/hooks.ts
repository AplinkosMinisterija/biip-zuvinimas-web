import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
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
} from './functions';
import { routes, slugs } from './routes';

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
  const { data } = useQuery('fishTypes', () => api.getFishTypes(), {
    onError: () => {
      handleAlert();
    },
  });

  return data?.rows || [];
};

export const useMunicipalities = () => {
  const { data } = useQuery('municipalities', () => api.getMunicipalities(), {
    onError: () => {
      handleAlert();
    },
  });

  return data?.rows || [];
};

export const useSignatureUsers = (id = '') => {
  const { data } = useQuery('signatureUsers', () => api.geSignatureUsers(id), {
    onError: () => {
      handleAlert();
    },
  });
  return data || [];
};

export const useAssignedToUsers = () => {
  const { data } = useQuery('usersByTenant', () => api.geUsersByTenant(), {
    onError: () => {
      handleAlert();
    },
    enabled: cookies.get('profileId') !== 'freelancer',
  });

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
  const { data, isLoading } = useQuery('setting', () => api.getSettings(), {
    onError: () => {
      handleAlert();
    },
  });

  return { loading: isLoading, minTime: data?.minTimeTillFishStocking || 0 };
};

export const useFishAges = () => {
  const { data } = useQuery('fishAges', () => api.getFishAges(), {
    onError: () => {
      handleAlert();
    },
  });
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
  const { mutateAsync, isLoading } = useMutation(api.eGatesSign, {
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
      await queryClient.invalidateQueries(['fishStockings', filters]);
      navigate(slugs.fishStockings);
    },
  };

  return callBacks;
};

export const useCheckAuthMutation = () => {
  const dispatch = useAppDispatch();

  const { mutateAsync, isLoading } = useMutation(handleGetCurrentUser, {
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

  const { mutateAsync } = useMutation(() => api.logout(), {
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
