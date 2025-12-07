/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { AIAdvisorAPIResponse, AIAdvisorResult } from '@/types/aiAdvisor';

// For server-side rendering, use localhost directly. For client-side, use NEXT_PUBLIC_API_URL
const getApiBaseUrl = () => {
    // Check if we're on the server
    if (typeof window === 'undefined') {
        return 'http://localhost:8000';
    }
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '')
        : 'http://localhost:8000';
};

/**
 * Fetch AI-generated advice based on current environmental data
 */
export async function getAIAdvisorAdvice(): Promise<AIAdvisorResult> {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/api/v1/ai-advisor`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data: AIAdvisorAPIResponse = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch AI advisor advice');
        }

        return data.result;
    } catch (error) {
        console.error('Error fetching AI advisor advice:', error);
        throw error;
    }
}
