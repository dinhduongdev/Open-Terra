/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

export enum FeedbackCategory {
  GENERAL = "General",
  BUG_REPORT = "Bug Report",
  FEATURE_REQUEST = "Feature Request",
  IMPROVEMENT = "Improvement",
  OTHER = "Other"
}

export enum FeedbackStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  RESOLVED = "resolved",
  REJECTED = "rejected"
}

export interface FeedbackCreateRequest {
  username: string;
  email: string;
  category: FeedbackCategory;
  message: string;
}

export interface FeedbackResponse {
  id: number;
  uuid: string;
  username: string;
  email: string;
  category: FeedbackCategory;
  message: string;
  status?: FeedbackStatus;
  created_at: string;
  updated_at: string | null;
}

export interface FeedbackListResponse {
  total: number;
  items: FeedbackResponse[];
}

export interface FeedbackUpdateRequest {
  status: FeedbackStatus;
}
