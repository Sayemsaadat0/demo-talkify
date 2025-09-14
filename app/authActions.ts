/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import {
  LOGIN_API,
  REGISTER_API,
  LOGIN_REGISTRATION_DATA_API,
  VERIFICATION_OTP_API,
  RESEND_OTP_API,
} from "@/api/api";

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const res = await fetch(LOGIN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.token) {
      throw new Error(data.message || "Login failed");
    }
    return { success: true, ...data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function registerUser({
  name,
  email,
  password,
  password_confirmation,
}: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  try {
    const res = await fetch(REGISTER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });
    const data = await res.json();
    
    if (!res.ok || !data.status) {
      // Check for both boolean and string success values
      const isSuccess = data.status === true || data.success === true || data.success === "success";
      
      if (!isSuccess) {
        // Extract error message from nested error object or direct message
        let errorMessage = "Registration failed";
        if (data.error && typeof data.error === 'object' && data.error.message) {
          errorMessage = data.error.message;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = typeof data.error === 'string' ? data.error : "Registration failed";
        }
        
        return { 
          success: false, 
          message: errorMessage,
          errors: data.errors || null,
          rawResponse: data
        };
      }
    }
    return { success: true, ...data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function verifyEmail({
  code,
  email,
  type,
}: {
  code: string;
  email: string;
  type: string;
}) {
  try {
    const res = await fetch(VERIFICATION_OTP_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, email, type }),
    });
    const data = await res.json();
    if (!res.ok || !data.status) {
      throw new Error(data.message || "Verification failed");
    }
    return { success: true, ...data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function resendVerificationCode({
  email,
  type,
}: {
  email: string;
  type: string;
}) {
  try {
    const res = await fetch(RESEND_OTP_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, type }),
    });
    const data = await res.json();
    if (!res.ok || !data.status) {
      throw new Error(data.message || "Failed to resend verification code");
    }
    return { success: true, ...data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function fetchLoginRegistrationData() {
  try {
    // console.log("Fetching from URL:", LOGIN_REGISTRATION_DATA_API);
    const res = await fetch(LOGIN_REGISTRATION_DATA_API, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    // console.log("Response status:", res.status);
    const data = await res.json();
    // console.log("Response data:", data);
    if (!res.ok || !data.status) {
      throw new Error(
        data.message || "Failed to fetch login/registration data"
      );
    }
    return { success: true, ...data };
  } catch (error: any) {
    console.error("Error in fetchLoginRegistrationData:", error);
    return { success: false, message: error.message };
  }
}
