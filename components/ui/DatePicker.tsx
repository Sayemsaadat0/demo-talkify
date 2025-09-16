'use client';
/* eslint-disable @typescript-eslint/no-namespace */

// Declare wc-datepicker for TypeScript
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'wc-datepicker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: Date;
        'start-date'?: Date;
        'max-date'?: Date;
        locale?: string;
        theme?: string;
        style?: React.CSSProperties;
      };
    }
  }
}

import { defineCustomElements } from "wc-datepicker/dist/loader";
import { useState, useEffect, useRef } from "react";
import "wc-datepicker/dist/themes/light.css";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "lucide-react";

interface DatePickerProps {
    value?: string;
    onChange: (date: string | null) => void;
    placeholder?: string;
    className?: string;
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Select date",
    className = ""
}: DatePickerProps) {
    const [selectedDate, setSelectedDate] = useState<string>(value || "");
    const datepickerRef = useRef<HTMLElement>(null);
    // const isInitialized = useRef(false);

    // Initialize wc-datepicker
    useEffect(() => {
        defineCustomElements();
    }, []);

    // Handle date selection from wc-datepicker
    useEffect(() => {
        const updateValue = (e: CustomEvent) => {
            // console.log('Date selected:', e.detail); // Debug log
            const currentDate = e.detail?.value || e.detail;
            
            if (currentDate && typeof currentDate === 'object' && 'getFullYear' in currentDate) {
                const year = currentDate.getFullYear();
                const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
                const day = currentDate.getDate().toString().padStart(2, "0");
                const dateString = `${year}-${month}-${day}`;

                // console.log('Formatted date:', dateString); // Debug log
                setSelectedDate(dateString);
                onChange(dateString);
            } else if (typeof currentDate === 'string') {
                // Handle string date format
                // console.log('String date:', currentDate);
                setSelectedDate(currentDate);
                onChange(currentDate);
            }
        };

        // Add global event listener for wc-datepicker
        document.addEventListener("selectDate", updateValue as EventListener);

        return () => {
            document.removeEventListener("selectDate", updateValue as EventListener);
        };
    }, [onChange]);

    // Update internal state when prop changes
    useEffect(() => {
        if (value !== selectedDate) {
            setSelectedDate(value || "");
        }
    }, [value, selectedDate]);

    const clearDate = () => {
        setSelectedDate("");
        onChange(null);
    };

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return placeholder;
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className={`inline-flex items-center justify-center gap-2 p-2.5 border rounded-lg transition-colors ${selectedDate
                            ? 'border-blue-300 text-blue-600 bg-blue-50'
                            : 'border-gray-300 text-gray-500 bg-white hover:bg-gray-50'
                        } ${className}`}
                >
                    <Calendar className="h-4 w-4" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-800">Select Date</h3>
                            {selectedDate && (
                                <button
                                    onClick={clearDate}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col items-center space-y-3">
                            {/* Native date input as fallback */}
                            {/* <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    setSelectedDate(newValue);
                                    onChange(newValue || null);
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                max={new Date().toISOString().split('T')[0]}
                            /> */}

                             {/* wc-datepicker */}
                             <wc-datepicker
                                 ref={datepickerRef}
                                 value={selectedDate ? new Date(selectedDate) : undefined}
                                 start-date={selectedDate ? new Date(selectedDate) : undefined}
                                 max-date={new Date()}
                                 locale="en"
                                 theme="light"
                             />

                        </div>

                        {selectedDate && (
                            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                                <strong>Selected:</strong> {formatDisplayDate(selectedDate)}
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
