"use client";
import Image from "next/image";
import { LOGO_URL, MAIN_NAV, MOBILE_MENU_ICON } from "@/lib/constant";
import Button from "../ui/button";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import MobileToggleMenu from "./mobile-toggle-menu";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/features/authSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";
import { LOGOUT_API } from "@/api/api";

const Header = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const isLogout = searchParams.get('isLogout')
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { performLogout } = useLogout();
  const { isAuthenticated, token, user } = useSelector((state: RootState) => state.auth);

  // Get user data from Redux store
  const userData = user as {
    firstname?: string;
    lastname?: string;
    email?: string;
  } | null;

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };



  const handleSignOut = () => {
    setIsDropdownOpen(false);
    performLogout('/');
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isLogout === 'true') {
      dispatch(logout());
      const params = new URLSearchParams(searchParams.toString())
      params.delete('isLogout')
      router.replace('?' + params.toString())
    }
  }, [dispatch, isLogout, router, searchParams])

  return (
    <div className="bg-white">
      <header className="px-4 h-20 md:h-28 flex items-center justify-between mx-auto container">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <button onClick={handleMenuToggle} className="lg:hidden">
              <Image src={MOBILE_MENU_ICON} alt="menu" width={40} height={30} />
            </button>
            <Link href="/">
              <Image
                src={LOGO_URL}
                alt="logo"
                width={100}
                height={80}
                className="md:w-44 md:h-36"
              />
            </Link>
          </div>
        </div>
        <div className="items-center gap-12 hidden lg:flex relative z-20">

          {MAIN_NAV.map((item) => (
            <Link
              href={item.href}
              key={item.id}
              className={`text-base md:text-xl hover:text-blue-600 transition-colors cursor-pointer${pathname === item.href ? " text-blue-600" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                href="/signup"
                className="hidden md:block text-base md:text-lg md:px-8 md:py-2 font-semibold static z-10"
              >
                Sign Up
              </Link>
              <Link href="/login" suppressHydrationWarning>
                <Button className="text-base md:text-lg md:px-8 md:py-2 font-semibold relative z-10">
                  Login
                </Button>
              </Link>
            </>
          ) : (
            <div className="relative z-10  cursor-pointer" ref={dropdownRef}>
              <button
                onClick={handleProfileClick}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white  md:border md:border-gray-200 cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isDropdownOpen ? "ring-2 ring-blue-200" : ""
                  }`}
                aria-label="User menu"
              >
                {/* User avatar */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 border  border-blue-100">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
                  </svg>
                </div>

                {/* User info */}
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-800 leading-tight">
                    {userData?.firstname || "User"} {userData?.lastname ? ` ${userData.lastname}` : ""}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-0.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span className="truncate max-w-40">{userData?.email || "user@example.com"}</span>
                  </div>
                </div>

                {/* Dropdown arrow */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform hidden md:block duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6,9 12,15 18,9" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-30 py-3 px-0 animate-fade-in">

                  <div className="flex flex-col gap-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 text-base font-medium text-blue-700 transition-colors"
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-grid"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                      Dashboard
                    </Link>
                    <Link
                      href="/account"
                      className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 text-base font-medium text-blue-700 transition-colors"
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-user"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
                      </svg>
                      Account Setting
                    </Link>
                    <Link
                      href="/support"
                      className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 text-base font-medium text-blue-700 transition-colors"
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-headphones"
                      >
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2z" />
                        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
                      </svg>
                      Support
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-6 py-3 hover:bg-gray-100 text-base font-medium text-blue-700 transition-colors w-full text-left"
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-log-out"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      <MobileToggleMenu isOpen={isMenuOpen} onClose={handleMenuToggle} />
    </div>
  );
};
export default Header;
