/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

interface NominatimAddress {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
}

interface NominatimResponse {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
    name?: string;
    address: NominatimAddress;
}

/**
 * Fetch street name from OpenStreetMap Nominatim API using latitude and longitude
 * @param lat Latitude
 * @param lon Longitude
 * @returns Street name or null if not found
 */
export async function getStreetNameFromCoordinates(
    lat: number,
    lon: number
): Promise<string | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            {
                headers: {
                    'User-Agent': 'Open-Terra/1.0',
                },
                cache: 'force-cache', // Cache the geocoding results
            }
        );

        if (!response.ok) {
            console.error(`Nominatim API error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data: NominatimResponse = await response.json();

        // Try to get the most relevant street name
        // Priority: road > name > display_name (first part)
        if (data.address?.road) {
            // Include suburb/city if available for better context
            const parts = [data.address.road];
            if (data.address.suburb) {
                parts.push(data.address.suburb);
            } else if (data.address.city) {
                parts.push(data.address.city);
            }
            return parts.join(', ');
        }

        if (data.name) {
            return data.name;
        }

        // Fallback to first part of display_name
        if (data.display_name) {
            const firstPart = data.display_name.split(',')[0];
            return firstPart;
        }

        return null;
    } catch (error) {
        console.error('Error fetching street name from coordinates:', error);
        return null;
    }
}

/**
 * Batch fetch street names for multiple coordinates
 * @param coordinates Array of [lon, lat] pairs
 * @returns Array of street names (null for failed lookups)
 */
export async function getStreetNamesFromCoordinates(
    coordinates: Array<[number, number]>
): Promise<Array<string | null>> {
    // Add delay between requests to respect Nominatim usage policy (max 1 request per second)
    const results: Array<string | null> = [];

    for (const [lon, lat] of coordinates) {
        const streetName = await getStreetNameFromCoordinates(lat, lon);
        results.push(streetName);

        // Wait 1 second before next request (Nominatim usage policy)
        if (coordinates.length > 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    return results;
}
