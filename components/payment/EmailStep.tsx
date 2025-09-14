"use client";

import { useState } from "react";

interface EmailStepProps {
  email: string;
  onSubmit: (email: string) => void;
  loading: boolean;
  error: string;
}

const EmailStep = ({ email, onSubmit, loading, error }: EmailStepProps) => {
  const [emailValue, setEmailValue] = useState(email);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!emailValue.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(emailValue)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    onSubmit(emailValue);
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Enter Your Email
        </h2>
        <p className="text-gray-600">
          We&apos;ll use this to check if you have an existing account or create
          a new one.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              emailError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your email address"
            disabled={loading}
          />
          {emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Checking...
            </div>
          ) : (
            "Continue"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmailStep;
