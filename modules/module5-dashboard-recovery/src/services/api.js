/**
 * api.js — single entry point for ALL backend calls.
 *
 * Set VITE_USE_MOCK=true in .env to use the synthetic mockApi instead of the
 * real Module 2 backend. Swap the base URL by setting VITE_API_BASE_URL.
 *
 * Assumed endpoints (adapt once api_contract.md is agreed on Day 2):
 *   GET  /reports          — list reports (optional ?status=&area=)
 *   PATCH /reports/:id     — update status, assigned_volunteer
 *   GET  /incidents        — list past incidents
 *   POST /incidents        — create new incident
 *   PATCH /incidents/:id
 *   GET  /resources        — list resources
 *   PATCH /resources/:id   — toggle availability
 *   GET  /households
 *   GET  /alerts           — AI-generated draft alerts
 *   POST /alerts/:id/approve
 *   POST /alerts/:id/reject
 *   POST /retrain          — trigger model retraining (Module 3)
 *   GET  /volunteers
 */

import * as mock from './mockApi.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// ─── HTTP helper ────────────────────────────────────────────────
async function http(method, path, body = null) {
  const token = localStorage.getItem('agrim_token');
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

const qs = (params) => {
  const s = new URLSearchParams(params).toString();
  return s ? `?${s}` : '';
};

// ─── Reports ────────────────────────────────────────────────────
export const getReports    = (params) => USE_MOCK ? mock.getReports(params)    : http('GET',   `/reports${qs(params)}`);
export const patchReport   = (id, body) => USE_MOCK ? mock.patchReport(id, body) : http('PATCH', `/reports/${id}`, body);

// ─── Incidents ──────────────────────────────────────────────────
export const getIncidents  = (params) => USE_MOCK ? mock.getIncidents(params)  : http('GET',   `/incidents${qs(params)}`);
export const postIncident  = (body)   => USE_MOCK ? mock.postIncident(body)   : http('POST',  '/incidents', body);
export const patchIncident = (id, body) => USE_MOCK ? mock.patchIncident(id, body) : http('PATCH', `/incidents/${id}`, body);

// ─── Resources ──────────────────────────────────────────────────
export const getResources  = (params) => USE_MOCK ? mock.getResources(params)  : http('GET',   `/resources${qs(params)}`);
export const patchResource = (id, body) => USE_MOCK ? mock.patchResource(id, body) : http('PATCH', `/resources/${id}`, body);

// ─── Households ─────────────────────────────────────────────────
export const getHouseholds = (params) => USE_MOCK ? mock.getHouseholds(params) : http('GET',   `/households${qs(params)}`);

// ─── Alerts ─────────────────────────────────────────────────────
export const getAlerts     = (params) => USE_MOCK ? mock.getAlerts(params)     : http('GET',   `/alerts${qs(params)}`);
export const approveAlert  = (id, approver) => USE_MOCK ? mock.approveAlert(id, approver) : http('POST', `/alerts/${id}/approve`, approver);
export const rejectAlert   = (id, reason)   => USE_MOCK ? mock.rejectAlert(id, reason)   : http('POST', `/alerts/${id}/reject`,  { reason });

// ─── Retrain ────────────────────────────────────────────────────
export const postRetrain   = ()        => USE_MOCK ? mock.postRetrain()        : http('POST',  '/retrain');

// ─── Volunteers ─────────────────────────────────────────────────
export const getVolunteers = (params) => USE_MOCK ? mock.getVolunteers(params) : http('GET',   `/volunteers${qs(params)}`);
