'use client'
import Login from "@/components/auth/Login"
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const LoginPage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/'); // 🚀 send them to their home
    }
  }, [isAuthenticated, router]);

  // You can also short-circuit the UI if you like:
  if (isAuthenticated) return null; // or a loading spinner
  return (
    <>
      <Login />
    </>
  )
}
export default LoginPage