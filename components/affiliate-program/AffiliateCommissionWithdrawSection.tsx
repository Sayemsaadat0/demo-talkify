'use client'

import { AFFILIATE_BALANCE_CHECK_API, AFFILIATE_WITHDRAW_API } from "@/api/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetAffiliateCommision } from "@/hooks/useGetAffiliateCommision";
import { UseGetAffiliateGateway } from "@/hooks/UseGetAffiliateGateway";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

type props = {
    withdrawOpen: boolean,
    setWithdrawOpen: (open: boolean) => void;
}

const AffiliateCommissionWithdrawSection = ({ withdrawOpen, setWithdrawOpen }: props) => {
    const token = useSelector((state: RootState) => state.auth.token);
    const { refetch } = useGetAffiliateCommision({})

    const { data } = UseGetAffiliateGateway()
    const [form, setForm] = useState({
        gateway_id: "",
        amount: "",
        note: "",

    });


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [balance, setBalance] = useState<any>(null);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [balanceError, setBalanceError] = useState<string | null>(null);


    const debouncedAmount = useDebounce(form.amount, 500); // debounce 500ms
    useEffect(() => {
        if (!debouncedAmount || Number(debouncedAmount) <= 0 || !form.gateway_id) {
            setBalance(null);
            setBalanceError(null);
            return;
        }

        const fetchBalance = async () => {
            setBalanceLoading(true);
            setBalanceError(null);
            try {

                const response = await fetch(AFFILIATE_BALANCE_CHECK_API, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        amount: Number(debouncedAmount),
                        gateway_id: form.gateway_id,


                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch balance");
                }

                const json = await response.json();
                setBalance(json);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                setBalanceError(error.message || "Unknown error");
            } finally {
                setBalanceLoading(false);
            }
        };

        fetchBalance();
    }, [debouncedAmount, form.gateway_id, token, form.note]);  // Removed balance here

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            gateway_id: form.gateway_id,
            amount: parseFloat(form.amount),
            note: form.note,
        }

        try {
            // return console.log(payload)
            const response = await fetch(AFFILIATE_WITHDRAW_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // If needed
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit withdraw request");
            }

            const result = await response.json();
            toast.success(result.message)
            refetch()
            setWithdrawOpen(!withdrawOpen);
        } catch (error) {
            console.error("Submit error:", error);
        }
    };


    return (
        <form onSubmit={handleSubmit} className=" space-y-4 p-4 ">

            <p className="text-xl font-bold">Withdraw Request</p>
            <div>
                <label htmlFor="gateway_id" className="block mb-1 font-semibold">
                    Select Bank
                </label>
                <select
                    id="gateway_id"
                    name="gateway_id"
                    value={form.gateway_id}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="">-- Choose Bank --</option>
                    {data?.gateways?.data && data?.gateways?.data?.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                            {bank.data.bank_name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="amount" className="block mb-1 font-semibold">
                    Amount
                </label>
                <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    required
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter amount"
                />
            </div>
            <span className="text-xs text-red-500">
                {balanceError && balance?.message}

            </span>

            <div>
                <label htmlFor="note" className="block mb-1 font-semibold">
                    note
                </label>
                <textarea
                    id="note"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter any note"
                />
            </div>

            <div className="flex justify-end">
                <button
                    disabled={balanceLoading || !balance?.status}
                    type="submit"
                    className={`px-4 py-2 rounded text-white 
      ${balanceLoading || !balance?.status
                            ? "bg-gray-400 cursor-not-allowed"  // disabled state
                            : "bg-blue-600 hover:bg-blue-700"} // active state
    `}
                >
                    Withdraw
                </button>
            </div>

        </form>
    );
};

export default AffiliateCommissionWithdrawSection;
