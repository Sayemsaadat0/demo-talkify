import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/redux/features/authSlice';
import { LOGOUT_API } from '@/api/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export const useLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  const performLogout = useCallback(async (redirectPath: string = '/login') => {
    try {
      // Clear auth state immediately for instant UI feedback
      dispatch(logout());
      
      // Navigate immediately
      router.push(redirectPath);
      
      // Call logout API in background (non-blocking) - no toasts needed
      if (token) {
        try {
          await fetch(LOGOUT_API, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
        } catch (error) {
          // Silent fail - user is already logged out locally
          console.warn('Logout API call failed:', error);
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Ensure logout happens even if navigation fails
      dispatch(logout());
      router.push(redirectPath);
    }
  }, [dispatch, router, token]);

  return { performLogout };
};
