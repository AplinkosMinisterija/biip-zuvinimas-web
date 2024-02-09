import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { isFinite } from 'lodash';
import { FishStocking, FishType, Tenant, TenantUser, User } from './types';

import { isEmpty } from 'lodash';
import Cookies from 'universal-cookie';
import { Resources } from './constants';

const cookies = new Cookies();

interface GetAll {
  resource?: string;
  page?: number;
  populate?: string[];
  municipalityId?: string;
  filter?: string | any;
  query?: string;
  pageSize?: string;
  search?: string;
  searchFields?: string[];
  sort?: string[];
  scope?: string;
  fields?: string[];
  id?: string;
  geom?: any;
  responseType?: any;
}

export interface GetAllResponse<T> {
  rows: T[];
  totalPages: number;
  page: number;
  pageSize: number;
  error?: any;
}

interface TableList<T = any> {
  filter?: T;
  page?: number;
  id?: string;
  pageSize?: string;
  isMy?: boolean;
  scope?: string;
  geom?: any;
  fields?: string[];
  resource?: Resources;
  search?: string;
}

interface AuthApiProps {
  resource: string;
  params?: any;
}

interface GetOne {
  resource: string;
  id?: string | any;
  populate?: string[];
  scope?: string;
}

interface UpdateOne {
  resource?: string;
  id?: string;
  params?: any;
}

interface Delete {
  resource: string;
  id: string;
}

interface Create {
  resource: string;
  params: any;
  id?: string;
}

class Api {
  private AuthApiAxios: AxiosInstance;
  private readonly apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = process.env.VITE_ZUVINIMAS_API_BASE_URL ?? '/api';

    this.AuthApiAxios = Axios.create({
      baseURL: this.apiBaseUrl,
    });
    this.AuthApiAxios.interceptors.request.use(
      (config) => {
        const token = cookies.get('token');
        const profileId = cookies.get('profileId');
        if (token) {
          config.headers!.Authorization = 'Bearer ' + token;
          if (isFinite(parseInt(profileId))) config.headers!['X-Profile'] = profileId;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      },
    );
  }

  errorWrapper = async (endpoint: () => Promise<AxiosResponse<any, any>>) => {
    const res = await endpoint();
    return res.data;
  };

  getCommonConfigs = ({
    page,
    populate,
    sort,
    filter,
    pageSize,
    search,
    municipalityId,
    query,
    searchFields,
    scope,
    geom,
    fields,
    responseType,
  }: GetAll) => {
    return {
      params: {
        pageSize: pageSize || 10,
        page: page || 1,
        ...(!!populate && { populate }),
        ...(!!searchFields && { searchFields }),
        ...(!!search && { search }),
        ...(!!municipalityId && { municipalityId }),
        ...(!!geom && { geom }),
        ...(!!filter && { filter }),
        ...(!!sort && { sort }),
        ...(!!geom && { geom }),
        ...(!!query && { query }),
        ...(!!scope && { scope }),
        ...(!!fields && { fields }),
        ...(!!responseType && { responseType }),
      },
    };
  };

  getAll = async ({ resource, id, ...rest }: GetAll) => {
    const config = this.getCommonConfigs(rest);
    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/${resource}${id ? `/${id}` : ''}/all`, config),
    );
  };

  get = async ({ resource, id, ...rest }: GetAll) => {
    const config = this.getCommonConfigs(rest);
    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  getOne = async ({ resource, id, populate, scope }: GetOne) => {
    const config = {
      params: {
        ...(!!populate && { populate }),
        ...(!!scope && { scope }),
      },
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`/${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  update = async ({ resource, id, params }: UpdateOne) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.patch(`/${resource}/${id ? `/${id}` : ''}`, params),
    );
  };

