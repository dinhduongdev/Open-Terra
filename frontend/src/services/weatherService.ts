/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

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

export interface WeatherData {
    id: string;
    type: string;
    location: {
        type: string;
        value: {
            coordinates: [number, number];
            type: string;
        };
    };
    dateObserved: {
        type: string;
        value: {
            '@type': string;
            '@value': string;
        };
    };
    address: {
        type: string;
        value: {
            addressCountry: string;
            addressLocality: string;
        };
    };
    areaServed: {
        type: string;
        value: string;
    };
    atmosphericPressure?: {
        type: string;
        value: number;
        observedAt: string;
        unitCode: string;
    };
    temperature?: {
        type: string;
        value: number;
        observedAt: string;
        unitCode: string;
    };
    relativeHumidity?: {
        type: string;
        value: number;
        observedAt: string;
        unitCode: string;
    };
    windSpeed?: {
        type: string;
        value: number;
        observedAt: string;
        unitCode: string;
    };
    precipitation?: {
        type: string;
        value: number;
        observedAt: string;
        unitCode: string;
    };
}

export interface WeatherAPIResponse {
    success: boolean;
    code: number;
    message: string;
    error: string | null;
    result: WeatherData;
}

/**
 * Fetch latest weather data
 */
export async function getLatestWeather(): Promise<WeatherData | null> {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/api/v1/weather/latest`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data: WeatherAPIResponse = await response.json();

        if (!data.success || !data.result) {
            throw new Error(data.error || 'Failed to fetch weather data');
        }

        return data.result;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
