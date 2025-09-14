/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { WidgetApiResponseType } from "@/hooks/useGetChatWidget";
import { COUNTRY_CONFIGURE_API } from "@/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { useGetCountry } from "@/hooks/useGetCountry";

interface CountryConfigureProps {
    data: WidgetApiResponseType;
}
// const COLORS = [
//     "#FF6B6B", // red
//     "#6BCB77", // green
//     "#4D96FF", // blue
//     "#FFD93D", // yellow
//     "#845EC2", // purple
//     "#FF9671", // orange
//     "#2C73D2", // dark blue
//     "#008F7A", // teal
// ];
// const getColorForCountry = (country: string) => {
//     let hash = 0;
//     for (let i = 0; i < country.length; i++) {
//         hash = country.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     return COLORS[Math.abs(hash) % COLORS.length];
// };


type OptionType = { value: string; label: string };

export default function CountryConfigure({ data }: CountryConfigureProps) {
    const [restrictionFor, setRestrictionFor] = useState<"show" | "hide">("show");
    const [countries, setCountries] = useState<OptionType[]>([]);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state: RootState) => state?.auth?.token);

    const { data: countryData } = useGetCountry();

    // Convert array of objects -> react-select options
    const toOptions = (list: any[] = []): OptionType[] =>
        list.map((c) => ({
            value: c.name, // store name only
            label: c.name, // display name only
        }));

    useEffect(() => {
        const widget = data?.data?.widget as any;
        if (!widget) return;

        setRestrictionFor(widget.country_restriction_for === "hide" ? "hide" : "show");

        if (widget?.country_list && Array.isArray(widget.country_list)) {
            setCountries(
                widget.country_list.map((c: string) => ({
                    value: c,
                    label: c,
                }))
            );
        }


    }, [data]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            country_restriction: restrictionFor,
            country_name: countries.map((opt) => opt.value),
        };

        fetch(COUNTRY_CONFIGURE_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Application: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        })
            .then(async (res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                toast.success(json.message);
            })
            .catch((err) => {
                console.error("Country Restriction Save Failed:", err);
            })
            .finally(() => setLoading(false));
    };

    // custom color
    // const customStyles = {
    //     multiValue: (styles: any, { data }: any) => {
    //         const color = getColorForCountry(data.value);
    //         return {
    //             ...styles,
    //             backgroundColor: color,
    //             color: "white",
    //             borderRadius: "8px",
    //             padding: "0 4px",
    //         };
    //     },
    //     multiValueLabel: (styles: any) => ({
    //         ...styles,
    //         color: "white",
    //         fontWeight: 500,
    //     }),
    //     multiValueRemove: (styles: any) => ({
    //         ...styles,
    //         color: "white",
    //         ":hover": {
    //             backgroundColor: "rgba(0,0,0,0.2)",
    //             color: "white",
    //         },
    //     }),
    // };



    return (
        <div className="max-w-md">
            <h2 className="text-xl font-semibold mb-4">Country Restriction</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Mode */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-800">Restriction mode</p>
                    <div className="flex gap-6 text-sm">
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="radio"
                                name="country_restriction_for"
                                value="show"
                                checked={restrictionFor === "show"}
                                onChange={() => setRestrictionFor("show")}
                                className="h-4 w-4"
                            />
                            Show only listed countries
                        </label>
                        <label className="inline-flex items-center gap-2">
                            <input
                                type="radio"
                                name="country_restriction_for"
                                value="hide"
                                checked={restrictionFor === "hide"}
                                onChange={() => setRestrictionFor("hide")}
                                className="h-4 w-4"
                            />
                            Hide listed countries
                        </label>
                    </div>
                </div>

                {/* Countries */}
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-800">Countries</p>
                    <Select
                        isMulti
                        name="countries"
                        options={toOptions(countryData?.all_country ?? [])}
                        value={countries}
                        onChange={(newValue) => setCountries(newValue as OptionType[])}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select countries..."
                        // styles={customStyles}
                    />


                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Settings"}
                </button>
            </form>
        </div>
    );
}
