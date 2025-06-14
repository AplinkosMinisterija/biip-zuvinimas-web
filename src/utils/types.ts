import { FishOriginTypes, FishStockingStatus, RolesTypes } from './constants';
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: RolesTypes;
  active?: boolean;
  phone?: string;
  mobilePhone?: string;
  password?: string;
  personalCode?: string;
  duties?: string;
  accessDate?: Date;
  getData?: boolean;
  error?: string;
  profiles?: Profile[];
}

export type FileProps = {
  url: string;
  name: string;
  size: number;
  main?: boolean;
};

export interface TenantUser {
  id?: string;

  role?: RolesTypes;
  tenant: Tenant;
  user: User;
}

export type ProfileId = 'freelancer' | string;

export interface Profile {
  id: ProfileId;
  name: string;
  freelancer: boolean;
  code?: string;
  email?: string;
  role: RolesTypes;
  phone: string;
}

export interface Tenant {
  phone: string;
  code: string;
  email: string;
  id?: number | string;
  name: string;
}

export type ResponseFileProps = {
  url: string;
  filename: string;
  size: number;
};

export interface ListResultProps<T> {
  rows?: T[];
  totalPages?: number;
  error?: string;
}

export interface TransformUser {
  id?: string;
  fullName: string;
  email: string;
  roles: string;
  active: string;
}

export interface TransformObservation {
  id?: string;
  name: string;
  nameLatin: string;
  createdAt: string;
}

export type HandleChangeType = (name: string, value: any) => void;
export type ChildrenType = string | JSX.Element | JSX.Element[] | any;

export interface DeleteInfoProps {
  deleteButtonText: string;
  deleteDescriptionFirstPart: string;
  deleteDescriptionSecondPart: string;
  deleteTitle: string;
  deleteName: string;
  deleteFunction?: () => void;
}

export interface UserFilters {
  firstName?: string;
  lastName?: string;
}

export interface Municipality {
  id: string;
  name: string;
}

export interface FishBatch {
  id: number;
  fishType: number | FishType;
  fishAge: number | FishAge;
  amount: number;
  weight?: number;
  reviewWeight?: number;
  reviewAmount?: number;
}

export interface FishStocking {
  id: number;
  status: FishStockingStatus;
  geom: any;
  location?: FishStockingLocation;
  eventTime: Date;
  comment?: string;
  stockingCustomer?: Tenant;
  fishOrigin: FishOriginTypes;
  fishOriginCompanyName?: string;
  fishOriginReservoir?: FishStockingLocation;
  assignedTo: User;
  phone: string;
  batches: Array<FishBatch>;
  reviewedBy?: User;
  reviewLocation?: { lat: number; lng: number };
  reviewTime?: string;
  waybillNo?: string;
  veterinaryApprovalNo?: string;
  veterinaryApprovalOrderNo?: string;
  containerWaterTemp?: number;
  waterTemp?: number;
  images?: any[];
  signatures?: {
    organization: string;
    signedBy: string;
    phone?: string;
    signature: string;
  }[];
  assignedToInspector?: User;
  inspector?: {
    firstName: string;
    lastName: string;
    id: number;
    organization: string;
    email?: string;
    phone?: string;
  };
  tenant?: Tenant;
  createdBy?: User;
  createdAt?: Date;
  updatedBy?: User;
  updatedAt?: Date;
  deletedBy?: User;
}

export interface RegistrationFormData {
  id?: number;
  geom: any;
  location?: FishStockingLocation;
  eventTime: Date;
  stockingCustomer?: Tenant;
  fishOrigin: FishOriginTypes;
  fishOriginCompanyName?: string;
  fishOriginReservoir?: FishStockingLocation;
  assignedTo: User;
  phone: string;
  batches: Array<FishBatch>;
}

export interface ReviewFormData {
  id: number;
  reviewLocation?: { lat: number; lng: number };
  reviewTime?: string;
  waybillNo?: string;
  veterinaryApprovalNo?: string;
  veterinaryApprovalOrderNo?: string;
  containerWaterTemp?: number;
  waterTemp?: number;
  images?: any[];
  signatures?: {
    organization: string;
    signedBy: string;
    phone?: string;
    signature: string;
  }[];
  assignedToInspector?: User;
  inspector?: {
    firstName: string;
    lastName: string;
    id: number;
    organization: string;
    email?: string;
    phone?: string;
  };
  comment: string;
  batches: Array<{
    id: number;
    reviewAmount: number;
    reviewWeight?: number;
  }>;
  newBatches: Array<FishBatch>;
}

export interface FishType {
  id: string;
  label: string;
}

export interface FishAge {
  id: number;
  label: number;
}

export interface FishStockingFilters {
  eventTimeFrom?: string;
  eventTimeTo?: string;
  locationName?: string;
  status?: { id: string; label: string }[];
  municipality?: { id: string; label: string };
  fishTypes?: { id: string; label: string }[];
}

export interface FishStockingParams {
  eventTime?: { $gte?: Date; $lt?: Date };
  locationName?: string;
  municipalityId?: string;
  fishTypes?: Array<string>;
  status?: string[];
}

export interface RegistrationFormFishRow {
  fishType?: FishType;
  fishAge?: FishAge;
  amount?: number;
  weight?: number;
}

export interface NewReviewFishRowProps {
  fishType?: FishType;
  fishAge?: FishAge;
  reviewAmount?: number;
  reviewWeight?: number;
}

export type RegistrationFormValues = Omit<
  Partial<FishStocking>,
  'eventTime' | 'batches' | 'geom' | 'id'
> & {
  eventTime?: Date;
  batches: Array<RegistrationFormFishRow | object>;
  geom?: any;
  id?: number;
};

export type Info = Array<Array<{ type: string; label: string; value: string }>>;

export type FishStockingLocation = {
  cadastral_id: string;
  name: string;
  municipality: { id: string; name: string };
  category: string;
  geom?: any;
  area?: number;
  length?: number;
};
