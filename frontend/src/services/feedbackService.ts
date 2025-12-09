/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import {
  FeedbackCreateRequest,
  FeedbackResponse,
  FeedbackListResponse,
  FeedbackCategory,
  FeedbackUpdateRequest,
} from '@/types/feedback';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const feedbackService = {
  /**
   * Submit user feedback
   */
  async createFeedback(data: FeedbackCreateRequest): Promise<FeedbackResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to submit feedback');
    }

    return response.json();
  },

  /**
   * List all feedback with optional filtering and pagination
   */
  async listFeedback(
    category?: FeedbackCategory,
    skip: number = 0,
    limit: number = 20
  ): Promise<FeedbackListResponse> {
    const params = new URLSearchParams({
      skip: String(skip),
      limit: String(limit),
    });

    if (category) {
      params.append('category', category);
    }

    const response = await fetch(`${API_BASE_URL}/v1/feedback?${params}`);

    if (!response.ok) {
      throw new Error('Failed to load feedback list');
    }

    return response.json();
  },

  /**
   * Get detailed information about a specific feedback
   */
  async getFeedbackById(feedbackId: number): Promise<FeedbackResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/feedback/${feedbackId}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Feedback with ID ${feedbackId} not found`);
      }
      throw new Error('Failed to load feedback details');
    }

    return response.json();
  },

  /**
   * Update feedback status (admin only)
   */
  async updateFeedbackStatus(
    feedbackId: number,
    data: FeedbackUpdateRequest
  ): Promise<FeedbackResponse> {
    const response = await fetch(`${API_BASE_URL}/v1/feedback/${feedbackId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update feedback status');
    }

    return response.json();
  },
};
