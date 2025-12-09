/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

/**
 * Lunar Calendar Utility
 * Calculates lunar dates for tidal predictions
 * Based on simplified astronomical calculations
 */

/**
 * Calculate Julian Day Number from Gregorian date
 * @param {number} year
 * @param {number} month (1-12)
 * @param {number} day
 * @returns {number} Julian Day Number
 */
function getJulianDayNumber(year, month, day) {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    
    let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    if (jd < 2299161) {
        jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
    }
    
    return jd;
}

/**
 * Convert Gregorian date to Lunar date
 * @param {Date} date - Gregorian date (will be converted to Ho Chi Minh timezone UTC+7)
 * @returns {Object} {day, month, year, isFullMoon, isNewMoon}
 */
function getLunarDate(date) {
    // Convert to Ho Chi Minh City timezone (UTC+7)
    const hcmcTime = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    const year = hcmcTime.getFullYear();
    const month = hcmcTime.getMonth() + 1;
    const day = hcmcTime.getDate();
    
    const jd = getJulianDayNumber(year, month, day);
    
    // New moon reference: January 6, 2000
    const knownNewMoon = getJulianDayNumber(2000, 1, 6);
    const synodicMonth = 29.53058867; // Average length of lunar month in days
    
    // Calculate lunar age (days since new moon)
    const daysSinceKnownNewMoon = jd - knownNewMoon;
    const lunarAge = daysSinceKnownNewMoon % synodicMonth;
    
    // Calculate lunar day (1-30)
    const lunarDay = Math.floor(lunarAge) + 1;
    
    // Determine if it's full moon (around day 15) or new moon (around day 1)
    const isFullMoon = lunarDay >= 14 && lunarDay <= 16; // Rằm (14-16)
    const isNewMoon = lunarDay <= 2 || lunarDay >= 29;    // Mùng 1 (29-2)
    
    return {
        day: lunarDay,
        isFullMoon,
        isNewMoon,
        lunarAge: lunarAge
    };
}

/**
 * Check if current date is in tidal surge period (rằm or mùng 1 ±1-2 days)
 * @param {Date} date
 * @returns {Object} {isTidalPeriod, intensity}
 */
function checkTidalSurge(date) {
    const lunar = getLunarDate(date);
    const day = lunar.day;
    
    // Full moon period (rằm): days 13-17 (±2 days from day 15)
    const isFullMoonPeriod = day >= 13 && day <= 17;
    
    // New moon period (mùng 1): days 28-30 and 1-3 (±2 days from day 1)
    const isNewMoonPeriod = day >= 28 || day <= 3;
    
    const isTidalPeriod = isFullMoonPeriod || isNewMoonPeriod;
    
    // Calculate tidal intensity (0-1)
    let intensity = 0;
    if (isFullMoonPeriod) {
        // Peak at day 15, decrease towards 13 and 17
        intensity = 1 - Math.abs(day - 15) / 2;
    } else if (isNewMoonPeriod) {
        // Peak at day 1 (or 30)
        const distanceFromNewMoon = day <= 3 ? day - 1 : 30 - day;
        intensity = 1 - distanceFromNewMoon / 2;
    }
    
    return {
        isTidalPeriod,
        intensity: Math.max(0, Math.min(1, intensity)),
        lunarDay: day,
        isFullMoon: lunar.isFullMoon,
        isNewMoon: lunar.isNewMoon
    };
}

module.exports = {
    getLunarDate,
    checkTidalSurge
};
