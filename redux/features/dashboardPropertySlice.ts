import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

// Product interface stays the same
interface Product {
  id: number;
  user_id: number;
  property_name: string;
  site_url: string;
  property_id: string;
  image: string | null;
  driver: string | null;
  status: number;
  region: string | null;
  visitor_ip_tracking: number;
  total_incoming_visitors: number;
  report_sent: string;
  created_at: string;
  updated_at: string;
}

interface ProductsState {
  dashboardProperty: Product | null;
  isRefetchProductList?: boolean;
}

const initialState: ProductsState = {
  dashboardProperty: null,
  isRefetchProductList: false,
};

const dashboardPropertysSlice = createSlice({
  name: "dashboardPropertys",
  initialState,
  reducers: {
    setProperty(state, action: PayloadAction<Product>) {
      state.dashboardProperty = action.payload;
    },
    clearProperty(state) {
      state.dashboardProperty = null;
    },
    setUpdateProperty(state, action: PayloadAction<Partial<Product>>) {
      if (state.dashboardProperty) {
        state.dashboardProperty = {
          ...state.dashboardProperty,
          ...action.payload,
        };
      }
    },
    setIsRefetchPropertyList(state) {
      state.isRefetchProductList = true;
    },
    resetIsRefetchPropertyList(state) {
      state.isRefetchProductList = false;
    },
  },
});

export const {
  setProperty,
  clearProperty,
  setIsRefetchPropertyList,
  resetIsRefetchPropertyList,
  setUpdateProperty
} = dashboardPropertysSlice.actions;

export const selectdashboardProperty = (state: RootState) =>
  state.dashboardPropertys.dashboardProperty;

export default dashboardPropertysSlice.reducer;
