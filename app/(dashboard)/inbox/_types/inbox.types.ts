
// Type definitions for inbox list data
export interface InboxChatItemType {
    id: number;
    property_id: number;
    user_id: number | null;
    name: string;
    contact: string;
    visitor: string;
    visitor_ip: string;
    visitor_country: string;
    visitor_device: string;
    visitor_browser: string;
    visitor_os: string;
    navigator_title: string | null;
    last_visited_link: string;
    hash_slug: string;
    total_message: number;
    total_visit: number;
    status: number;
    monitoring_time: string;
    mouse_over_action: string;
    created_at: string;
    updated_at: string;
    chat_details_count: number;
    details_route: string;
  }
  
  export interface InboxPaginationLink {
    url: string | null;
    label: string;
    active: boolean;
  }
  
  export interface InboxPagination {
    current_page: number;
    data: InboxChatItemType[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: InboxPaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  }
  
  export interface InboxListData {
    chats: InboxPagination;
    totalChats: number;
  }
  
  export interface InboxListResponse {
    status: boolean;
    message: string;
    data: InboxListData;
  }
  
  
  
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  