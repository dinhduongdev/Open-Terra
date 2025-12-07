/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

export interface AIAdvisorDataSources {
    traffic: boolean;
    flood: boolean;
    air_quality: boolean;
    weather: boolean;
}

export interface AIAdvisorResult {
    advice: string;
    data_sources: AIAdvisorDataSources;
    timestamp: string;
}

export interface AIAdvisorAPIResponse {
    success: boolean;
    code: number;
    message: string;
    error: string | null;
    result: AIAdvisorResult;
}
