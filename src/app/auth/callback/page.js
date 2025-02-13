'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window !== 'undefined') { 
            const token = searchParams.get('token');
            if (token) {
                Cookies.set('token', token, { expires: 1 / 1440 });
                router.push('/map');
            }
        }
    }, [searchParams, router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl">กำลังเข้าสู่ระบบ...</h2>
            </div>
        </div>
    );
}
