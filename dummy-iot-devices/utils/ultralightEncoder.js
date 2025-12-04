/**
 * UltraLight 2.0 Protocol Encoder
 * Converts key-value pairs to UltraLight format
 * Example: {temp: 23, hum: 60} => "temp|23|hum|60"
 */

/**
 * Encode data to UltraLight 2.0 format
 * @param {Object} attributes - Key-value pairs to encode
 * @returns {string} UltraLight formatted string
 */
function encode(attributes) {
    const pairs = [];

    for (const [key, value] of Object.entries(attributes)) {
        // Convert boolean to 0/1
        const encodedValue = typeof value === 'boolean' ? (value ? 1 : 0) : value;
        pairs.push(`${key}|${encodedValue}`);
    }

    return pairs.join('|');
}

module.exports = { encode };
