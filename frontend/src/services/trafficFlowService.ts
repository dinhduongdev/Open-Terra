/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

// For server-side rendering, use localhost directly. For client-side, use NEXT_PUBLIC_API_URL
// For server-side rendering, use localhost directly. For client-side, use NEXT_PUBLIC_API_URL
const getApiBaseUrl = () => {
    if (typeof window === 'undefined') {
        if (process.env.API_URL) {
            return process.env.API_URL;
        }
        if (process.env.NEXT_PUBLIC_API_URL) {
            return process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '');
        }
        return 'http://localhost:8000';
    }
    return process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '')
        : 'http://localhost:8000';
};

export interface TrafficFlowData {
    id: string;
    type: string;
    averageVehicleSpeed?: {
        type: string;
        value: number;
        observedAt: string;
    };
    congested?: {
        type: string;
        value: boolean;
        observedAt: string;
    };
    intensity?: {
        type: string;
        value: number;
        observedAt: string;
    };
    laneId?: {
        type: string;
        value: number;
        observedAt: string;
    };
    occupancy?: {
        type: string;
        value: number;
        observedAt: string;
    };
    dateObserved?: {
        type: string;
        value: {
            '@type': string;
            '@value': string;
        };
        observedAt: string;
    };
    location?: {
        type: string;
        value: {
            type: string;
            coordinates: [number, number];
        };
    };
    address?: {
        type: string;
        value: {
            streetAddress?: string;
            addressLocality?: string;
        };
    };
}

export interface TrafficFlowAPIResponse {
    success: boolean;
    code: number;
    message: string;
    error: string | null;
    result: {
        total: number;
        items: TrafficFlowData[];
    };
}

/**
 * Fetch latest traffic flow data
 */
export async function getLatestTrafficFlow(): Promise<TrafficFlowData[]> {
    try {
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/api/v1/traffic-flow-observed/latest`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data: TrafficFlowAPIResponse = await response.json();

        if (!data.success || !data.result || !data.result.items) {
            throw new Error(data.error || 'Failed to fetch traffic flow data');
        }

        interface NGSITraffic {
            [key: string]: any;
        }

        /**
         * Transform NGSI-LD formatted data to simplified structure
         */
        function transformNGSILDToTraffic(ngsiData: NGSITraffic): TrafficFlowData {
            return {
                id: ngsiData.id,
                type: ngsiData.type,
                averageVehicleSpeed: ngsiData['https://smartdatamodels.org/dataModel.Transportation/averageVehicleSpeed'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Transportation/averageVehicleSpeed'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Transportation/averageVehicleSpeed'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Transportation/averageVehicleSpeed'].observedAt
                } : undefined,
                congested: ngsiData['https://smartdatamodels.org/dataModel.Transportation/congested'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Transportation/congested'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Transportation/congested'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Transportation/congested'].observedAt
                } : undefined,
                intensity: ngsiData['https://smartdatamodels.org/dataModel.Transportation/intensity'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Transportation/intensity'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Transportation/intensity'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Transportation/intensity'].observedAt
                } : undefined,
                laneId: ngsiData['https://smartdatamodels.org/dataModel.Transportation/laneId'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Transportation/laneId'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Transportation/laneId'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Transportation/laneId'].observedAt
                } : undefined,
                occupancy: ngsiData['https://smartdatamodels.org/dataModel.Transportation/occupancy'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Transportation/occupancy'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Transportation/occupancy'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Transportation/occupancy'].observedAt
                } : undefined,
                dateObserved: {
                    type: ngsiData['https://smartdatamodels.org/dateObserved']?.type,
                    value: {
                        '@type': ngsiData['https://smartdatamodels.org/dateObserved']?.value?.['@type'],
                        '@value': ngsiData['https://smartdatamodels.org/dateObserved']?.value?.['@value'] || ngsiData['https://smartdatamodels.org/dateObserved']?.value
                    },
                    observedAt: ngsiData['https://smartdatamodels.org/dateObserved']?.observedAt
                },
                location: {
                    type: ngsiData.location.value.type,
                    value: {
                        type: ngsiData.location.value.type,
                        coordinates: ngsiData.location.value.coordinates
                    }
                },
                address: {
                    type: ngsiData['https://smartdatamodels.org/address']?.type,
                    value: {
                        streetAddress: ngsiData['https://smartdatamodels.org/address']?.value?.streetAddress,
                        addressLocality: ngsiData['https://smartdatamodels.org/address']?.value?.addressLocality
                    }
                }
            };
        }

        return data.result.items.map(transformNGSILDToTraffic);
    } catch (error) {
        console.error('Error fetching traffic flow data:', error);
        return [];
    }
}
