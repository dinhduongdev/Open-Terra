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

        interface NGSIFlood {
            [key: string]: any;
        }

        /**
         * Transform NGSI-LD formatted data to simplified structure
         */
        function transformNGSILDToFlood(ngsiData: NGSIFlood): FloodMonitoringData {
            return {
                id: ngsiData.id,
                type: ngsiData.type,
                description: ngsiData['description'] ? {
                    type: ngsiData['description'].type,
                    value: ngsiData['description'].value,
                    observedAt: ngsiData['description'].observedAt
                } : undefined,
                address: ngsiData['https://smartdatamodels.org/address'] ? {
                    type: ngsiData['https://smartdatamodels.org/address'].type,
                    value: {
                        streetAddress: ngsiData['https://smartdatamodels.org/address'].value.streetAddress
                    }
                } : undefined,
                floodLevelStatus: ngsiData['https://smartdatamodels.org/dataModel.Environment/floodLevelStatus'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Environment/floodLevelStatus'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Environment/floodLevelStatus'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/floodLevelStatus'].observedAt
                } : undefined,
                waterLevel: ngsiData['https://smartdatamodels.org/dataModel.Environment/waterLevel'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Environment/waterLevel'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Environment/waterLevel'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/waterLevel'].observedAt,
                    unitCode: ngsiData['https://smartdatamodels.org/dataModel.Environment/waterLevel'].unitCode
                } : undefined,
                stationID: ngsiData['https://smartdatamodels.org/stationID'] ? {
                    type: ngsiData['https://smartdatamodels.org/stationID'].type,
                    value: ngsiData['https://smartdatamodels.org/stationID'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/stationID'].observedAt
                } : undefined,
                currentLevel: ngsiData['https://smartdatamodels.org/dataModel.Environment/currentLevel'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Environment/currentLevel'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Environment/currentLevel'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/currentLevel'].observedAt
                } : undefined,
                dangerLevel: ngsiData['https://smartdatamodels.org/dataModel.Environment/dangerLevel'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Environment/dangerLevel'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Environment/dangerLevel'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/dangerLevel'].observedAt
                } : undefined,
                alertLevel: ngsiData['https://smartdatamodels.org/dataModel.Environment/alertLevel'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Environment/alertLevel'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Environment/alertLevel'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/alertLevel'].observedAt
                } : undefined,
                referenceLevel: ngsiData['https://smartdatamodels.org/dataModel.Environment/referenceLevel'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Environment/referenceLevel'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Environment/referenceLevel'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/referenceLevel'].observedAt
                } : undefined,
                measuredDistance: ngsiData['https://smartdatamodels.org/dataModel.Environment/measuredDistance'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Environment/measuredDistance'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Environment/measuredDistance'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/measuredDistance'].observedAt
                } : undefined,
                location: {
                    type: ngsiData.location.value.type,
                    value: {
                        type: ngsiData.location.value.type,
                        coordinates: ngsiData.location.value.coordinates
                    }
                },
                dateObserved: {
                    type: ngsiData['https://smartdatamodels.org/dateObserved']?.type,
                    value: {
                        '@type': ngsiData['https://smartdatamodels.org/dateObserved']?.value?.['@type'],
                        '@value': ngsiData['https://smartdatamodels.org/dateObserved']?.value?.['@value'] || ngsiData['https://smartdatamodels.org/dateObserved']?.value
                    }
                }
            };
        }

        return data.result.items.map(transformNGSILDToFlood);
    } catch (error) {
        console.error('Error fetching flood monitoring data:', error);
        return [];
    }
}
