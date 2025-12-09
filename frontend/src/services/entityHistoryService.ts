/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { ExportParams, ExportInfo } from '@/types/entityHistory';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const entityHistoryService = {
  /**
   * Export temporal/historical data for IoT entities
   */
  async exportEntityHistory(params: ExportParams): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/v1/entity-history/export?${queryParams}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to export entity history');
    }

    return response.blob();
  },

  /**
   * Get information about the export endpoint capabilities
   */
  async getExportInfo(): Promise<ExportInfo> {
    const response = await fetch(`${API_BASE_URL}/v1/entity-history/info`);

    if (!response.ok) {
      throw new Error('Failed to load export information');
    }

    return response.json();
  },

  /**
   * Download exported file
   */
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  /**
   * Get filename from Content-Disposition header or generate default
   */
  getFilename(
    response: Response,
    entityType: string,
    format: string
  ): string {
    const disposition = response.headers.get('Content-Disposition');
    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);
      if (match) return match[1];
    }
    return `export_${entityType}_${Date.now()}.${format}`;
  },
};
