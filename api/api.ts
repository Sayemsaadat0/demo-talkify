// Get API URL with fallback
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://staging.talkify.pro";

//auth
export const LOGIN_API = `${API_BASE_URL}/api/frontend/login`;
export const ME_API = `${API_BASE_URL}/api/frontend/me`;
export const REGISTER_API = `${API_BASE_URL}/api/frontend/register`;
export const LOGOUT_API = `${API_BASE_URL}/api/frontend/logout`;
export const AUTH_REDIRECT = `${API_BASE_URL}/auth/redirect`;
export const LOGIN_REGISTRATION_DATA_API = `${API_BASE_URL}/api/frontend/show-registration-form`;
export const PLANS_API = `${API_BASE_URL}/api/frontend/subscription/plans`;
export const VERIFICATION_OTP_API = `${API_BASE_URL}/api/frontend/verification`;
export const RESEND_OTP_API = `${API_BASE_URL}/api/frontend/resendCode`;
export const SEND_CODE_FORGOT_PASSWORD_API = `${API_BASE_URL}/api/frontend/forgot-password`;
export const FORGOT_PASSWORD_API = `${API_BASE_URL}/api/frontend/reset-password`;
export const CHANGE_PASSWORD_CODE_API = `${API_BASE_URL}/api/frontend/get-change-password-code`;
export const CHANGE_PASSWORD_API = `${API_BASE_URL}/api/frontend/change-password`;

//purchase api
export const PLAN_CHECK_USER_API = `${API_BASE_URL}/api/frontend/subscription-plan/check-user`;
export const PURCHASE_API = `${API_BASE_URL}/api/frontend/subscription-plan/purchase`;
export const PLAN_DETAILS_API = `${API_BASE_URL}/api/frontend/subscription/plan`;
export const DISCOUNT_TIME_API = `${API_BASE_URL}/api/frontend/subscription/discount-time`;
export const COUPON_API = `${API_BASE_URL}/api/frontend/subscription-plan/coupon`;
// /api/frontend/subscription-plan/cancel
export const CANCEL_PLAN_API = `${API_BASE_URL}/api/frontend/subscription-plan/cancel`;
export const PLAN_PERIOd_WISE_API = `${API_BASE_URL}/api/frontend/subscription-plan/period-wise`;

//single page api
export const CONTACT_FORM = `${API_BASE_URL}/api/frontend/contact`;
export const CONTACT_FORM_SUBMIT = `${API_BASE_URL}/api/frontend/contact/send`;
export const BLOG_LIST_API = `${API_BASE_URL}/api/frontend/blogs`;
export const BLOG_DETAILS_API = `${API_BASE_URL}/api/frontend/blog`;
export const HELP_CATEGORY_API = `${API_BASE_URL}/api/frontend/help-category`;
export const HELP_ARTICLE_API = `${API_BASE_URL}/api/frontend/help`;

// affiliate Api
export const AFFILIATE_PLAN_LIST_API = `${API_BASE_URL}/api/frontend/subscription/ref/plans-list`;
export const AFFILIATE_PLAN_LIST_API_DETAILS_API = `${API_BASE_URL}/api/frontend/subscription/ref/plan/`;
export const SOCIAL_AUTH_API = `${API_BASE_URL}/api/social-auth/`;
// /api/frontend/affiliate/gateways
export const AFFILIATE_COMMISION_DETAILS_API = `${API_BASE_URL}/api/frontend/affiliate/transaction/`;
export const AFFILIATE_COMMISION_API = `${API_BASE_URL}/api/frontend/affiliate/transactions`;
export const AFFILIATE_BALANCE_CHECK_API = `${API_BASE_URL}/api/frontend/affiliate/balance-check`;
export const AFFILIATE_WITHDRAW_API = `${API_BASE_URL}/api/frontend/affiliate/withdraw`;

export const AFFILIATE_GATEWAYS_LIST_API = `${API_BASE_URL}/api/frontend/affiliate/gateways/`;
export const AFFILIATE_GATEWAYS_DELETE_API = `${API_BASE_URL}/api/frontend/affiliate/gateway/`;
export const AFFILIATE_GATEWAY_STORE_API = `${API_BASE_URL}/api/frontend/affiliate/gateway-store`;
export const AFFILIATE_GATEWAY_UPDATE_API = `${API_BASE_URL}/api/frontend/affiliate/gateway-update/`;

