"use client";
import { SIGNUP_BANNER } from "@/lib/constant";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  registerUser,
  fetchLoginRegistrationData,
  verifyEmail,
  resendVerificationCode,
} from "@/app/authActions";
import toast from "react-hot-toast";
import { AUTH_REDIRECT } from "@/api/api";

type SocialItem = {
  id: number;
  description: { name: string };
  content: {
    media: {
      my_link: string;
      icon: string; // FontAwesome class name like "fab fa-facebook-f"
    };
  };
};

// Function to render FontAwesome icon from class name
const renderSocialIcon = (iconClass: string) => {
  // Map common FontAwesome classes to SVG paths
  const iconMap: Record<string, { path: React.ReactNode; bg: string }> = {
    "fab fa-facebook-f": {
      path: (
        <path
          fill="white"
          d="M22.7 16.1h-4.1v8.1h-3.3v-8.1h-2.2v-2.8h2.2v-1.8c0-2.1 1.2-3.3 3.3-3.3h2.2v2.8h-1.4c-.7 0-.8.3-.8.8v1.5h2.3l-.3 2.8z"
        />
      ),
      bg: "bg-[#1877F2]",
    },
    "fab fa-twitter": {
      path: (
        <path
          fill="white"
          d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
        />
      ),
      bg: "bg-[#1DA1F2]",
    },
    "fab fa-linkedin": {
      path: (
        <path
          fill="white"
          d="M12.1013 20.2498H9.92441V13.2396H12.1013V20.2498ZM11.0117 12.2834C10.3156 12.2834 9.75098 11.7068 9.75098 11.0107C9.75098 10.6763 9.8838 10.3557 10.1202 10.1193C10.3567 9.88282 10.6773 9.75 11.0117 9.75C11.346 9.75 11.6667 9.88282 11.9031 10.1193C12.1396 10.3557 12.2724 10.6763 12.2724 11.0107C12.2724 11.7068 11.7075 12.2834 11.0117 12.2834ZM20.2486 20.2498H18.0764V16.8373C18.0764 16.024 18.06 14.981 16.9446 14.981C15.8129 14.981 15.6394 15.8646 15.6394 16.7787V20.2498H13.4649V13.2396H15.5527V14.1959H15.5832C15.8738 13.6451 16.5837 13.0638 17.6429 13.0638C19.846 13.0638 20.251 14.5146 20.251 16.399V20.2498H20.2486Z"
        />
      ),
      bg: "bg-[#0077B5]",
    },
    "fab fa-instagram": {
      path: (
        <path
          fill="white"
          d="M21 9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h8zm-4 2.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm0 1.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm4.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z"
        />
      ),
      bg: "bg-[#E1306C]",
    },
  };

  const icon = iconMap[iconClass] || { path: null, bg: "bg-gray-300" };
  return (
    <span
      className={`w-12 h-12 flex items-center justify-center rounded-full ${icon.bg}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {icon.path}
      </svg>
    </span>
  );
};

const Signup = () => {
  const LocalEmail = localStorage.getItem('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(LocalEmail || "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [heading, setHeading] = useState("Sign Up");
  const [subHeading, setSubHeading] = useState("Hi, Welcome Back!");
  const [illustration, setIllustration] = useState(SIGNUP_BANNER);
  const [socials, setSocials] = useState<SocialItem[]>([]);
  const [loadingText, setLoadingText] = useState(true);

  // OTP verification states
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const timeLeftRef = useRef(120);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  // Start timer without causing React re-renders
  const startTimer = useCallback(() => {
    timeLeftRef.current = 120;
    setCanResend(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      const mins = Math.floor(timeLeftRef.current / 60);
      const secs = timeLeftRef.current % 60;
      const displayTime = `${mins}:${secs.toString().padStart(2, "0")}`;

      // Update timer display directly in DOM to avoid React re-render
      const timerElement = document.getElementById("timer-display");
      if (timerElement) {
        timerElement.textContent = displayTime;
      }

      if (timeLeftRef.current <= 0) {
        setCanResend(true);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      }
    }, 1000);
  }, []);

  // Timer effect
  useEffect(() => {
    if (showOtpForm) {
      startTimer();
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [showOtpForm, startTimer]);

  // Handle OTP input change
  const handleOtpChange = useCallback((index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = value;
      return newOtp;
    });

    // Auto-focus to next input if value is entered
    if (value && index < 5) {
      setTimeout(() => {
        otpRefs.current[index + 1]?.focus();
      }, 0);
    }
  }, []);

  // Handle backspace
  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        setTimeout(() => {
          otpRefs.current[index - 1]?.focus();
        }, 0);
      }
    },
    [otp]
  );

  // Get complete OTP string
  const getOtpString = useCallback(() => otp.join(""), [otp]);

  useEffect(() => {
    setLoadingText(true);
    fetchLoginRegistrationData()
      .then((res) => {
        if (res.success && res.data?.template) {
          const desc = res.data.template["login-register"][0]?.description;
          const media = res.data.template["login-register"][0]?.content?.media;
          setHeading(desc?.register_heading || "Sign Up");
          setSubHeading(desc?.register_sub_heading || "Hi, Welcome Back!");
          if (media?.register_page_image?.path) {
            const API_BASE_URL =
              process.env.NEXT_PUBLIC_API_URL || "https://staging.talkify.pro";
            setIllustration(
              `${API_BASE_URL}/${media.register_page_image.path}`
            );
          } else {
            setIllustration(SIGNUP_BANNER);
          }
          setSocials(res.data.template.social || []);
        }
        setLoadingText(false);
      })
              .catch(() => {
          setLoadingText(false);
          setIllustration(SIGNUP_BANNER);
        });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await registerUser({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    
    setLoading(false);
    if (res.success) {
      toast.success("Verification code sent to your email!");
      setShowOtpForm(true);
      localStorage.removeItem('email');
      setCanResend(false);
    } else {
      if (res.errors) {
        (Object.values(res.errors).flat() as string[]).forEach((msg) =>
          toast.error(msg)
        );
      } else {
        toast.error(res.message || "Registration failed");
      }
      setError(res.message || "Registration failed");
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (getOtpString().length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }

    setOtpLoading(true);
    const res = await verifyEmail({
      code: getOtpString(),
      email: email,
      type: "email",
    });
    setOtpLoading(false);

    if (res.success) {
      toast.success("Email verified successfully!");
      // Redirect to the provided URL with token
      if (res.data?.redirect_to && res.data?.token) {
        window.location.href = `${res.data.redirect_to}?token=${res.data.token}`;
      } else {
        // Fallback to AUTH_REDIRECT if no redirect_to provided
        window.location.href = `${AUTH_REDIRECT}?token=${res.data?.token}`;
      }
    } else {
      toast.error(res.message || "Verification failed");
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    const res = await resendVerificationCode({
      email: email,
      type: "email",
    });
    setResendLoading(false);

    if (res.success) {
      toast.success("Verification code resent to your email!");
      startTimer();
      setOtp(["", "", "", "", "", ""]); // Clear all inputs
    } else {
      toast.error(res.message || "Failed to resend verification code");
    }
  };

  // Memoized OTP Inputs component
  type OtpInputsProps = {
    otp: string[];
    handleOtpChange: (index: number, value: string) => void;
    handleOtpKeyDown: (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => void;
    otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  };

  const OtpInputs = React.memo(function OtpInputs({
    otp,
    handleOtpChange,
    handleOtpKeyDown,
    otpRefs,
  }: OtpInputsProps) {
    return (
      <div className="flex justify-center gap-2">
        {otp.map((digit: string, index: number) => (
          <input
            key={index}
            ref={(el) => {
              otpRefs.current[index] = el;
            }}
            type="text"
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
            onFocus={(e) => e.target.select()}
            className="w-14 h-14 border border-blue-200 rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            maxLength={1}
            id={`otp-${index}`}
            autoComplete="one-time-code"
          />
        ))}
      </div>
    );
  });

  // OTP Input Component
  const OtpForm = () => (
    <div className="space-y-5">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mt-8">
          Verify Your Email
        </h3>
        <p className="text-gray-600">
          We&apos;ve sent a 6-digit verification code to{" "}
          <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-5">
        <div>
          {/* <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Verification Code
          </label> */}
          <OtpInputs
            otp={otp}
            handleOtpChange={handleOtpChange}
            handleOtpKeyDown={handleOtpKeyDown}
            otpRefs={otpRefs}
          />
        </div>

        <div className="text-center">
          {!canResend ? (
            <p className="text-sm text-gray-500">
              Resend code in{" "}
              <span className="font-mono" id="timer-display">
                2:00
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {resendLoading ? "Sending..." : "Resend Code"}
            </button>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 text-base transition disabled:opacity-50"
          disabled={otpLoading || getOtpString().length !== 6}
        >
          {otpLoading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => {
            setShowOtpForm(false);
            setOtp(["", "", "", "", "", ""]);
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
            }
            setCanResend(false);
          }}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Back to Sign Up
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white container mx-auto py-12">
      {/* Left: Signup Form */}
      <div className="w-full md:w-1/2 flex flex-col px-6 ">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {loadingText ? (
            <span className="block w-48 h-8 bg-gray-200 rounded animate-pulse" />
          ) : showOtpForm ? (
            "Email Verification"
          ) : (
            heading
          )}
        </h1>
        <h2 className="text-xl text-gray-900 mb-2">
          {loadingText ? (
            <span className="block w-64 h-6 bg-gray-100 rounded animate-pulse " />
          ) : showOtpForm ? (
            <span className="text-gray-500 text-sm">
              Enter the code sent to your email
            </span>
          ) : (
            subHeading
          )}
        </h2>

        {!showOtpForm && (
          <>
            <div className="flex flex-row gap-4 mb-6 mt-10">
              {socials.length > 0 ? (
                socials.map((s) => (
                  <div key={s.id} className="flex items-center justify-center">
                    <a
                      href={s.content.media.my_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200"
                    >
                      {renderSocialIcon(s.content.media.icon)}
                    </a>
                  </div>
                ))
              ) : (
                // fallback
                <div className="flex items-center justify-center">
                  <button className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    {renderSocialIcon("fab fa-facebook-f")}
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="mx-4 text-gray-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          </>
        )}

        {error && <div className="text-red-500 mb-2">{error}</div>}

        {showOtpForm ? (
          <OtpForm />
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 5l10 7 10-7" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-blue-200 rounded-lg pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M12 12v2" />
                    <circle cx="12" cy="16" r="1" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full border border-blue-200 rounded-lg pl-10 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-6.06M1 1l22 22" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="M12 12v2" />
                    <circle cx="12" cy="16" r="1" />
                  </svg>
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full border border-blue-200 rounded-lg pl-10 pr-10 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? (
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-6.06M1 1l22 22" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox rounded text-blue-600 mr-2"
                defaultChecked
              />
              <span className="text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms & Conditions
                </a>
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 text-base transition"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
        )}

        {!showOtpForm && (
          <p className="mt-6 text-sm text-gray-500 text-center">
            Already have an Account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        )}
      </div>
      {/* Right: Illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center h-full">
        <div className="flex items-center justify-center h-full w-full">
          <Image
            src={illustration}
            alt="Signup illustration"
            width={600}
            height={600}
            className="object-contain"
            onError={() => setIllustration(SIGNUP_BANNER)}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
