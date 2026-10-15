// src/services/api.js — Centralised HTTP layer with Organizer Auth and full endpoint coverage
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Organizer Session Storage ──────────────────────────────
const TOKEN_KEY = 'acet_organizer_token_v1';
const SITE_PASS_KEY = 'acet_site_pass_v1';

export const getOrganizerToken = () => sessionStorage.getItem(TOKEN_KEY) || '';
export const setOrganizerToken = (token) => sessionStorage.setItem(TOKEN_KEY, token);
export const clearOrganizerToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(SITE_PASS_KEY);
};

export const getSitePassword = () =>
  sessionStorage.getItem(SITE_PASS_KEY) || localStorage.getItem(SITE_PASS_KEY) || '';
export const setSitePassword = (pwd) => {
  sessionStorage.setItem(SITE_PASS_KEY, pwd);
  localStorage.setItem(SITE_PASS_KEY, pwd);
};

// Attach organizer token and site password to outgoing requests
api.interceptors.request.use((config) => {
  const token = getOrganizerToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['x-organizer-token'] = token;
  }
  const sitePass = getSitePassword();
  if (sitePass) {
    config.headers['x-organizer-password'] = sitePass;
  }
  return config;
});

// Helper to resolve uploaded images / signatures to full URLs
export const getUploadUrl = (urlOrPath) => {
  if (!urlOrPath) return '';
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://') || urlOrPath.startsWith('data:')) {
    return urlOrPath;
  }
  const host = BASE_URL.replace(/\/api\/?$/, '');
  const cleanPath = urlOrPath.replace(/^\//, '');
  return `${host}/${cleanPath}`;
};

// ── Event Endpoints ─────────────────────────────────────────
export const fetchEvent = () =>
  api.get('/events').then((r) => r.data);

export const updateEvent = (eventData) =>
  api.put('/events', eventData).then((r) => r.data);

// ── Faculty Endpoints ───────────────────────────────────────
export const fetchFaculty = () =>
  api.get('/faculty').then((r) => r.data);

export const fetchFacultyById = (id) =>
  api.get(`/faculty/${id}`).then((r) => r.data);

/**
 * Add a new faculty member.
 * Supports both object payload and legacy positional arguments.
 */
export const addFaculty = (dataOrName, maybeDesignation, maybePassword) => {
  let payload;
  if (typeof dataOrName === 'object' && dataOrName !== null) {
    payload = dataOrName;
  } else {
    payload = {
      name: dataOrName,
      designation: maybeDesignation,
      password: maybePassword,
    };
  }
  return api.post('/faculty', payload).then((r) => r.data);
};

/**
 * Update an existing faculty member.
 */
export const updateFaculty = (id, data) =>
  api.put(`/faculty/${id}`, data).then((r) => r.data);

/**
 * Delete an existing faculty member.
 */
export const deleteFaculty = (id) =>
  api.delete(`/faculty/${id}`).then((r) => r.data);

// ── Organizer Authentication Endpoints ──────────────────────
export const verifyOrganizerPassword = (password) =>
  api.post('/organizer/login', { password }).then((r) => {
    if (r.data?.token) {
      setOrganizerToken(r.data.token);
    }
    return r.data;
  });

export const checkOrganizerAuth = () =>
  api.get('/organizer/check').then((r) => r.data);

// ── Invitations / Signatures Endpoints ───────────────────────
export const fetchStats = () =>
  api.get('/invitations/stats').then((r) => r.data);

/**
 * Submit a signature for a faculty member.
 * @param {string} facultyId      MongoDB ObjectId
 * @param {Blob}   signatureBlob  PNG blob from canvas
 * @param {string} signatureDataURL Base64 dataURL from canvas
 */
export const submitSignature = (facultyId, signatureBlob, signatureDataURL) => {
  const form = new FormData();
  form.append('facultyId', facultyId);
  if (signatureBlob) {
    form.append('signature', signatureBlob, 'signature.png');
  }
  if (signatureDataURL) {
    form.append('signatureData', signatureDataURL);
  }
  return api.post('/invitations/sign', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

export default api;
