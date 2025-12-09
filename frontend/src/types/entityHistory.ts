/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

export type ExportFormat = 'json' | 'csv';

export interface ExportParams {
  entity_type: string;
  format: ExportFormat;
  entity_id?: string;
  start_time?: string;
  end_time?: string;
  last_n?: number;
  attrs?: string;
  tenant?: string;
}

export interface ExportInfo {
  success: boolean;
  code: number;
  message: string;
  error: null;
  result: {
    endpoint: string;
    supported_formats: string[];
    common_entity_types: string[];
    query_methods: {
      time_range: {
        description: string;
        parameters: string[];
        example: string;
      };
      last_n: {
        description: string;
        parameters: string[];
        example: string;
      };
    };
    examples: Array<{
      description: string;
      url: string;
    }>;
  };
}
