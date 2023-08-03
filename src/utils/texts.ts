import { FishStockingStatus, ServerErrors } from "./constants";

export const validationTexts: any = {
  formFillError: "Neteisingai užpildyta forma",
  offline: "Šiuo metu esate neprisijungęs",
  requireMap: "Privalote pasirinkti vietą žemėlapyje",
  requirePhotos: "Privalote įkelti nuotrauką",
  userDeniedLocation: "Turite leisti nustatyti jūsų buvimo vietą",
  requireSpeciesType: "Privalote pasirinkti bent vieną rūšių tipą",
  requireText: "Privalomas laukelis",
  requireSelect: "Privalote pasirinkti",
  badEmailFormat: "Blogas el. pašto adresas",
  badPhoneFormat: "Blogai įvestas telefono numeris",
  tooFrequentRequest: "Nepavyko, per dažna užklausa prašome pabandyti veliau ",
  passwordsDoNotMatch: "Slaptažodžiai nesutampa",
  error: "Įvyko nenumatyta klaida, prašome pabandyti vėliau",
  validFirstName: "Įveskite taisyklingą vardą",
  validLastName: "Įveskite taisyklingą pavardę",
  [ServerErrors.WRONG_PASSWORD]: "Blogas elektroninis paštas arba slaptažodis",
  [ServerErrors.USER_NOT_FOUND]: "Naudotojo su tokiu el. paštu nėra",
  badFileTypes: "Blogi failų tipai",
  fileSizesExceeded: "Viršyti failų dydžiai",
  personalCode: "Neteisingas asmens kodo formatas",
  positiveNumber: "Reikšmė turi būti didesnė už nulį",
  requireFiles: "Privalote įkelti dokumentus",
  atLeastOneColumn: "Turi būti pasirinktas bent vienas stulpelis"
};

export const inputLabels = {
  selectFromMap: "pasirinkti iš žemėlapio",
  signature: "Parašas",
  currentLocation: "dabartinė vieta",
  password: "Slaptažodis",
  chooseOption: "Pasirinkite",
  role: "Rolė",
  personalCode: "Asmens kodas",
  uploadPhotos: "Įkelti nuotraukas",
  phone: "Telefono numeris",
  lastName: "Pavardė",
  firstName: "Vardas",
  email: "Elektroninis paštas",
  noOptions: "Nėra pasirinkimų",
  location: "Žuvinimo vieta"
};

export const buttonLabels = {
  forgotPassword: "Pamiršau slaptažodį",
  login: "Prisijungti",
  or: "arba",
  eLogin: "Prisijungti per el. valdžios vartus"
};

export const formLabels = {
  selectProfile: "Pasirinkite paskyrą",
  stockingCustomer: "ĮŽUVINIMO UŽSAKOVAS",
  stockingPerform: "ĮŽUVINIMĄ ATLIKS",
  login: "Prisijungti",
  members: "nariai",
  infoAboutFishes: "INFORMACIJA APIE ŽUVIS",
  inActiveProfile: "Anketa neaktyvi"
};

export const descriptions = {
  email:
    "Nurodytu el. pašto adresu darbuotojas gaus pakvietimą prisijungti prie įmonės.",
  updateUserInfo: "Atnaujinti darbuotojo informaciją",
  inviteUser: "Pakviesti prisijungti prie įmonės",
  myProfile: "Mano profilis",
  cantLoginOwner:
    "Jeigu esate įmonės vadovas arba privatus žuvinimą vykdantis asmuo, susisiekite su Aplinkos apsaugos departamentu",
  cantLoginTenantUser:
    "Jeigu jungiatės kaip įmonės darbuotojas, susisiekite su savo įmonės vadovu",
  stockingsNotFound: "Nėra sukurtų įžuvinimų",
  stockingsNotFoundbyFilter: "Neradome įžuvinimų pagal pasirinktus filtrus"
};

export const buttonsTitles = {
  select: "Pasirinkti",
  excel: "Atsisiųsti duomenis",
  yes: "Taip",
  no: "Ne",
  add: "Pridėti",
  aadEmail: "prieiga@aad.am.lt",
  cancelFishStcoking: "Atšaukti įžuvinimą",
  cancel: "Atšaukti",
  addSignature: "Pridėti parašą",
  addFish: "+ Pridėti žuvį",
  download: "Atsisiųsti",
  fillOutRequest: "Pildyti prašymą",
  newExcerpt: "Naujas išrašas",
  inviteTenantUser: "Pakviesti darbuotoją",
  checkData: "Naujas prašymas",
  columns: "Stulpeliai",
  getData: "Noriu gauti duomenis",
  addNew: "+ Pridėti naują",
  newClass: "Nauja klasė",
  newForm: "Nauja stebėjimo anketa",
  logout: "Atsijungti",
  new: "+Naujas",
  newFishStocking: "Naujas įžuvinimas",
  newUser: "Naujas naudotojas",
  save: "Išsaugoti",
  submit: "Pateikti",
  back: "Grįžti atgal",
  generate: "Generuoti",
  approve: "Tvirtinti",
  return: "Grąžinti taisymui",
  reject: "Atmesti",
  importData: "Įkelti duomenis",
  templateFile: "Šablono failas",
  clearAll: "Išvalyti visus",
  filter: "Filtruoti",
  repeat: "Kartoti",
  login: "Prisijungti",
  eGates: "Prisijungti per el. valdžios vartus",
  edit: "Atnaujinti",
  view: "Peržiūrėti",
  removeTenantUser: "Pašalinti darbuotoją",
  sarasas: "Sąrašas",
  zemelapis: "Žemėlapis",
  padalintas: "Padalintas vaizdas",
  newTenant: "Nauja įmonė",
  newFish: "Nauja žuvis",
  delete: "Ištrinti",
  clear: "Išvalyti"
};

export const toasts = {
  profileUpdated: "Profilis atnaujintas"
};

const mapsHost = process.env.REACT_APP_MAPS_HOST || "https://dev.maps.biip.lt";
export const Url = {
  DRAW: `${mapsHost}/zuvinimas/draw`,
  FISH_STOCKING: `${mapsHost}/zuvinimas`
};
export const queryStrings = {
  draw: "?basemap_selector=true&draw_edit_prop=true&draw_geom=[Point]&draw=true&draw_panel=true&autosave=true"
};

export const fishStockingsFiltersLabels = {
  locationName: "Telkinio Pavadinimas",
  municipality: "Savivaldybė",
  fishes: "Žuvų rūšys",
  status: "Būsena",
  dateFrom: "Data nuo",
  dateTo: "Data iki"
};

export const fishStockingStatusLabels = {
  [FishStockingStatus.UPCOMING]: "Nauja",
  [FishStockingStatus.ONGOING]: "Įžuvinama",
  [FishStockingStatus.FINISHED]: "Įžuvinta",
  [FishStockingStatus.NOT_FINISHED]: "Neužbaigta",
  [FishStockingStatus.INSPECTED]: "Patikrinta",
  [FishStockingStatus.CANCELED]: "Atšaukta"
};
