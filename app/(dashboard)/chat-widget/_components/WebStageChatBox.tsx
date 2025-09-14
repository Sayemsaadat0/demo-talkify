import { Search } from "lucide-react"
import Image from "next/image"

interface WebStageChatBoxProps {
    widget_stage?: "online" | "away";
    heading_text_status: "on" | "off";
    text_content_status: "on" | "off";
    kb_search_status: "on" | "off";
    chat_btn_status: "on" | "off";
    water_mark_show?: "on" | "off";
    heading_text: string;
    text_content: string;
    kb_search: string;
    chat_btn: string;
}

const WebStageChatBox = ({
    widget_stage,
    heading_text_status,
    text_content_status,
    kb_search_status,
    chat_btn_status,
    // water_mark_show = 'on',
    heading_text,
    text_content,
    kb_search,
    chat_btn,
}: WebStageChatBoxProps) => {
    return (
        <div className=" flex justify-start md:items-center  md:justify-center  w-full">
            <div className="w-[320px] min-h-[400px] relative  rounded-2xl overflow-hidden bg-gray-100 shadow-xl border border-gray-200">
                {/* Header */}
                <div className="bg-gradient-to-br relative min-h-56 from-blue-700 to-blue-500 text-white text-center py-6 px-4">
                    <div className="flex flex-col items-center">
                        <div className=" mb-2">
                            <Image
                                src={'/images/icon_logo.webp'}
                                alt="logo"
                                width={100}
                                height={100}
                                className="w-12 h-12"
                            />
                        </div>
                        {/* heading text = heading_text */}
                        {heading_text_status === "on" && (
                            <h2 className="text-2xl font-semibold">{heading_text}</h2>
                        )}
                        {/* text-content = text_content */}
                        {text_content_status === "on" && (
                            <p className="  mt-1">{text_content}</p>
                        )}
                    </div>

                    <div className="absolute  w-[90%] -translate-x-1/2 left-1/2 -bottom-5">
                        <div className="flex relative items-center rounded-lg bg-white overflow-hidden">
                            {widget_stage === 'online' && kb_search_status === "on" && (
                                <input
                                    type="text"
                                    placeholder={kb_search}
                                    className="bg-white border rounded-lg placeholder:text-gray-500 focus:ring-0 flex-1 px-3 py-2 outline-none"
                                />
                            )}
                            {kb_search_status === "on" && (
                                <button
                                    type="button"
                                    className="bg-orange-500 absolute right-[1px] rounded-r-lg hover:bg-orange-600 p-3 flex items-center justify-center"
                                >
                                    <Search className="h-4 w-4 text-white" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {
                    widget_stage === 'online' && <div className="space-y-2 min-h-56 flex mt-5 flex-col justify-between ">
                        <div className="p-4">
                            {chat_btn_status === "on" && (
                                <div className="p-3 rounded-md bg-white">
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-md py-2 text-white font-medium">
                                        {/* chat_btn field */}
                                        {chat_btn}
                                    </button>
                                </div>
                            )}
                        </div>


                        <div className="bg-white p-4 space-y-3">
                            <div className="text-xs text-gray-500 flex items-center justify-center bg-white gap-2 text-center t pt-2">
                                <Image
                                    src={'/images/icon_logo.webp'}
                                    alt="logo"
                                    width={32}
                                    height={32}
                                    className="w-5 h-5"
                                />
                                <span className="inline-flex items-center gap-1 ">
                                    Add <span className="font-medium">Talkify</span> to your site
                                </span>
                            </div>

                            <div className=" h-10 border w-full rounded-md">
                            </div>
                        </div>
                    </div>
                }


            </div>
        </div>
    )
}
export default WebStageChatBox