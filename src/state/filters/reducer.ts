import { createSlice } from '@reduxjs/toolkit';

interface FiltersState {
  users: any;
  fishStocking: any;
}

const initialState: FiltersState = {
  users: {},
  fishStocking: {},
};

export const Filters = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, users: action.payload };
    },
    setFishStocking: (state, action) => {
      return { ...state, fishStocking: action.payload };
    },
  },
});

export default Filters.reducer;

export const actions = Filters.actions;