  delete = async ({ resource, id }: Delete) => {
    return this.errorWrapper(() => this.AuthApiAxios.delete(`/${resource}/${id}`));
  };
  create = async ({ resource, id, params }: Create) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.post(`/${resource}${id ? `/${id}` : ''}`, params),
    );
  };

  checkAuth = async (): Promise<User> => {
    return this.errorWrapper(() => this.AuthApiAxios.get('/auth/me'));
  };

  logout = async () => {
    return this.errorWrapper(() => this.AuthApiAxios.post('/auth/users/logout'));
  };

  authApi = async ({ resource, params }: AuthApiProps) => {
    return this.errorWrapper(() => this.AuthApiAxios.post(`/${resource}`, params || {}));
  };

  refreshToken = async () => {
    return this.authApi({
      resource: Resources.REFRESH_TOKEN,
      params: { token: cookies.get('refreshToken') },
    });
  };

  login = async (params: any) => {
    return this.authApi({
      resource: Resources.LOGIN,
      params,
    });
  };

  eGatesSign = async () => {
    return this.authApi({
      resource: Resources.E_GATES_SIGN,
    });
  };

  eGatesLogin = async (params: any) => {
    return this.authApi({
      resource: Resources.E_GATES_LOGIN,
      params,
    });
  };

  tenantUsers = async ({ page }: TableList): Promise<GetAllResponse<TenantUser>> =>
    await this.get({
      resource: Resources.TENANT_USERS,
      populate: [Resources.USER],
      page,
      pageSize: '12',
    });

  createTenantUser = async (params: any): Promise<User> => {
    return await this.create({
      resource: Resources.INVITE_USER,
      params,
    });
  };
  updateTenantUser = async (params: any, id?: string): Promise<User> => {
    return await this.update({
      resource: Resources.TENANT_USERS,
      params,
      id,
    });
  };

  deleteTenantUser = async (id: string): Promise<User> =>
    await this.delete({
      resource: Resources.TENANT_USERS,
      id,
    });

  updateProfile = async (id: string, params: any): Promise<User> =>
    await this.update({
      resource: Resources.USERS,
      params,
      id,
    });

  updateMyProfile = async (params: any): Promise<User> =>
    await this.update({
      resource: Resources.ME,
      params,
    });

  getFishTypes = async (): Promise<GetAllResponse<FishType>> =>
    await this.get({
      resource: Resources.FISH_TYPES,
      pageSize: '999',
    });

  getMunicipalities = async (): Promise<any> =>
    await this.get({
      resource: Resources.MUNICIPALITIES,
      pageSize: '999',
    });

  getFishAges = async (): Promise<GetAllResponse<any>> =>
    await this.get({
      resource: Resources.FISH_AGES,
      pageSize: '999',
    });

  getLocations = async ({ search = '', page, geom }: TableList): Promise<any[]> =>
    await this.get({
      resource: Resources.LOCATION,
      search,
      geom,
      page,
    });
  geUsersByTenant = async (): Promise<User[]> =>
    await this.getAll({
      resource: Resources.USERS,
    });

  geSignatureUsers = async (
    municipalityId: string,
  ): Promise<{ id: string; name: string; users: string[] }[]> =>
    await this.get({
      resource: Resources.SIGNATURE_USERS,
      municipalityId,
    });

  getTenants = async ({ filter, page }: TableList): Promise<Tenant> =>
    await this.get({
      resource: Resources.TENANTS,
      filter,
      page,
    });

  getFishStockings = async ({ filter, page }: TableList): Promise<GetAllResponse<FishStocking>> =>
    await this.get({
      resource: Resources.FISH_STOCKING,
      populate: ['batches', 'createdBy', 'reviewedBy', 'assignedTo', 'status', 'location'],
      filter,
      page,
      pageSize: '12',
    });

  getFishStocking = async (id: string): Promise<FishStocking> =>
    await this.getOne({
      resource: Resources.FISH_STOCKING,
      populate: [
        'batches',
        'reviewedBy',
        'createdBy',
        'assignedTo',
        'status',
        'location',
        'geom',
        'stockingCustomer',
        'images',
        'fishOriginReservoir',
        'assignedToInspector',
      ],
      id,
    });

  registerFishStocking = async (params: any): Promise<FishStocking> =>
    await this.create({
      resource: Resources.FISH_STOCKING_REGISTER,
      params,
    });

  updateFishStocking = async (params: any, id: string): Promise<FishStocking> =>
    await this.update({
      resource: Resources.FISH_STOCKING_REGISTER,
      params,
      id,
    });

  deleteFishStocking = async (id: string): Promise<FishStocking> =>
    await this.delete({
      resource: Resources.FISH_STOCKING,
      id,
    });

  cancelFishStocking = async (id: string): Promise<FishStocking> =>
    await this.update({
      resource: Resources.FISH_STOCKING_CANCEL,
      id,
    });

  reviewFishStocking = async (params: any): Promise<FishStocking> =>
    await this.create({
      resource: Resources.FISH_STOCKING_REVIEW,
      params,
    });
  getSettings = async (): Promise<any> =>
    await this.get({
      resource: Resources.SETTINGS,
    });

  getRecentLocations = async (): Promise<any> =>
    await this.get({
      resource: Resources.RECENT_LOCATIONS,
    });

  deletePhoto = async (id: string): Promise<any> =>
    await this.delete({
      resource: Resources.PHOTOS,
      id,
    });

  uploadFiles = async (fishStockingId: any, files: File[] = []): Promise<any> => {
    if (isEmpty(files)) return [];

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    try {
      const data = await Promise.all(
        files?.map(async (file) => {
          const formData = new FormData();
          formData.append('fishStocking', fishStockingId);
          formData.append('file', file);
          const { data } = await this.AuthApiAxios.post(`/${Resources.PHOTOS}`, formData, config);
          return data;
        }),
      );

      return data?.flat()?.map((file) => {
        return {
          id: file.id,
          name: file.name,
          url: file?.url,
        };
      });
    } catch (e: any) {
      return { error: e.response.data.message };
    }
  };

  getExcel = async ({ filter }: TableList): Promise<any> => {
    const token = cookies.get('token');
    const profileId = cookies.get('profileId');

    const response = await fetch(
      `${this.apiBaseUrl}/${Resources.EXCEL}?filter=${JSON.stringify(filter)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          ...(profileId && !isNaN(profileId) && { 'X-Profile': profileId }),
          body: JSON.stringify(filter),
        },
      },
    );

    const data = await response.blob();

    return data;
  };
}

const api = new Api();

export default api;
