import FishStocking from '../pages/FishStocking';
import FishStockings from '../pages/FishStockings';
import MyProfile from '../pages/MyProfile';
import Profiles from '../pages/Profiles';
import TenantUsers from '../pages/TenantUsers';

export const slugs = {
  profile: '/profilis',
  myProfile: '/mano-profilis',
  profiles: '/profiliai',
  tenantUsers: `/imones_darbuotojai`,
  tenantUser: (id?: string) => `/imones_darbuotojai/${id}`,
  fishStocking: (id?: string) => `/zuvinimai/${id}`,
  fishStockings: `/zuvinimai`,
  newFishStockings: `/zuvinimai/naujas`,
  newTenantUser: `/imones_darbuotojai/naujas`,
  login: `/prisijungimas`,
  cantLogin: '/negalima_jungtis',
};
export const routes = [
  {
    slug: slugs.profiles,
    component: <Profiles />,
  },
  {
    title: 'Įžuvinimų žurnalas',
    slug: slugs.fishStockings,
    component: <FishStockings />,
    menu: true,
  },
  {
    title: 'Įmonės darbuotojai',
    slug: slugs.tenantUsers,
    component: <TenantUsers />,
    tenantOwner: true,
    menu: true,
  },
  {
    title: 'Mano profilis',
    slug: slugs.myProfile,
    component: <MyProfile />,
    menu: true,
  },

  {
    slug: slugs.fishStocking(':id'),
    component: <FishStocking />,
    menu: true,
  },
];
