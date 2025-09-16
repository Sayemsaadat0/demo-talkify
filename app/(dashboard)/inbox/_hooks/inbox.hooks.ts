/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/api.ts

import {
  CHAT_INBOX_LIST_API,
  JOIN_CHAT_API,
  SEND_TEXT_API,
  SINGLE_CHAT_API,
} from "@/api/api";
import { InboxListResponse } from "../_types/inbox.types";

export async function getInboxList(
  page: number = 1,
  token: string,
  status?: string,
  datetrx?: string
): Promise<InboxListResponse | null> {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (status) {
      params.set('status', status);
    }
    if (datetrx) {
      params.set('datetrx', datetrx);
    }
    const res = await fetch(`${CHAT_INBOX_LIST_API}?${params.toString()}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch inbox list");
    return await res.json();
  } catch (error) {
    console.error("Error fetching inbox list:", error);
    return null;
  }
}

export async function getMessages(
  hash_slug: string,
  token: string
): Promise<any | null> {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const res = await fetch(`${SINGLE_CHAT_API}${hash_slug}`, { headers });
    if (!res.ok) throw new Error("Failed to fetch messages");
    return await res.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null;
  }
}

export async function joinChat(hash_slug: string, token: string) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const res = await fetch(`${JOIN_CHAT_API}${hash_slug}`, { headers });
    if (!res.ok) throw new Error("Failed to join chat");
    return await res.json();
  } catch (error) {
    console.error("Error joining chat:", error);
    return null;
  }
}

export async function sendMessage(
  hash_slug: string,
  message: string,
  token: string
) {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const res = await fetch(`${SEND_TEXT_API}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ hash_slug, message }),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return await res.json();
  } catch (error) {
    console.error("Error sending message:", error);
    return null;
  }
}
