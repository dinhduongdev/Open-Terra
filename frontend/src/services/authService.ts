/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  is_superuser: boolean;
}

export async function loginAdmin(credentials: LoginRequest): Promise<LoginResponse> {
  const formData = new FormData();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await fetch(`${API_BASE_URL}/v1/login`, {
    method: 'POST',
    body: formData,
    credentials: 'include', 
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(error.detail || 'Login failed');
  }

  return response.json();
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  return response.json();
}

export async function refreshAccessToken(): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
}

export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
