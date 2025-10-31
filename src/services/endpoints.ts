import { get } from "react-hook-form";
import api from "./api";
import { createSession } from "react-router-dom";

export const auth = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  register: (data: { email: string; password: string }) =>
    api.post("/auth/register", data),
  recoveryPasswordRequest: (data: { email: string }) =>
    api.post("/auth/request-password-reset", data),
  resetPassword: (data: { newPassword: string; token: string }) =>
    api.patch("/auth/reset-password", data),
  verify: (params: { token: string }) =>
    api.get(`auth/verify-email`, { params }),
  // refreshToken: () => api.post("/refresh"),
  // logout: () => api.post("/logout"),
};

export const user = {
  profile: () => api.get("/users/profile"),
  updateProfile: (data: any) => api.patch("/users/update-name", data),
};

export const plans = {
  getAll: () => api.get("/plans"),
};

export const subscriptions = {
  getMySubscription: () => api.get("/subscriptions"),
  createSession: (planId: number) =>
    api.post(`/subscriptions/checkout-session`, { planId }),
  verifySession: (sessionId: string) =>
    api.get(`/subscriptions/verify-session`, {
      params: { session_id: sessionId },
    }),
  cancelSubscription: () => api.post(`/subscriptions/cancel`),
};

export const companies = {
  getCompanies: (params?: Record<string, any>) =>
    api.get("/company-data", { params }),
  createCompany: (data: any) => api.post("/company-data", data),
  updateCompany: (id: string, data: any) =>
    api.patch(`/company-data/${id}`, data),
};

export const packages = {
  getPackages: (params?: Record<string, any>) =>
    api.get("/packages", { params }),
  createPackage: (data: any) => api.post("/packages", data),
  updatePackage: (id: string, data: any) => api.patch(`/packages/${id}`, data),
  desactivePackage: (id: string) => api.post(`/packages/${id}/desactive`),
  reactivePackage: (id: string) => api.post(`/packages/${id}/reactive`),
};

export const groups = {
  getGroups: (params?: Record<string, any>) => api.get("/groups", { params }),
  getGroupById: (id: string) => api.get(`/groups/${id}`),
  createGroup: (data: any) => api.post("/groups", data),
  updateGroup: (id: string, data: any) => api.patch(`/groups/${id}`, data),
  desactiveGroup: (id: string) => api.post(`/groups/${id}/desactive`),
  reactiveGroup: (id: string) => api.post(`/groups/${id}/reactive`),
};

export const events = {
  getEvents: (params?: Record<string, any>) => api.get("/events", { params }),
  getRequests: (params?: Record<string, any>) =>
    api.get("/events/requests", { params }),
  getFolio: () => api.get<any>("/events/generate-folio"),
  getEventById: (id: string) => api.get(`/events/${id}`),
  getEventByIdClient: (id: string) => api.get(`/events/client/${id}`),
  getStripeValidation: (id: string) =>
    api.get(`/events/client/user-stripe-check/${id}`),
  createEvent: (data: any) => api.post("/events", data),
  cancelEvent: (id: string) => api.post(`/events/${id}/desactive`),
  reactiveEvent: (id: string) => api.post(`/events/${id}/reactive`),
  startEvent: (id: string) => api.post(`/events/${id}/start`),
  finishEvent: (id: string) => api.post(`/events/${id}/finish`),
  updateEvent: (id: string, data: any) => api.patch(`/events/${id}`, data),
};

export const songs = {
  getSongs: (params?: Record<string, any>) => api.get("/songs", { params }),
};

export const eventMusic = {
  createSession: (data: any) => api.post("/event-music/create-session", data),
  completeEventMusic: (data: any) => api.post("/event-music/complete", data),
  changeToPaid: (data: any) => api.post("/event-music/paid", data),
  getEventMusicBySessionId: (params: Record<string, any>) =>
    api.get("/event-music", { params }),
};

export const stripe = {
  account: () => api.get("/stripe/account"),
  getStatus: () => api.post("/stripe/verify"),
};
