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
    // Check if we're on the server
    if (typeof window === 'undefined') {
        if (process.env.API_URL) {
            return process.env.API_URL;
        }
        if (process.env.NEXT_PUBLIC_API_URL) {
            return process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '');
        }
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

        interface NGSIWeather {
            [key: string]: any;
        }

        /**
         * Transform NGSI-LD formatted data to simplified structure
         */
        function transformNGSILDToWeather(ngsiData: NGSIWeather): WeatherData {
            return {
                id: ngsiData.id,
                type: ngsiData.type,
                location: {
                    type: ngsiData.location.value.type,
                    value: {
                        coordinates: ngsiData.location.value.coordinates,
                        type: ngsiData.location.value.type
                    }
                },
                dateObserved: {
                    type: ngsiData['https://smartdatamodels.org/dateObserved']?.type,
                    value: {
                        '@type': ngsiData['https://smartdatamodels.org/dateObserved']?.value?.['@type'],
                        '@value': ngsiData['https://smartdatamodels.org/dateObserved']?.value?.['@value'] || ngsiData['https://smartdatamodels.org/dateObserved']?.value
                    }
                },
                address: {
                    type: ngsiData['https://smartdatamodels.org/address']?.type,
                    value: {
                        addressCountry: ngsiData['https://smartdatamodels.org/address']?.value?.addressCountry,
                        addressLocality: ngsiData['https://smartdatamodels.org/address']?.value?.addressLocality
                    }
                },
                areaServed: {
                    type: ngsiData['https://smartdatamodels.org/areaServed']?.type,
                    value: ngsiData['https://smartdatamodels.org/areaServed']?.value
                },
                atmosphericPressure: ngsiData['https://smartdatamodels.org/dataModel.Weather/atmosphericPressure'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Weather/atmosphericPressure'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Weather/atmosphericPressure'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/atmosphericPressure'].observedAt,
                    unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/atmosphericPressure'].unitCode
                } : undefined,
                temperature: ngsiData['https://smartdatamodels.org/dataModel.Weather/temperature'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Weather/temperature'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Weather/temperature'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/temperature'].observedAt,
                    unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/temperature'].unitCode
                } : undefined,
                relativeHumidity: ngsiData['https://smartdatamodels.org/dataModel.Weather/relativeHumidity'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Weather/relativeHumidity'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Weather/relativeHumidity'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/relativeHumidity'].observedAt,
                    unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/relativeHumidity'].unitCode
                } : undefined,
                windSpeed: ngsiData['https://smartdatamodels.org/dataModel.Weather/windSpeed'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Weather/windSpeed'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Weather/windSpeed'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/windSpeed'].observedAt,
                    unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/windSpeed'].unitCode
                } : undefined,
                precipitation: ngsiData['https://smartdatamodels.org/dataModel.Weather/precipitation'] ? {
                    type: ngsiData['https://smartdatamodels.org/dataModel.Weather/precipitation'].type,
                    value: ngsiData['https://smartdatamodels.org/dataModel.Weather/precipitation'].value,
                    observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/precipitation'].observedAt,
                    unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/precipitation'].unitCode
                } : undefined
            };
        }

        return transformNGSILDToWeather(data.result);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}
