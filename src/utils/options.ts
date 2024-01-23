import { FishOriginTypes } from './constants';

export const fishOriginOptions = [
  {
    value: FishOriginTypes.GROWN,
    label: 'Užaugintos žuvivaisos įmonėje',
  },
  {
    label: 'Sugautos vandens telkinyje',
    value: FishOriginTypes.CAUGHT,
  },
];
