"use client";

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CHAT_WIDGET_API } from "@/api/api";

// types/widget.ts
export type WidgetAppearanceType = {
    header_color: string | null;
    header_text_color: string | null;
    agent_message_color: string | null;
    agent_text_color: string | null;
    visitor_message_color: string | null;
    visitor_text_color: string | null;
    position: string | null;
    home_first_text: string | null;
    home_first_text_color: string | null;
    home_second_text: string | null;
    home_second_text_color: string | null;
    home_bg_color: string | null;
    use_home_bg_image: string | null;
    widget_logo: string | null;
    widget_icon: string | null;
    home_bg_img: string | null;
};

export type WidgetContentType = {
    heading_text: string | null;
    text_content: string | null;
    kb_search: string | null;
    chat_btn: string | null;
    heading_text_status: string | null;
    text_content_status: string | null;
    kb_search_status: string | null;
    chat_btn_status: string | null;
    water_mark_show: string | null;
};

// Lead settings types based on API structure
export type LeadNameSettings = {
    label_name: string;
    name_active_status: number;
    name_required_status: number;
};

export type LeadEmailSettings = {
    label_name: string;
    email_active_status: number;
    email_required_status: number;
};

export type LeadPhoneSettings = {
    label_name: string;
    phone_active_status: number;
    phone_required_status: number;
};

export type LeadAddressSettings = {
    label_name: string;
    address_active_status: number;
    address_required_status: number;
};

export type LeadSettings = {
    name: LeadNameSettings;
    email: LeadEmailSettings;
    phone: LeadPhoneSettings;
    address: LeadAddressSettings;
};

export type WidgetType = {
    id: number;
    user_id: number;
    property_id: number;
    widget_name: string;
    widget_status: number;
    widget_id: string;
    domain_restriction: number;
    domain_restriction_for: string;
    domain_list: string | null;
    country_restriction: number;
    country_restriction_for: string;
    country_list: string | null;
    platform_restriction: number;
    platform_restriction_for: string | null;
    platform_list: string | null;
    webhook_status: string | null;
    whatsapp_webhook_url: string | null;
    facebook_webhook_url: string | null;
    telegram_webhook_url: string | null;
    discord_webhook_url: string | null;
    widget_appearance: WidgetAppearanceType;
    widget_stage: string | null;
    widget_content: WidgetContentType;
    lead_status: number;
    lead_settings: LeadSettings | null;
    help_status: number;
    created_at: string;
    updated_at: string;
};

export type PropertyType = {
    id: number;
    user_id: number;
    property_name: string;
    site_url: string;
    property_id: string;
    image: string | null;
    driver: string;
    status: number;
    region: string | null;
    visitor_ip_tracking: number;
    total_incoming_visitors: number;
    report_sent: string;
    created_at: string;
    updated_at: string;
};

export type WidgetApiResponseType = {
    status: boolean;
    message: string;
    data: {
        property: PropertyType;
        widget: WidgetType;
    };
};



export const useChatGetWidget = () => {
    const [data, setData] = useState<WidgetApiResponseType | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = useSelector((state: RootState) => state?.auth?.token);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);


            const response = await fetch(CHAT_WIDGET_API, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Application: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json: WidgetApiResponseType = await response.json();
            setData(json);
        } catch (err) {
            console.error("Error fetching widget", err);
            setError("Failed to fetch widget");
            setData(undefined);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [fetchData, token]);

    const refetch = async () => {
        setLoading(true);
        await fetchData();
    };

    return { data, loading, error, refetch };
};