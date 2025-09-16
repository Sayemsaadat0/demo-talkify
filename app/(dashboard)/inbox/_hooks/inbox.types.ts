/* eslint-disable @typescript-eslint/no-explicit-any */

  
  
  export type ChatDetailsType = {
    id: number;
    property_id: number;
    chat_id: number;
    name: string;
    contact: string | null;
    message: string;
    link: string | null;
    file: string | null;
    status: number;
    type: string;
    created_at: string;
    updated_at: string;
    file_count: number;
    file_list: any[]; // You can replace `any` with a more specific type if file structure is known
  };
  
  type Chat = {
    id: number;
    property_id: number;
    user_id: number;
    name: string;
    contact: string;
    visitor: string;
    visitor_ip: string;
    visitor_country: string;
    visitor_device: string;
    visitor_browser: string;
    visitor_os: string;
    navigator_title: string;
    last_visited_link: string;
    hash_slug: string;
    total_message: number;
    total_visit: number;
    status: number;
    monitoring_time: string;
    mouse_over_action: string | null;
    created_at: string;
    updated_at: string;
    details_route: string;
    chat_details: ChatDetailsType[];
  };
  
  export type InboxListMessageViewResponse = {
    status: boolean;
    message: string;
    data: {
      chat: Chat;
    };
  };
  