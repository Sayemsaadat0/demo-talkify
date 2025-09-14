import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { User } from "@/types/user";
export interface ActivePlan {
  plan_id: number;
  plan_name: string;
  currency: string;
  price: number;
  discount_amount: number;
  discounted_price: number;
  payment_status: number;
  payment_frequency: string;
  number_of_property: number;
  per_property_member: number;
  number_of_visitor: number;
  number_of_kb: number;
  message_store_days: number;
  type: string;
  unlimited_section: {
    property_unlimited: string;
    member_unlimited: string;
    visitor_unlimited: string;
    kb_unlimited: string;
    message_store_unlimited: string;
  };
  subs_expired_at: string;
  status: number;
}

export interface ActiveProperty {
  id: number;
  user_id: number;
  property_name: string;
  site_url: string;
  property_id: string;
  image: string;
  driver: string;
  status: number;
  region: string;
  visitor_ip_tracking: number;
  total_incoming_visitors: number;
  report_sent: string;
  created_at: string;
  updated_at: string;
}

export interface UserType {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  balance: number;
  active_property_id: number;
  referral_id: number | null;
  language_id: number;
  email: string;
  country_code: string;
  country: string;
  phone_code: string;
  phone: string | null;
  image: string | null;
  image_driver: string | null;
  state: string | null;
  city: string | null;
  zip_code: string | null;
  address_one: string | null;
  address_two: string | null;
  provider: string | null;
  provider_id: string | null;
  status: number;
  identity_verify: number;
  address_verify: number;
  two_fa: number;
  two_fa_verify: number;
  two_fa_code: string | null;
  email_verification: number;
  sms_verification: number;
  verify_code: string | null;
  sent_at: string | null;
  last_login: string;
  last_seen: string;
  time_zone: string | null;
  github_id: string | null;
  google_id: string | null;
  facebook_id: string | null;
  linkedin_id: string | null;
  email_verified_at: string | null;
  deleted_at: string | null;
  timezone: string | null;
  plan_id: number;
  created_at: string;
  updated_at: string;
  permissions: string[];
  active_plan: ActivePlan;
  "last-seen-activity": boolean;
  fullname: string;
  active_property: ActiveProperty;
}

export interface AuthState {
  user: UserType | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: UserType | null; token?: string | null }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token || null;
      state.isAuthenticated = !!action.payload.user;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: UserType; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    registerSuccess: (
      state,
      action: PayloadAction<{ user: UserType; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const {
  setUser,
  loginSuccess,
  registerSuccess,
  logout,
  setIsAuthenticated,
} = authSlice.actions;

export default authSlice.reducer;