export const AFFILIATE_USER_LIST_API = `${API_BASE_URL}/api/frontend/affiliate/user-list`;

// Dashboard Api
export const CREATE_PROPERTY_API = `${API_BASE_URL}/api/frontend/merchant/new-property/create`;
export const GET_PROPERTY_API = `${API_BASE_URL}/api/frontend/merchant/new-property/list`;
export const GET_PROPERTY_DETAILS_API = `${API_BASE_URL}/api/frontend/merchant/property/overview/`;
export const UPDATE_PROPERTY_API = `${API_BASE_URL}/api/frontend/merchant/property/update/`;
export const DELETE_PROPERTY_API = `${API_BASE_URL}/api/frontend/merchant/property/delete/`;
export const PROPERTY_ACTIVE_API = `${API_BASE_URL}/api/frontend/merchant/property/active`;
// property member
export const PROPERTY_MEMBER_GET_API = `${API_BASE_URL}/api/frontend/merchant/property-members`;
export const PROPERTY_MEMBER_INVITE_API = `${API_BASE_URL}/api/frontend/merchant/property-members/invite`;
export const PROPERTY_MEMBER_STATUS_API = `${API_BASE_URL}/api/frontend/merchant/property-members/status-change/`;
export const PROPERTY_MEMBER_RESEND_INVITATION_API = `${API_BASE_URL}/api/frontend/merchant/property-members/resend-invitation`;

export const CONTACT_LIST_API = `${API_BASE_URL}/api/frontend/merchant/contact-list`;
export const CONTACT_LIST_API_CREATE = `${API_BASE_URL}/api/frontend/merchant/contact/add`;
export const CONTACT_LIST_DELETE_API = `${API_BASE_URL}/api/frontend/merchant/contact/delete/`;

// Leads API
export const USER_LEADS_GET_API = `${API_BASE_URL}/api/frontend/merchant/lead-list`;

// Visitor API
export const VISITOR_LIST_API = `${API_BASE_URL}/api/frontend/merchant/visitor-list`;
export const VISITOR_DELETE_API = `${API_BASE_URL}/api/frontend/merchant/visitor/delete/`;
// note
export const NOTE_GET_API = `${API_BASE_URL}/api/frontend/merchant/note-list`;
export const NOTE_CREATE_API = `${API_BASE_URL}/api/frontend/merchant/note/create`;
export const NOTE_DELETE_API = `${API_BASE_URL}/api/frontend/merchant/note/delete/`;
export const NOTE_EDIT_API = `${API_BASE_URL}/api/frontend/merchant/note/edit/`;
// note
export const SHORTCUT_GET_API = `${API_BASE_URL}/api/frontend/merchant/shortcut-list`;
export const SHORTCUT_CREATE_API = `${API_BASE_URL}/api/frontend/merchant/shortcut/create`;
export const SHORTCUT_DELETE_API = `${API_BASE_URL}/api/frontend/merchant/shortcut/delete/`;
// / role
export const ROLE_GET_API = `${API_BASE_URL}/api/frontend/merchant/role-list`;
export const ROLE_CREATE_API = `${API_BASE_URL}/api/frontend/merchant/role/create`;
export const ROLE_UPDATE_API = `${API_BASE_URL}/api/frontend/merchant/role/update/`;

// knowledgebase-category
export const KNOWLEDGEBASE_CATEGORY_GET_API = `${API_BASE_URL}/api/frontend/merchant/knowledge-category-list`;
export const KNOWLEDGEBASE_CATEGORY_CREATE_API = `${API_BASE_URL}/api/frontend/merchant/knowledge-category/create`;
export const KNOWLEDGEBASE_CATEGORY_EDIT_API = `${API_BASE_URL}/api/frontend/merchant/knowledge-category/edit/`;
export const KNOWLEDGEBASE_CATEGORY_DELETE_API = `${API_BASE_URL}/api/frontend/merchant/knowledge-category/delete/`;

