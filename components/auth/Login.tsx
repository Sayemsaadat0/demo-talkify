"use client";
import { LOGIN_BANNER } from "@/lib/constant";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/features/authSlice";
import { loginUser, fetchLoginRegistrationData } from "@/app/authActions";
import toast from "react-hot-toast";
import SocialAuth from "./SocialAuth";
// import { useRouter } from "next/navigation";

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



const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('talkify-login-email') || "";
      } catch {
        return "";
      }
    }
    return "";
  });
  const [rememberMe, setRememberMe] = useState(() => (typeof window !== 'undefined' ? !!localStorage.getItem('talkify-login-email') : false));
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [heading, setHeading] = useState("Log In");
  const [subHeading, setSubHeading] = useState("Hi, Welcome Back!");
  const [illustration, setIllustration] = useState(LOGIN_BANNER);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socials, setSocials] = useState<SocialItem[]>([]);
  // const router = useRouter();
  const dispatch = useDispatch();
  const [loadingText, setLoadingText] = useState(true);


  useEffect(() => {
    // console.log("Login component mounted, fetching data...");
    setLoadingText(true);
    fetchLoginRegistrationData()
      .then((res) => {
        // console.log("API Response:", res);
        if (res.success && res.data?.template) {
          const desc = res.data.template["login-register"][0]?.description;
          const media = res.data.template["login-register"][0]?.content?.media;
          // console.log("Description:", desc);
          // console.log("Media:", media);
          setHeading(desc?.login_heading || "Log In");
          setSubHeading(desc?.login_sub_heading || "Hi, Welcome Back!");
          if (media?.login_page_image?.path) {
            const API_BASE_URL =
              process.env.NEXT_PUBLIC_API_URL || "https://staging.talkify.pro";
            setIllustration(`${API_BASE_URL}/${media.login_page_image.path}`);
          } else {
            setIllustration(LOGIN_BANNER);
          }
          setSocials(res.data.template.social || []);
          // console.log("Socials set:", res.data.template.social);
        } else {
          // console.log("API call failed or no data:", res);
          setIllustration(LOGIN_BANNER);
        }
        setLoadingText(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIllustration(LOGIN_BANNER);
        setLoadingText(false);
      });
  }, []);

  // Keep localStorage email in sync when rememberMe is enabled
  useEffect(() => {
    if (rememberMe) {
      try { localStorage.setItem('talkify-login-email', email); } catch {}
    }
  }, [email, rememberMe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await loginUser({ email, password });

    // Persist or remove remembered email based on checkbox
    try {
      if (rememberMe) {
        localStorage.setItem('talkify-login-email', email);
      } else {
        localStorage.removeItem('talkify-login-email');
      }
    } catch {}

    if (res.success) {
      // Update Redux state immediately
      dispatch(loginSuccess({ user: res.user, token: res.token }));
      
      // Show success message
      toast.success("Login successful!");
      
      // Navigate to dashboard using Next.js router for better performance
      window.location.href = `/dashboard`;
      
      // Set loading to false after successful login
      setLoading(false);
    } else {
      setLoading(false);
      if (res.errors) {
        (Object.values(res.errors).flat() as string[]).forEach((msg) =>
          toast.error(msg)
        );
      } else {
        toast.error(res.message || "Login failed");
      }
      setError(res.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white container mx-auto py-12 ">
      {/* Left: Login Form */}
      <div className="w-full md:w-1/2 flex flex-col px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {loadingText ? (
            <span className="block w-48 h-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            heading
          )}
        </h1>
        <h2 className="text-xl text-gray-900 mb-2">
          {loadingText ? (
            <span className="block w-64 h-6 bg-gray-100 rounded animate-pulse" />
          ) : (
            subHeading
          )}
        </h2>
        {/* socials={socials}  */}
        <SocialAuth />

        {/* <div className="flex flex-col md:flex-row gap-4 mb-6 mt-10">
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
        </div> */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-4 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form className="space-y-5" onSubmit={handleSubmit}>
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
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                className="form-checkbox rounded text-blue-600 mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="/forget-password" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 text-base transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-500 text-center">
          Not registered yet?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
      {/* Right: Illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center h-full">
        <div className="flex items-center justify-center h-full w-full">
          <Image
            src={illustration}
            alt="Login illustration"
            width={600}
            height={600}
            className="object-contain"
            onError={() => setIllustration(LOGIN_BANNER)}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
