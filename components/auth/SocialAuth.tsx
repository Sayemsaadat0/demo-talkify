// 'use client';

// import { SOCIAL_AUTH_API } from '@/api/api';
// import React from 'react';

// type SocialItem = {
//     id: number;
//     description: { name: string };
//     content: {
//         media: {
//             my_link: string;
//             icon: string; // FontAwesome class name like "fab fa-facebook-f"
//         };
//     };
// };

// const SocialAuth = ({ socials }: { socials: SocialItem[] }) => {

//     const handleClick = async (social: SocialItem) => {
//         const name = social?.description?.name?.toLowerCase();
//         const apiUrl = `${SOCIAL_AUTH_API}${name}`;
//         const redirectUrl = `${SOCIAL_AUTH_API}${name}/callback`;

//         try {
//             const payload = {
//                 redirect_url: redirectUrl
//             }
//             const response = await fetch(apiUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Accept: 'application/json',
//                 },
//                 body: JSON.stringify(payload)
//             });

//             // return console.log(response)

//             if (!response.ok) {
//                 throw new Error(`API call failed: ${response.status}`);
//             }

//             const data = await response.json();
//             if (data.authorization_url) {
//                 // 🔁 Redirect the user to the auth URL
//                 window.location.href = data.authorization_url;
//             } else {
//                 console.warn('No authorization_url found in response');
//             }

//             console.log('Auth API Success:', data);

//             // Optional: Redirect or handle data
//             // window.location.href = data.redirect_url;

//         } catch (error) {
//             console.error('Auth API Error:', error);
//         }
//     };

//     const renderSocialIcon = (iconClass: string) => {
//         const iconMap: Record<string, { path: React.ReactNode; bg: string }> = {
//             "fab fa-facebook-f": {
//                 path: (
//                     <path
//                         fill="white"
//                         d="M22.675 0h-13.35C4.07 0 0 4.07 0 9.094v13.812C0 27.93 4.07 32 9.094 32h13.812C27.93 32 32 27.93 32 22.906V9.094C32 4.07 27.93 0 22.906 0zm-2.12 10.675h-1.567c-1.232 0-1.473.586-1.473 1.445v1.893h2.946l-.384 2.983h-2.562v7.648h-3.106v-7.648h-2.61v-2.983h2.61v-2.197c0-2.586 1.582-3.993 3.891-3.993 1.106 0 2.058.082 2.336.12v2.732z"
//                     />
//                 ),
//                 bg: "bg-[#1877F2]",
//             },
//             "fab fa-twitter": {
//                 path: (
//                     <path
//                         fill="white"
//                         d="M32 6.076a13.172 13.172 0 01-3.769 1.031 6.6 6.6 0 002.887-3.631 13.153 13.153 0 01-4.169 1.594 6.564 6.564 0 00-11.188 5.98A18.635 18.635 0 012.224 4.149a6.563 6.563 0 002.031 8.75A6.531 6.531 0 012.56 12v.082a6.566 6.566 0 005.263 6.437 6.575 6.575 0 01-2.959.112 6.568 6.568 0 006.131 4.557 13.172 13.172 0 01-8.152 2.807c-.53 0-1.053-.031-1.569-.092a18.616 18.616 0 0010.063 2.949c12.072 0 18.675-10.003 18.675-18.676 0-.284-.006-.568-.019-.85A13.337 13.337 0 0032 6.076z"
//                     />
//                 ),
//                 bg: "bg-[#1DA1F2]",
//             },
//             "fab fa-linkedin": {
//                 path: (
//                     <path
//                         fill="white"
//                         d="M29 0H3C1.343 0 0 1.343 0 3v26c0 1.657 1.343 3 3 3h26c1.657 0 3-1.343 3-3V3c0-1.657-1.343-3-3-3zM9.338 27.338H5.662V12.569h3.676v14.769zM7.5 10.82a2.137 2.137 0 110-4.275 2.137 2.137 0 010 4.275zM27.338 27.338h-3.676v-7.68c0-1.832-.032-4.191-2.553-4.191-2.554 0-2.946 1.996-2.946 4.058v7.813h-3.676V12.569h3.529v2.014h.049c.491-.93 1.693-1.91 3.484-1.91 3.726 0 4.412 2.452 4.412 5.638v9.027z"
//                     />
//                 ),
//                 bg: "bg-[#0077B5]",
//             },
//             "fab fa-instagram": {
//                 path: (
//                     <path
//                         fill="white"
//                         d="M16 7.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zm0 14a5.5 5.5 0 110-11 5.5 5.5 0 010 11zm6-14.1a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM28 8c0-2.2-1.8-4-4-4H8C5.8 4 4 5.8 4 8v16c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4V8zm-4 0l.003 16H8V8h16z"
//                     />
//                 ),
//                 bg: "bg-[#E1306C]",
//             },
//         };

//         const icon = iconMap[iconClass] || { path: null, bg: "bg-gray-300" };
//         return (
//             <span
//                 className={`w-10 h-10 flex items-center justify-center rounded-full ${icon.bg}`}
//             >
//                 <svg
//                     width="20"
//                     height="20"
//                     viewBox="0 0 32 32"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                 >
//                     {icon.path}
//                 </svg>
//             </span>
//         );
//     };

