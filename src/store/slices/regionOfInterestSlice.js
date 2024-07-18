import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  format: "all-formats",
  region: {
    left: 10,
    width: 80,
    top: 12,
    height: 30,
  },
}

export const regionOfInterestSlice = createSlice({
  name: 'regionOfInterest',
  initialState,
  reducers: {
    setRegion: (state, action) => {
      state.format = action.payload.format;
      state.region = action.payload.region;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setRegion } = regionOfInterestSlice.actions

export default regionOfInterestSlice.reducer