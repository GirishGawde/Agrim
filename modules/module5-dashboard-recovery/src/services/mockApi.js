// Mock API — used when VITE_USE_MOCK=true
// All data is 100 % synthetic; no real names, phones or addresses.
import { MOCK_REPORTS, MOCK_INCIDENTS, MOCK_RESOURCES, MOCK_HOUSEHOLDS, MOCK_ALERTS, MOCK_VOLUNTEERS } from './mockData.js';

const delay = (ms = 350) => new Promise(r => setTimeout(r, ms));

// Mutable in-memory state so actions feel live
let reports    = structuredClone(MOCK_REPORTS);
let incidents  = structuredClone(MOCK_INCIDENTS);
let resources  = structuredClone(MOCK_RESOURCES);
let households = structuredClone(MOCK_HOUSEHOLDS);
let alerts     = structuredClone(MOCK_ALERTS);

// ─── Reports ────────────────────────────────────────────────────
export async function getReports(params = {}) {
  await delay();
  let data = [...reports];
  if (params.status) data = data.filter(r => r.status === params.status);
  if (params.area)   data = data.filter(r => r.area  === params.area);
  return { data, total: data.length };
}

export async function patchReport(id, body) {
  await delay(200);
  reports = reports.map(r => r.id === id ? { ...r, ...body, updated_at: new Date().toISOString() } : r);
  return reports.find(r => r.id === id);
}

// ─── Incidents ──────────────────────────────────────────────────
export async function getIncidents(params = {}) {
  await delay();
  let data = [...incidents];
  if (params.hazard) data = data.filter(i => i.hazard_type === params.hazard);
  if (params.area)   data = data.filter(i => i.area        === params.area);
  if (params.from)   data = data.filter(i => i.date >= params.from);
  if (params.to)     data = data.filter(i => i.date <= params.to);
  return { data, total: data.length };
}

export async function postIncident(body) {
  await delay(400);
  const incident = { id: `inc-${Date.now()}`, ...body, created_at: new Date().toISOString() };
  incidents = [incident, ...incidents];
  return incident;
}

export async function patchIncident(id, body) {
  await delay(200);
  incidents = incidents.map(i => i.id === id ? { ...i, ...body } : i);
  return incidents.find(i => i.id === id);
}

// ─── Resources ──────────────────────────────────────────────────
export async function getResources(params = {}) {
  await delay();
  let data = [...resources];
  if (params.type) data = data.filter(r => r.type === params.type);
  return { data, total: data.length };
}

export async function patchResource(id, body) {
  await delay(200);
  resources = resources.map(r => r.id === id ? { ...r, ...body } : r);
  return resources.find(r => r.id === id);
}

// ─── Households ─────────────────────────────────────────────────
export async function getHouseholds(params = {}) {
  await delay();
  let data = [...households];
  if (params.area) data = data.filter(h => h.area === params.area);
  return { data, total: data.length };
}

// ─── Alerts ─────────────────────────────────────────────────────
export async function getAlerts(params = {}) {
  await delay();
  let data = [...alerts];
  if (params.status) data = data.filter(a => a.status === params.status);
  return { data, total: data.length };
}

export async function approveAlert(id, approver) {
  await delay(300);
  alerts = alerts.map(a => a.id === id ? {
    ...a,
    status: 'approved',
    approved_by: approver.name,
    approved_at: new Date().toISOString(),
  } : a);
  return alerts.find(a => a.id === id);
}

export async function rejectAlert(id, reason) {
  await delay(300);
  alerts = alerts.map(a => a.id === id ? {
    ...a,
    status: 'rejected',
    reject_reason: reason,
    rejected_at: new Date().toISOString(),
  } : a);
  return alerts.find(a => a.id === id);
}

// ─── Retrain ────────────────────────────────────────────────────
export async function postRetrain() {
  await delay(800);
  return { status: 'ok', message: 'Mock retraining triggered. In production this calls /retrain on Module 3.' };
}

// ─── Volunteers ─────────────────────────────────────────────────
export async function getVolunteers(params = {}) {
  await delay();
  let data = [...MOCK_VOLUNTEERS];
  if (params.area) data = data.filter(v => v.area === params.area);
  return { data, total: data.length };
}