//     return (
//         <div className="flex flex-col md:flex-row gap-4 mb-6 mt-10">
//             {socials.length > 0 ? (
//                 socials.map((s: SocialItem) => (
//                     <div key={s.id} className="flex items-center justify-center">
//                         <button
//                             onClick={() => handleClick(s)}
//                             className="w-12 h-12 flex items-center cursor-pointer justify-center rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200"
//                         >
//                             {renderSocialIcon(s.content.media.icon)}
//                         </button>
//                     </div>
//                 ))
//             ) : (
//                 <div className="flex items-center justify-center">
//                     <button
//                         className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200"
//                     >
//                         {renderSocialIcon("fab fa-facebook-f")}
//                     </button>
//                 </div>
//             )}

//         </div>
//     );
// };

// export default SocialAuth;



'use client';

import { SOCIAL_AUTH_API } from '@/api/api';
import React from 'react';

// 1. Updated type: icon is now JSX, and we store the styling classes directly.
type ProviderInfo = {
    provider: 'google' | 'facebook' | 'linkedin';
    label: string;
    icon: React.ReactNode; // The full SVG element as JSX
    styleClasses: string;  // Tailwind classes for the background circle
};

const SocialAuth = () => {
    // 2. The array now holds the complete presentation data for each provider.
    const socialProviders: ProviderInfo[] = [
        {
            provider: 'google',
            label: 'Sign in with Google',
            styleClasses: 'bg-white text-[#4285F4]', // Note: bg is white, text is blue
            icon: (
                <svg width="50" height="25" viewBox="0 0 294 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M150 122.729V180.82H230.727C227.183 199.502 216.545 215.321 200.59 225.957L249.272 263.731C277.636 237.55 294 199.094 294 153.412C294 142.776 293.046 132.548 291.273 122.73L150 122.729Z" fill="#4285F4" />
                    <path d="M65.9342 178.553L54.9546 186.958L16.0898 217.23C40.7719 266.185 91.3596 300.004 149.996 300.004C190.496 300.004 224.45 286.64 249.269 263.731L200.587 225.958C187.223 234.958 170.177 240.413 149.996 240.413C110.996 240.413 77.8602 214.095 65.9955 178.639L65.9342 178.553Z" fill="#34A853" />
                    <path d="M16.0899 82.7734C5.86309 102.955 0 125.728 0 150.001C0 174.273 5.86309 197.047 16.0899 217.228C16.0899 217.363 66.0004 178.5 66.0004 178.5C63.0004 169.5 61.2272 159.955 61.2272 149.999C61.2272 140.043 63.0004 130.498 66.0004 121.498L16.0899 82.7734Z" fill="#FBBC05" />
                    <path d="M149.999 59.7279C172.091 59.7279 191.727 67.3642 207.409 82.0918L250.364 39.1373C224.318 14.8647 190.5 0 149.999 0C91.3627 0 40.7719 33.6821 16.0898 82.7738L65.9988 121.502C77.8619 86.0462 110.999 59.7279 149.999 59.7279Z" fill="#EA4335" />
                </svg>
            ),
        },
        {
            provider: 'facebook',
            label: 'Sign in with Facebook',
            styleClasses: 'bg-[#1877F2]',
            icon: (
                <svg viewBox="0 0 32 32" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill="white"
                        d="M22.675 0h-13.35C4.07 0 0 4.07 0 9.094v13.812C0 27.93 4.07 32 9.094 32h13.812C27.93 32 32 27.93 32 22.906V9.094C32 4.07 27.93 0 22.906 0zm-2.12 10.675h-1.567c-1.232 0-1.473.586-1.473 1.445v1.893h2.946l-.384 2.983h-2.562v7.648h-3.106v-7.648h-2.61v-2.983h2.61v-2.197c0-2.586 1.582-3.993 3.891-3.993 1.106 0 2.058.082 2.336.12v2.732z"
                    />
                </svg>
            ),
        },
        {
            provider: 'linkedin',
            label: 'Sign in with LinkedIn',
            styleClasses: 'bg-[#0077B5]',
            icon: (
                <svg viewBox="0 0 32 32" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill="white"
                        d="M29 0H3C1.343 0 0 1.343 0 3v26c0 1.657 1.343 3 3 3h26c1.657 0 3-1.343 3-3V3c0-1.657-1.343-3-3-3zM9.338 27.338H5.662V12.569h3.676v14.769zM7.5 10.82a2.137 2.137 0 110-4.275 2.137 2.137 0 010 4.275zM27.338 27.338h-3.676v-7.68c0-1.832-.032-4.191-2.553-4.191-2.554 0-2.946 1.996-2.946 4.058v7.813h-3.676V12.569h3.529v2.014h.049c.491-.93 1.693-1.91 3.484-1.91 3.726 0 4.412 2.452 4.412 5.638v9.027z"
                    />
                </svg>
            ),
        },
    ];

    const handleClick = async (provider: string) => {
        const apiUrl = `${SOCIAL_AUTH_API}${provider}`;
        const redirectUrl = `${SOCIAL_AUTH_API}${provider}/callback`;

        try {
            const payload = {
                redirect_url: redirectUrl,
            };
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`API call failed: ${response.status}`);

            const data = await response.json();
            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                console.warn('No authorization_url found in response');
            }
        } catch (error) {
            console.error(`Auth API Error for ${provider}:`, error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6 mt-10">
            {socialProviders.map((item) => (
                <div key={item.provider} className="flex items-center justify-center">
                    <button
                        onClick={() => handleClick(item.provider)}
                        aria-label={item.label}
                        className="w-12 h-12 flex items-center cursor-pointer justify-center rounded-full border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200"
                    >
                        {/* 3. The icon is now rendered directly and styled with its own classes */}
                        <span
                            className={`w-10 h-10 flex items-center justify-center rounded-full ${item.styleClasses}`}
                        >
                            {item.icon}
                        </span>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default SocialAuth;