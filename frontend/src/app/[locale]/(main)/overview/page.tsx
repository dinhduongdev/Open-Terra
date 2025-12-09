/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { getTranslations } from 'next-intl/server';
import { getLatestAirQuality, calculateAirQualityOverview } from '@/services/airQualityService';
import { getLatestWeather } from '@/services/weatherService';
import { getLatestFloodMonitoring } from '@/services/floodMonitoringService';
import { getLatestTrafficFlow } from '@/services/trafficFlowService';
import AIAdvisorSection from '@/components/overview/AIAdvisorSection';
import TimeDisplay from '@/components/overview/TimeDisplay';
import { getStreetNameFromCoordinates } from '@/utils/geocoding';
import { generatePageMetadata } from '@/utils/metadata';

export async function generateMetadata() {
  return generatePageMetadata('overview');
}

export default async function OverviewPage() {
    // Get translations for server component
    const t = await getTranslations('overview');

    // Fetch all data server-side
    let airQualityData = null;
    let airQualityStats = null;
    let weatherData = null;
    let floodData = null;
    let trafficData = null;

    try {
        // Fetch air quality data
        airQualityData = await getLatestAirQuality();
        airQualityStats = calculateAirQualityOverview(airQualityData);
    } catch (error) {
        console.error('Failed to fetch air quality data:', error);
    }

    try {
        // Fetch weather data
        weatherData = await getLatestWeather();
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
    }

    try {
        // Fetch traffic flow data
        trafficData = await getLatestTrafficFlow();

        // Fetch street names for traffic sensors
        if (trafficData && trafficData.length > 0) {
            const streetNamePromises = trafficData.map(async (sensor) => {
                if (sensor.location?.value?.coordinates) {
                    const [lon, lat] = sensor.location.value.coordinates;
                    return await getStreetNameFromCoordinates(lat, lon);
                }
                return null;
            });
            const streetNames = await Promise.all(streetNamePromises);

            // Attach street names to traffic data
            trafficData = trafficData.map((sensor, index) => ({
                ...sensor,
                streetName: streetNames[index],
            }));
        }
    } catch (error) {
        console.error('Failed to fetch traffic flow data:', error);
    }

    try {
        // Fetch flood monitoring data
        floodData = await getLatestFloodMonitoring();

        // Fetch street names for flood stations
        if (floodData && floodData.length > 0) {
            const streetNamePromises = floodData.map(async (station) => {
                if (station.location?.value?.coordinates) {
                    const [lon, lat] = station.location.value.coordinates;
                    return await getStreetNameFromCoordinates(lat, lon);
                }
                return null;
            });
            const streetNames = await Promise.all(streetNamePromises);

            // Attach street names to flood data
            floodData = floodData.map((station, index) => ({
                ...station,
                streetName: streetNames[index],
            }));
        }
    } catch (error) {
        console.error('Failed to fetch flood monitoring data:', error);
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h1 className="text-4xl font-bold text-gray-900">
                            {t('title')}
                        </h1>
                        <div className="mt-4 md:mt-0">
                            <TimeDisplay />
                        </div>
                    </div>
                    <p className="text-gray-800">
                        {t('subtitle')}
                    </p>
                </div>

                {/* Introduction Section */}
                <section className="mb-8 bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        {t('introduction.title')}
                    </h2>
                    <p className="text-gray-800 leading-relaxed">
                        {t('introduction.description')}
                    </p>
                </section>

                {/* AI Advisor Section - Client Component */}
                <AIAdvisorSection />

                {/* Statistics Overview */}
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        {t('statistics.title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Air Quality Stats */}
                        {airQualityStats && (
                            <>
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <div className="text-sm text-gray-800 mb-2">
                                        {t('statistics.averageAqi')}
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {airQualityStats.averageAqi.toFixed(0)}
                                    </div>
                                    <div className="text-xs text-gray-800 mt-1">
                                        {t('airQuality.title')}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <div className="text-sm text-gray-800 mb-2">
                                        {t('statistics.aqStations')}
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {airQualityStats.totalStations}
                                    </div>
                                    <div className="text-xs text-gray-800 mt-1">
                                        {t('statistics.totalStations')}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Weather Stats */}
                        {weatherData && weatherData.temperature && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="text-sm text-gray-800 mb-2">
                                    {t('statistics.temperature')}
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {weatherData.temperature.value.toFixed(1)}°C
                                </div>
                                <div className="text-xs text-gray-800 mt-1">
                                    {weatherData.areaServed?.value || t('weather.area')}
                                </div>
                            </div>
                        )}

                        {/* Flood Stats */}
                        {floodData && floodData.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="text-sm text-gray-800 mb-2">
                                    {t('statistics.floodPoints')}
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {floodData.length}
                                </div>
                                <div className="text-xs text-gray-800 mt-1">
                                    {t('statistics.monitoring')}
                                </div>
                            </div>
                        )}

                        {/* Traffic Stats */}
                        {trafficData && trafficData.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="text-sm text-gray-800 mb-2">
                                    {t('statistics.trafficSensors')}
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {trafficData.length}
                                </div>
                                <div className="text-xs text-gray-800 mt-1">
                                    {t('statistics.active')}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Air Quality Monitoring Stations */}
                {airQualityData && airQualityData.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            {t('airQuality.title')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {airQualityData.map((station) => (
                                <div
                                    key={station.id}
                                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {station.name}
                                    </h3>
                                    <p className="text-sm text-gray-800 mb-4">
                                        {station.areaServed}
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-800">AQI</span>
                                            <span className={`text-lg font-bold ${station.airQualityIndex.value <= 50
                                                ? 'text-green-600'
                                                : station.airQualityIndex.value <= 100
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                                }`}>
                                                {station.airQualityIndex.value}
                                            </span>
                                        </div>

                                        {station.pm25 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-800">PM2.5</span>
                                                <span className="text-sm font-medium text-gray-800">
                                                    {station.pm25.value.toFixed(1)} {station.pm25.unitCode}
                                                </span>
                                            </div>
                                        )}

                                        {station.temperature && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-800">{t('weather.temperature')}</span>
                                                <span className="text-sm font-medium text-gray-800">
                                                    {station.temperature.value.toFixed(1)}°C
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Weather Information */}
                {weatherData && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            {t('weather.title')}
                        </h2>
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {weatherData.areaServed?.value || t('weather.area')}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {weatherData.temperature && (
                                    <div>
                                        <div className="text-sm text-gray-800 mb-1">{t('weather.temperature')}</div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {weatherData.temperature.value.toFixed(1)}°C
                                        </div>
                                    </div>
                                )}
                                {weatherData.relativeHumidity && (
                                    <div>
                                        <div className="text-sm text-gray-800 mb-1">{t('weather.humidity')}</div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {(weatherData.relativeHumidity.value * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                )}
                                {weatherData.atmosphericPressure && (
                                    <div>
                                        <div className="text-sm text-gray-800 mb-1">{t('weather.pressure')}</div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {weatherData.atmosphericPressure.value} hPa
                                        </div>
                                    </div>
                                )}
                                {weatherData.windSpeed && (
                                    <div>
                                        <div className="text-sm text-gray-800 mb-1">{t('weather.wind')}</div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {weatherData.windSpeed.value.toFixed(1)} m/s
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Traffic Flow */}
                {trafficData && trafficData.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            {t('traffic.title')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {trafficData.map((sensor) => {
                                // Use pre-fetched street name or fallback to address or default
                                const displayName = (sensor as any).streetName ||
                                    sensor.address?.value?.streetAddress ||
                                    t('traffic.sensor');

                                return (
                                    <div
                                        key={sensor.id}
                                        className="bg-white rounded-xl shadow-lg p-6"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {displayName}
                                            </h3>
                                            {sensor.congested && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${sensor.congested.value
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {sensor.congested.value ? t('traffic.congested') : t('traffic.clear')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            {sensor.averageVehicleSpeed && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-800">{t('traffic.averageSpeed')}</span>
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {sensor.averageVehicleSpeed.value.toFixed(1)} km/h
                                                    </span>
                                                </div>
                                            )}
                                            {sensor.occupancy && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-800">{t('traffic.density')}</span>
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {(sensor.occupancy.value * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Flood Monitoring */}
                {floodData && floodData.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            {t('flood.title')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {floodData.map((station) => {
                                // Use pre-fetched street name or fallback to address or default
                                const displayName = (station as any).streetName ||
                                    station.address?.value?.streetAddress ||
                                    station.stationID?.value ||
                                    t('flood.monitoringPoint');

                                return (
                                    <div
                                        key={station.id}
                                        className="bg-white rounded-xl shadow-lg p-6"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {displayName}
                                            </h3>
                                            {station.floodLevelStatus && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${station.floodLevelStatus.value === 'Danger' || station.floodLevelStatus.value === 'Critical'
                                                    ? 'bg-red-100 text-red-700'
                                                    : station.floodLevelStatus.value === 'Warning'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {station.floodLevelStatus.value}
                                                </span>
                                            )}
                                        </div>
                                        {station.description && (
                                            <p className="text-sm text-gray-800 mb-3">
                                                {station.description.value}
                                            </p>
                                        )}
                                        <div className="space-y-2">
                                            {station.currentLevel && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-800">{t('flood.currentLevel')}</span>
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {station.currentLevel.value.toFixed(2)} m
                                                    </span>
                                                </div>
                                            )}
                                            {station.waterLevel && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-800">{t('flood.waterLevel')}</span>
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {station.waterLevel.value} {station.waterLevel.unitCode || 'cm'}
                                                    </span>
                                                </div>
                                            )}
                                            {station.dangerLevel && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-800">{t('flood.dangerLevel')}</span>
                                                    <span className="text-sm font-medium text-red-600">
                                                        {station.dangerLevel.value.toFixed(2)} m
                                                    </span>
                                                </div>
                                            )}
                                            {station.alertLevel && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-800">{t('flood.alertLevel')}</span>
                                                    <span className="text-sm font-medium text-yellow-600">
                                                        {station.alertLevel.value.toFixed(2)} m
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Error State */}
                {!airQualityData && !weatherData && !floodData && !trafficData && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                        <p className="text-yellow-800">
                            {t('error.noData')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
