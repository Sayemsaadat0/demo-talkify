"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { CHANGE_PASSWORD_API, CHANGE_PASSWORD_CODE_API } from "@/api/api";

const ChangePasswordForm: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);

  // Two steps: 1) request OTP, 2) change password
  const [step, setStep] = useState<"request" | "change">("request");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    code: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 1) Send OTP to user to initiate password change
  const handleSendOtp = async () => {
    if (!token) {
      toast.error("You are not authenticated");
      return;
    }

    setSendingOtp(true);
    try {
      const response = await fetch(CHANGE_PASSWORD_CODE_API, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      if (result?.status) {
        toast.success(result?.message || "OTP sent successfully");
        setStep("change");
      } else {
        toast.error(result?.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP failed:", error);
      toast.error("An error occurred while sending OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  // 2) Submit new password with OTP code
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("You are not authenticated");
      return;
    }

    if (!form.code.trim()) {
      toast.error("Code is required");
      return;
    }
    if (!form.password.trim()) {
      toast.error("Password is required");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }
    if (form.password !== form.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(CHANGE_PASSWORD_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: form.code,
          password: form.password,
          password_confirmation: form.password_confirmation,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      if (result?.status) {
        toast.success(result?.message || "Password changed successfully");
        // Reset form and go back to request step
        setForm({ code: "", password: "", password_confirmation: "" });
        setStep("request");
      } else {
        toast.error(result?.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Change password failed:", error);
      toast.error("An error occurred while changing password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl">
      {step === "request" ? (
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Change Password</h3>
          <p className="text-sm text-gray-600 mb-4">
            To change your password, request a one-time code (OTP) first.
          </p>
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={sendingOtp}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {sendingOtp ? "Sending..." : "Request OTP to change password"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 border border-gray-100 space-y-5">
          <h3 className="text-lg font-semibold text-gray-900">Enter Code and New Password</h3>

          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-semibold text-gray-700">
              Code
            </label>
            <input
              id="code"
              name="code"
              value={form.code}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter the code you received"
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter new password"
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700">
              Confirm New Password
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={form.password_confirmation}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Confirm new password"
              disabled={submitting}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {submitting ? "Changing..." : "Change Password"}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={() => setStep("request")}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChangePasswordForm;