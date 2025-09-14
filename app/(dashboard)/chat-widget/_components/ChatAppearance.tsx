"use client";

import Image from "next/image";
import React from "react";

type ChatAppearanceProps = {
  header_color: string;
  header_text_color: string;
  agent_message_color: string;
  agent_text_color: string;
  visitor_message_color: string;
  visitor_text_color: string;
  home_bg_color: string;
  use_home_bg_image: boolean;
  home_bg_image_url?: string | null;
};

export default function ChatAppearance({
  header_color,
  header_text_color,
  agent_message_color,
  agent_text_color,
  visitor_message_color,
  visitor_text_color,
  home_bg_color,
  use_home_bg_image,
  home_bg_image_url,
}: ChatAppearanceProps) {
  const messagesStyle: React.CSSProperties = {
    backgroundColor: home_bg_color,
    backgroundImage:
      use_home_bg_image && home_bg_image_url
        ? `url(${home_bg_image_url})`
        : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div className="flex flex-col bg-gray-200 h-[500px] max-w-[350px] mx-auto border rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div
        className="px-4 relative py-3 flex items-center justify-between"
        style={{ backgroundColor: header_color, color: header_text_color }}
      >
        <span className="font-semibold">Chat</span>
        <button className="transition-colors" style={{ color: header_text_color }}>
          ✕
        </button>

      </div> 

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scroll p-4 space-y-3" style={messagesStyle}>
        {/* Assistant message */}
        <div className="flex justify-start">
          <div
            className="max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap rounded-bl-none shadow-sm"
            style={{ backgroundColor: agent_message_color, color: agent_text_color }}
          >
            Lorem ipsum dolor sit amet.
          </div>
        </div>

        {/* User message */}
        <div className="flex justify-end">
          <div
            className="max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap rounded-br-none"
            style={{ backgroundColor: visitor_message_color, color: visitor_text_color }}
          >
            Lorem ipsum dolor sit amet.
          </div>
        </div>

        {/* Assistant message */}
        <div className="flex justify-start">
          <div
            className="max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap rounded-bl-none shadow-sm"
            style={{ backgroundColor: agent_message_color, color: agent_text_color }}
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere, sunt.
          </div>
        </div>

        {/* User message */}
        <div className="flex justify-end">
          <div
            className="max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap rounded-br-none"
            style={{ backgroundColor: visitor_message_color, color: visitor_text_color }}
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere, sunt.
          </div>
        </div>

        {/* Assistant message */}
        <div className="flex justify-start">
          <div
            className="max-w-[80%] px-4 py-2 rounded-lg whitespace-pre-wrap rounded-bl-none shadow-sm"
            style={{ backgroundColor: agent_message_color, color: agent_text_color }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, laborum, dicta fugiat debitis.
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white p-4 space-y-3 border-t">
        <div className="text-xs text-gray-500 flex items-center justify-center bg-white gap-2 text-center t pt-2">
          <Image
            src={"/images/icon_logo.webp"}
            alt="logo"
            width={32}
            height={32}
            className="w-5 h-5"
          />
          <span className="inline-flex items-center gap-1 ">
            Add <span className="font-medium">Talkify</span> to your site
          </span>
        </div>
      </div>
    </div>
  );
}