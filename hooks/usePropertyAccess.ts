import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

/**
 * Short hook to check if user has property access
 * @returns boolean indicating if user has active property
 */
export function usePropertyAccess() {
  const user = useSelector((state: RootState) => state.auth.user);
  return !!user?.active_property_id;
}
