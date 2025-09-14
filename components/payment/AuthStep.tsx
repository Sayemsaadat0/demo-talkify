"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthStepProps {
  userExists: boolean | null;
  onSubmit: (password: string, confirmPassword?: string) => void;
  loading: boolean;
  error: string;
}

const AuthStep = ({ userExists, onSubmit, loading, error }: AuthStepProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    return password === confirmPassword;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmPasswordError("");

    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    if (!userExists) {
      if (!confirmPassword.trim()) {
        setConfirmPasswordError("Please confirm your password");
        return;
      }

      if (!validateConfirmPassword(password, confirmPassword)) {
        setConfirmPasswordError("Passwords do not match");
        return;
      }
    }

    onSubmit(password, userExists ? undefined : confirmPassword);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {userExists ? "Welcome Back!" : "Create Your Account"}
        </h2>
        <p className="text-gray-600">
          {userExists
            ? "Please enter your password to continue with the payment."
            : "Please create a password for your new account."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              passwordError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={
              userExists ? "Enter your password" : "Create a password"
            }
            disabled={loading}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 hidden"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
          {passwordError && (
            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
          )}
          {!userExists && (
            <p className="mt-1 text-sm text-gray-500">
              Password must be at least 6 characters long
            </p>
          )}
        </div>

        {!userExists && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  confirmPasswordError ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm your password"
                disabled={loading}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="mt-1 text-sm text-red-600">
                {confirmPasswordError}
              </p>
            )}
          </div>
        )}

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
              Processing...
            </div>
          ) : (
            "Continue to Payment"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Your account information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default AuthStep;
