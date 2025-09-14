/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch } from '@reduxjs/toolkit';
import { logout } from '@/redux/features/authSlice';

export interface ApiErrorHandler {
  dispatch: Dispatch;
  router: any; // Next.js router
  redirectPath?: string;
}

/**
 * Handles API errors, specifically 401 Unauthorized errors
 * @param response - The fetch response object
 * @param handler - Error handler configuration
 * @returns boolean - true if error was handled, false otherwise
 */
export function handleApiError(
  response: Response, 
  handler: ApiErrorHandler
): boolean {
  if (response.status === 401) {
    console.warn('🚨 401 Unauthorized - redirecting to login');
    
    // Clear auth state
    handler.dispatch(logout());
    
    // Redirect to login page
    const redirectPath = handler.redirectPath || '/login';
    handler.router.push(redirectPath);
    
    return true; // Error was handled
  }
  
  return false; // Error was not handled
}

/**
 * Enhanced fetch wrapper that automatically handles 401 errors
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @param handler - Error handler configuration
 * @returns Promise<Response>
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  handler: ApiErrorHandler
): Promise<Response> {
  const response = await fetch(url, options);
  
  // Handle 401 errors automatically
  if (!response.ok && response.status === 401) {
    handleApiError(response, handler);
  }
  
  return response;
}

/**
 * Hook for creating error handler configuration
 * @param dispatch - Redux dispatch function
 * @param router - Next.js router
 * @param redirectPath - Optional custom redirect path (defaults to '/login')
 * @returns ApiErrorHandler configuration
 */
export function createErrorHandler(
  dispatch: Dispatch,
  router: any,
  redirectPath?: string
): ApiErrorHandler {
  return {
    dispatch,
    router,
    redirectPath,
  };
}