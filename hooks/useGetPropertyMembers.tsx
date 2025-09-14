'use client';
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { PROPERTY_MEMBER_GET_API } from "@/api/api"; // define your API URL

// Individual Role type
export type MemberRoleType = {
  id: number;
  role_name: string;
};

// Individual role details inside member
export type RoleDetailType = {
  id: number;
  user_id: number;
  property_id: number;
  role_name: string;
  permission: string[];
  status: number;
  created_at: string;
  updated_at: string;
};

// Individual property member
export type PropertyMemberType = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_id: number;
  property_id: number;
  role_id: number;
  is_owner: 0 | 1;
  invitation_stage: number;
  status: number;
  send_at: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  role: RoleDetailType;
};

// Pagination links
export type PaginationLinkType = {
  url: string | null;
  label: string;
  active: boolean;
};

// Paginated members structure
export type PaginatedPropertyMembers = {
  current_page: number;
  data: PropertyMemberType[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLinkType[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
};

// Full API response type
export type PropertyMemberApiResponse = {
  status: boolean;
  message: string;
  data: {
    propertyMembers: PaginatedPropertyMembers;
    roles: MemberRoleType[];
  };
};

export const useGetPropertyMembers = (page: number) => {
  const [data, setData] = useState<PaginatedPropertyMembers | undefined>();
  const [roles, setRoles] = useState<MemberRoleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.auth.token);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `${PROPERTY_MEMBER_GET_API}?page=${page}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const json: PropertyMemberApiResponse = await response.json();
      setData(json.data.propertyMembers);
      setRoles(json.data.roles);
    } catch (err) {
      console.error("Error fetching property members", err);
      setError("Failed to fetch property members");
      setData(undefined);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => {
    if (token) fetchData();
  }, [fetchData, token]);

  const refetch = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500)); // optional small delay
    await fetchData();
  };

  return { data, roles, loading, error, refetch };
};
