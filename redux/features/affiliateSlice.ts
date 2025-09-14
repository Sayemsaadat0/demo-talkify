import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  referralCode: "",
};

const affiliateSlice = createSlice({
  name: "affiliate",
  initialState,
  reducers: {
    setReferralCode: (state, action) => {
      state.referralCode = action.payload; // Directly assign the string
    },
    clearReferralCode: (state) => {
      state.referralCode = "";
    },
  },
});

export const { setReferralCode, clearReferralCode } = affiliateSlice.actions;

export default affiliateSlice.reducer;