// knowledgebase
export const KNOWLEDGEBASE_GET_API = `${API_BASE_URL}/api/frontend/merchant/knowledge-list`;
export const KNOWLEDGEBASE_CREATE_API = `${API_BASE_URL}/api/frontend/merchant/knowledge/create`;
export const KNOWLEDGEBASE_EDIT_API = `${API_BASE_URL}/api/frontend/merchant/knowledge/edit/`;
export const KNOWLEDGEBASE_DELETE_API = `${API_BASE_URL}/api/frontend/merchant/knowledge/delete/`;
export const KNOWLEDGEBASE_FEATURED_API = `${API_BASE_URL}/api/frontend/merchant/knowledge/toggle-featured`;
export const KNOWLEDGEBASE_STATUS_API = `${API_BASE_URL}/api/frontend/merchant/knowledge/toggle-status`;

// Dashboard Statistics APIs
export const GET_RECORDS_API = `${API_BASE_URL}/api/frontend/merchant/getRecords`;
export const CHART_INBOX_MOVEMENTS_API = `${API_BASE_URL}/api/frontend/merchant/chartInboxMovements`;
export const CHART_INBOX_STATEMENT_API = `${API_BASE_URL}/api/frontend/merchant/chartInboxStatement`;
export const REMAIN_PLAN_API = `${API_BASE_URL}/api/frontend/merchant/remainPlan`;
export const GET_MONITORS_API = `${API_BASE_URL}/api/frontend/merchant/getMonitors`;
export const MARCHANT_TRANSACTION_API = `${API_BASE_URL}/api/frontend/merchant/transaction`;

// Transactions API
export const TRANSACTIONS_API = `${API_BASE_URL}/api/frontend/merchant/transactions`;

// home statistics api
// chat widget api
export const CHAT_WIDGET_API = `${API_BASE_URL}/api/frontend/merchant/chat-widget`;
export const CHAT_WIDGET_UPDATE_API = `${API_BASE_URL}/api/frontend/merchant/chat-widget/save`;
export const CHAT_WIDGET_RESET_API = `${API_BASE_URL}/api/frontend/merchant/chat-widget/reset`;
export const CHAT_WIDGET_CONTENT_UPDATE_SAVE_API = `${API_BASE_URL}/api/frontend/merchant/chat-widget/content/configure`;
export const CHAT_WIDGET_CONTENT_UPDATE_TOGGLE_API = `${API_BASE_URL}/api/frontend/merchant/chat-widget/content/update`;
export const WIDGET_APPEARANCE_API = `${API_BASE_URL}/api/frontend/merchant/chat-widget/appearance/configure`;

// domain configure
export const DOMAIN_CONFIGURE_API = `${API_BASE_URL}/api/frontend/merchant/chat-widget/domain/configure`;
export const PLATFORM_CONFIGURE_API = `${API_BASE_URL}/api/frontend/merchant/chat-widget/platform/configure`;
export const LEAD_CONFIGURE_API = `${API_BASE_URL}/api/frontend/merchant/chat-widget/lead/configure`;
export const COUNTRY_CONFIGURE_API = `${API_BASE_URL}/api/frontend/merchant/chat-widget/country/configure`;
export const WEBHOOK_CONFIGURE_API = `${API_BASE_URL}/api/frontend/merchant/chat-widget/webhook/configure`;
// profile/security

// inbox api
export const CHAT_INBOX_LIST_API = `${API_BASE_URL}/api/frontend/merchant/inbox-list`;
export const DELETE_CHAT_INBOX_LIST_API = `${API_BASE_URL}/api/frontend/merchant/inbox-list/delete/`;
export const JOIN_CHAT_API = `${API_BASE_URL}/api/frontend/merchant/chat/join-chat/`;
export const END_CHAT_API = `${API_BASE_URL}/api/frontend/merchant/chat/end-chat/`;
export const SINGLE_CHAT_API = `${API_BASE_URL}/api/frontend/merchant/inbox-list/message-view/`;
export const SEND_TEXT_API = `${API_BASE_URL}/api/frontend/merchant/chat/new-message`;

