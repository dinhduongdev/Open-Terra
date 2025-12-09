/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function TimeDisplay() {
    const t = useTranslations('overview');
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        // Initial set
        const updateTime = () => {
            const now = new Date();
            // Format: HH:mm:ss GMT+7 (Asia/Ho_Chi_Minh)
            const formatted = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Asia/Ho_Chi_Minh',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).format(now) + ' GMT+7';

            setTime(formatted);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    // Prevent hydration mismatch by not rendering until client-side (time is empty initially)
    if (!time) {
        return <div className="h-6 w-32 animate-pulse bg-gray-200 rounded"></div>;
    }

    return (
        <div className="flex items-center space-x-2 text-sm font-medium text-gray-900 bg-white px-3 py-1 rounded-full w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{time}</span>
        </div>
    );
}
