/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { logout } from "@/redux/features/authSlice";
import { store } from "@/redux/store";

export function handleApiError(error: any, message?: string) {
  // Check for 401 or token expired
  if (
    error?.status === 401 ||
    error?.message?.toLowerCase().includes("token expired") ||
    error?.message?.toLowerCase().includes("unauthorized")
  ) {
    store.dispatch(logout());
    if (typeof window !== "undefined") {
      window.location.href = "/login?expired=1";
    }
    return true;
  }
  return false;
}
