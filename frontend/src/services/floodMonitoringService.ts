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
            const getProp = (longKey: string, shortKey: string) => ngsiData[longKey] || ngsiData[shortKey];

            const description = getProp('description', 'description'); // Key is just 'description' mostly? Check schema. Simple name usually safe.
            const address = getProp('https://smartdatamodels.org/address', 'address');
            const floodLevelStatus = getProp('https://smartdatamodels.org/dataModel.Environment/floodLevelStatus', 'floodLevelStatus');
            const waterLevel = getProp('https://smartdatamodels.org/dataModel.Environment/waterLevel', 'waterLevel');
            const stationID = getProp('https://smartdatamodels.org/stationID', 'stationID');
            const currentLevel = getProp('https://smartdatamodels.org/dataModel.Environment/currentLevel', 'currentLevel');
            const dangerLevel = getProp('https://smartdatamodels.org/dataModel.Environment/dangerLevel', 'dangerLevel');
            const alertLevel = getProp('https://smartdatamodels.org/dataModel.Environment/alertLevel', 'alertLevel');
            const referenceLevel = getProp('https://smartdatamodels.org/dataModel.Environment/referenceLevel', 'referenceLevel');
            const measuredDistance = getProp('https://smartdatamodels.org/dataModel.Environment/measuredDistance', 'measuredDistance');
            const dateObserved = getProp('https://smartdatamodels.org/dateObserved', 'dateObserved');

            return {
                id: ngsiData.id,
                type: ngsiData.type,
                description: description ? {
                    type: description.type,
                    value: description.value,
                    observedAt: description.observedAt
                } : undefined,
                address: address ? {
                    type: address.type,
                    value: {
                        streetAddress: address.value.streetAddress
                    }
                } : undefined,
                floodLevelStatus: floodLevelStatus ? {
                    type: floodLevelStatus.type,
                    value: floodLevelStatus.value,
                    observedAt: floodLevelStatus.observedAt
                } : undefined,
                waterLevel: waterLevel ? {
                    type: waterLevel.type,
                    value: waterLevel.value,
                    observedAt: waterLevel.observedAt,
                    unitCode: waterLevel.unitCode
                } : undefined,
                stationID: stationID ? {
                    type: stationID.type,
                    value: stationID.value,
                    observedAt: stationID.observedAt
                } : undefined,
                currentLevel: currentLevel ? {
                    type: currentLevel.type,
                    value: currentLevel.value,
                    observedAt: currentLevel.observedAt
                } : undefined,
                dangerLevel: dangerLevel ? {
                    type: dangerLevel.type,
                    value: dangerLevel.value,
                    observedAt: dangerLevel.observedAt
                } : undefined,
                alertLevel: alertLevel ? {
                    type: alertLevel.type,
                    value: alertLevel.value,
                    observedAt: alertLevel.observedAt
                } : undefined,
                referenceLevel: referenceLevel ? {
                    type: referenceLevel.type,
                    value: referenceLevel.value,
                    observedAt: referenceLevel.observedAt
                } : undefined,
                measuredDistance: measuredDistance ? {
                    type: measuredDistance.type,
                    value: measuredDistance.value,
                    observedAt: measuredDistance.observedAt
                } : undefined,
                location: {
                    type: ngsiData.location.value.type,
                    value: {
                        type: ngsiData.location.value.type,
                        coordinates: ngsiData.location.value.coordinates
                    }
                },
                dateObserved: {
                    type: dateObserved?.type,
                    value: {
                        '@type': dateObserved?.value?.['@type'],
                        '@value': dateObserved?.value?.['@value'] || dateObserved?.value
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
