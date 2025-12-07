/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

// For server-side rendering, use localhost directly. For client-side, use NEXT_PUBLIC_API_URL
const getApiBaseUrl = () => {
    if (typeof window === 'undefined') {
        return 'http://localhost:8000';
    }
    return process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '')
        : 'http://localhost:8000';
};

export interface FloodMonitoringData {
    id: string;
    type: string;
    description?: {
        type: string;
        value: string;
        observedAt: string;
    };
    address?: {
        type: string;
        value: {
            streetAddress: string;
        };
    };
    floodLevelStatus?: {
        type: string;
        value: string;
        observedAt: string;
    };
    waterLevel?: {
        type: string;
        value: number;
        observedAt: string;
        unitCode?: string;
    };
    stationID?: {
        type: string;
        value: string;
        observedAt: string;
    };
    currentLevel?: {
        type: string;
        value: number;
        observedAt: string;
    };
    dangerLevel?: {
        type: string;
        value: number;
        observedAt: string;
    };
    alertLevel?: {
        type: string;
        value: number;
        observedAt: string;
    };
    referenceLevel?: {
        type: string;
        value: number;
        observedAt: string;
    };
    measuredDistance?: {
        type: string;
        value: number;
        observedAt: string;
    };
    location?: {
        type: string;
        value: {
            type: string;
            coordinates: [number, number];
        };
    };
    dateObserved?: {
        type: string;
        value: {
            '@type': string;
            '@value': string;
        };
    };
}

export interface FloodMonitoringAPIResponse {
    success: boolean;
    code: number;
    message: string;
    error: string | null;
    result: {
        total: number;
        items: FloodMonitoringData[];
    };
}

/**
 * Fetch latest flood monitoring data
 */
export async function getLatestFloodMonitoring(): Promise<FloodMonitoringData[]> {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/api/v1/flood-monitoring/latest`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data: FloodMonitoringAPIResponse = await response.json();

        if (!data.success || !data.result || !data.result.items) {
            throw new Error(data.error || 'Failed to fetch flood monitoring data');
        }

        return data.result.items;
    } catch (error) {
        console.error('Error fetching flood monitoring data:', error);
        return [];
    }
}
