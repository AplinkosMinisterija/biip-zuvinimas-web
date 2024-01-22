export enum RolesTypes {
  USER = 'USER',
  USER_ADMIN = 'USER_ADMIN',
  OWNER = 'OWNER',
}

export enum ServerErrors {
  USER_NOT_FOUND = `Email not found.`,
  WRONG_PASSWORD = 'WRONG_PASSWORD',
  USER_EXIST = 'User already exists.',
  WRONG_OLD_PASSWORD = 'Wrong old password.',
  PARAMETERS_VALIDATION_ERROR = 'Parameters validation error!',
  NOT_FOUND = 'Not found.',
  ENTITY_NOT_FOUND = 'Entity not found',
}
export enum Resources {
  PHOTOS = 'fishStockingPhotos',
  LOGIN = 'auth/login',
  REFRESH_TOKEN = 'auth/refreshToken',
  MUNICIPALITIES = 'locations/municipalities',
  VERIFY_USER = 'auth/change/verify',
  SET_PASSWORD = 'auth/change/accept',
  REMIND_PASSWORD = 'auth/remind',
  E_GATES_LOGIN = 'auth/evartai/login',
  E_GATES_SIGN = 'auth/evartai/sign',
  USERS = 'users',
  USER = 'user',
  TENANT_USERS = 'tenantUsers',
  TENANTS = 'tenants',
  FISH_AGES = 'fishAges',
  FISH_TYPES = 'fishTypes',
  INVITE_USER = 'tenantUsers/invite',
  CREATED_BY = 'createdBy',
  LOCATION = 'locations',
  SIGNATURE_USERS = 'users/signatureUsers',
  ME = 'users/me',
  USERS_BY_TENANT = 'users/byTenant',
  FISH_STOCKING = 'fishStockings',
  FISH_STOCKING_CANCEL = 'fishStockings/cancel',
  FISH_STOCKING_REGISTER = 'fishStockings/register',
  FISH_STOCKING_REVIEW = 'fishStockings/review',
  SETTINGS = 'settings',
  RECENT_LOCATIONS = 'fishStockings/recentLocations',
  EXCEL = 'fishStockings/export',
}

export enum Populations {
  ROLE = 'role',
}

export enum SortFields {
  CREATED_AT = '-createdAt',
  LAST_NAME = 'lastName',
  NAME = 'name',
}

export enum TagColors {
  BLUE = 'blue',
  BROWN = 'brown',
  GREEN = 'green',
  PINK = 'pink',
  VIOLET = 'violet',
  ORANGE = 'orange',
  SKYBLUE = 'skyblue',
  GREY = 'grey',
}

export enum FishOriginTypes {
  GROWN = 'GROWN',
  CAUGHT = 'CAUGHT',
}

export enum FishStockingStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  NOT_FINISHED = 'NOT_FINISHED',
  FINISHED = 'FINISHED',
  INSPECTED = 'INSPECTED',
  CANCELED = 'CANCELED',
}

export enum ServerErrorCodes {
  NOT_FOUND = '404',
  NO_PERMISSION = '401',
}

export enum FilterInputTypes {
  text = 'text',
  date = 'date',
  multiselect = 'multiselect',
  singleSelect = 'singleselect',
  asyncSingleSelect = 'asyncSingleSelect',
  asyncMultiSelect = 'asyncMultiSelect',
}
