'use client'

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ME_API } from '@/api/api';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/features/authSlice';

const TokenApiCaller = () => {
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const router = useRouter()


    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            const fetchData = async () => {
                try {
                    const response = await fetch(ME_API, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    const data = await response.json();

                    dispatch(loginSuccess({ user: data.user, token: data.token }));

                    // ✅ Remove all URL parameters
                    window.history.replaceState({}, '', window.location.pathname);

                    router.push('/');
                } catch (error) {
                    console.error('API Error:', error);
                }
            };


            fetchData();
        }
    }, [searchParams, dispatch, router]);

    return null; // no UI
};

const Success = () => {
    return (
        <>
            <Suspense fallback={null}>
                <TokenApiCaller />
            </Suspense>

            <div className="h-[calc(100vh-200px)] flex flex-col justify-center items-center bg-[#f5f7fa] font-sans text-[#2c3e50] p-4 text-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="72"
                    height="72"
                    fill="none"
                    stroke="#27ae60"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    style={{ marginBottom: '16px' }}
                >
                    <path d="M20 6L9 17l-5-5" />
                </svg>
                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Login Successful</h1>
                <p style={{ fontSize: '1rem', color: '#7f8c8d', maxWidth: '320px' }}>
                    You have successfully logged in. You can now proceed to your dashboard.
                </p>
            </div>
        </>
    );
};

export default Success;