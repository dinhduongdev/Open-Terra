/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { TrafficReport } from '@/components/common/TrafficReportForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '')
  : 'https://sta-backend.open-terra.io.vn';

interface TrafficReportAPIResponse {
  total: number;
  items: Array<{
    id: number;
    uuid: string;
    reporter_username: string;
    latitude: number;
    longitude: number;
    street_name: string;
    status: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    description: string;
    photo_urls?: string[];
    created_at: string;
    updated_at: string | null;
    verified_by_user_id: number | null;
    verified_at: string | null;
  }>;
}

/**
 * Fetch traffic reports from API
 */
export async function getTrafficReports(skip: number = 0, limit: number = 20, status?: 'Reported' | 'Verified'): Promise<TrafficReport[]> {
  try {
    let url = `${API_BASE_URL}/api/v1/traffic-reports?skip=${skip}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: TrafficReportAPIResponse = await response.json();

    // Transform API response to TrafficReport format
    return data.items.map(item => ({
      id: item.uuid,
      numeric_id: item.id,
      reporter_username: item.reporter_username,
      latitude: item.latitude,
      longitude: item.longitude,
      street_name: item.street_name,
      severity: item.severity,
      description: item.description,
      photo_urls: item.photo_urls,
      timestamp: item.created_at,
      status: item.status,
      created_at: item.created_at,
    }));
  } catch (error) {
    console.error('Error fetching traffic reports:', error);
    throw error;
  }
}

/**
 * Verify a traffic report
 */
export async function verifyTrafficReport(reportId: number): Promise<TrafficReport> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/traffic-reports/${reportId}/verify`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        report_id: reportId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform response to TrafficReport format
    return {
      id: data.uuid || data.id,
      numeric_id: data.id,
      reporter_username: data.reporter_username,
      latitude: data.latitude,
      longitude: data.longitude,
      street_name: data.street_name,
      severity: data.severity,
      description: data.description,
      photo_urls: data.photo_urls,
      timestamp: data.created_at,
      status: data.status,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error('Error verifying traffic report:', error);
    throw error;
  }
}

/**
 * Submit a new traffic report
 */
export async function submitTrafficReport(report: Omit<TrafficReport, 'id' | 'timestamp' | 'status'>): Promise<TrafficReport> {
  try {
    // Prepare payload matching API expected format
    const payload = {
      reporter_username: report.reporter_username,
      latitude: report.latitude,
      longitude: report.longitude,
      street_name: report.street_name,
      severity: report.severity,
      description: report.description,
      photo_urls: report.photo_urls || [],
    };

    const response = await fetch(`${API_BASE_URL}/api/v1/traffic-reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Transform response to TrafficReport format
    return {
      id: data.uuid || data.id,
      reporter_username: data.reporter_username,
      latitude: data.latitude,
      longitude: data.longitude,
      street_name: data.street_name,
      severity: data.severity,
      description: data.description,
      photo_urls: data.photo_urls,
      timestamp: data.created_at,
      status: data.status || 'Reported',
      created_at: data.created_at,
    };
  } catch (error) {
    console.error('Error submitting traffic report:', error);
    throw error;
  }
}
