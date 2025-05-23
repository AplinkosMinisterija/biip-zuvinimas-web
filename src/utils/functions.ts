import { endOfDay, format, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { isEmpty, map } from 'lodash';
import Compress from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import { FilterConfig } from '../components/other/DynamicFilter/Filter';
import { UserReducerProps } from '../state/user/reducer';
import api from './api';
import { FishStockingStatus } from './constants';
import { fishStockingStatusLabels, validationTexts } from './texts';
import { FishStockingFilters, FishStockingParams, Profile, ProfileId } from './types';

interface SetResponseProps {
  endpoint: () => Promise<any>;
  onSuccess: (data: any) => void;
  onError?: (data: any) => void;
  isOffline?: () => void;
}

export const validateFileTypes = (files: File[], availableMimeTypes: string[]) => {
  for (let i = 0; i < files.length; i++) {
    const availableType = availableMimeTypes.find((type) => type === files[i].type);
    if (!availableType) return false;
  }
  return true;
};

export const handleAlert = (responseError?: string) => {
  toast.error(
    validationTexts[responseError as keyof typeof validationTexts] ||
      responseError ||
      validationTexts.error,
    {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    },
  );
};

export const handleSuccess = (message: string) => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
  });
};

export const handleGetExcel = async (data: any) => {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Žuvinimai.xlsx`);
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
};

interface UpdateTokenProps {
  token?: string;
  error?: string;
  message?: string;
  refreshToken?: string;
}

const cookies = new Cookies();

export const handleUpdateTokens = (data: UpdateTokenProps) => {
  const { token, refreshToken } = data;
  if (token) {
    cookies.set('token', `${token}`, {
      path: '/',
      expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
    });
  }

  if (refreshToken) {
    cookies.set('refreshToken', `${refreshToken}`, {
      path: '/',
      expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 30),
    });
  }
};

export const emptyUser: UserReducerProps = {
  userData: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
  },
  loggedIn: false,
};

export const handleGetCurrentUser = async () => {
  if (!cookies.get('token')) return emptyUser;

  return { userData: await api.checkAuth(), loggedIn: true };
};

export const handleSelectProfile = (profileId: ProfileId) => {
  if (cookies.get('profileId')?.toString() === profileId?.toString()) return;

  cookies.set('profileId', `${profileId}`, { path: '/' });

  window.location.reload();
};

export const clearCookies = () => {
  cookies.remove('token', { path: '/' });
  cookies.remove('refreshToken', { path: '/' });
  cookies.remove('module', { path: '/' });
  cookies.remove('profileId', { path: '/' });
};

export const handleSetProfile = (profiles?: Profile[]) => {
  const isOneProfile = profiles?.length === 1;
  const profileId = cookies.get('profileId');

  if (isOneProfile) {
    return handleSelectProfile(profiles[0].id);
  }

  if (profileId) {
    const hasProfile = profiles?.some((profile) => profile.id.toString() === profileId.toString());

    if (hasProfile) {
      handleSelectProfile(profileId);
    } else {
      cookies.remove('profileId', { path: '/' });
    }
  }
};

export const getLocationList = async (input: string, page: number) => {
  return await api.searchLocations({ search: input, page });
};

export const getTenantsList = async (input: string, page: number) => {
  return await api.getTenants({
    filter: JSON.stringify({ name: input }),
    page,
  });
};

export const isNew = (id?: string) => !id || id === 'naujas';

export const formatDate = (date: Date | string) =>
  date ? format(new Date(date), 'yyyy-MM-dd') : '-';

export const handleDateRestriction = (filter: FilterConfig, values: any) => {
  const key = filter.key;
  const includesFrom = key.includes('From');
  const includesTo = key.includes('To');
  const dateTo = key.replace(/From$/, 'To');
  const dateFrom = key.replace(/To$/, 'From');
  return {
    ...(includesFrom &&
      values[dateTo] && {
        maxDate: new Date(values[dateTo]),
      }),
    ...(includesTo &&
      values[dateFrom] && {
        minDate: new Date(values[dateFrom]),
      }),
  };
};

export const mapFishStockingsRequestParams = (filters: FishStockingFilters) => {
  const params: FishStockingParams = {};
  if (filters) {
    (!!filters.eventTimeFrom || !!filters.eventTimeTo) &&
      (params.eventTime = {
        ...(filters.eventTimeFrom && {
          $gte: formatDateFrom(new Date(filters.eventTimeFrom)),
        }),
        ...(filters.eventTimeTo && {
          $lt: formatDateTo(new Date(filters.eventTimeTo)),
        }),
      });

    filters?.locationName && (params.locationName = filters?.locationName);

    !isEmpty(filters.status) && (params.status = map(filters.status, (f) => f.id));

    filters.municipality && (params.municipalityId = filters.municipality.id);
    !isEmpty(filters.fishTypes) && (params.fishTypes = map(filters.fishTypes, (f) => f.id));
  }

  return params;
};

export const getFishStockingStatusOptions = () => {
  return map(FishStockingStatus, (status) => ({
    id: status,
    label: fishStockingStatusLabels[status],
  }));
};

export const formatDateTo = (date: Date) => {
  return utcToZonedTime(endOfDay(new Date(date)), 'Europe/Vilnius');
};

export const formatDateFrom = (date: Date) => {
  return utcToZonedTime(startOfDay(new Date(date)), 'Europe/Vilnius');
};

export const getOnLineStatus = () =>
  typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;

export const compressImageSize = (file: File) =>
  new Promise((resolve) => {
    Compress.imageFileResizer(
      file,
      800,
      800,
      'JPEG',
      50,
      0,
      (uri) => {
        resolve(uri);
      },
      'blob',
    );
  });

export const checkIfDateIsAfter = (value: Date | undefined, minTime: number) => {
  const selectedDate = value && new Date(value);
  const minDate = new Date(new Date().setDate(new Date().getDate() + minTime));
  return selectedDate && selectedDate > minDate;
};

export const checkIfPointChanged = (geom1, geom2) => {
  const coordinates1 = geom1?.features?.[0]?.geometry?.coordinates?.map((num) =>
    Math.trunc(num),
  ) || [0, 0];
  const coordinates2 = geom2?.features?.[0]?.geometry?.coordinates?.map((num) =>
    Math.trunc(num),
  ) || [0, 0];
  const xdiff = coordinates1?.[0] - coordinates2?.[0];
  const ydiff = coordinates1?.[1] - coordinates2?.[1];
  const xChanged = xdiff > 1 || xdiff < -1;
  const yChanged = ydiff > 1 || ydiff < -1;

  return xChanged || yChanged;
};
