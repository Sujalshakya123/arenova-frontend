import api from "../api/axios";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const submitContact = (payload: ContactPayload) =>
  api.post<{ message: string }>("/api/contact", payload);
