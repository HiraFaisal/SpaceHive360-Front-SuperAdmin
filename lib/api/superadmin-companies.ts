import api from "./axios";

export interface Company {
  companyId: string;
  companyName: string;
  email: string;
  status: string;
  createdAt: string;
  contactPersonName?: string;
  remarks?: string;
}

export const getPendingCompanies = async (): Promise<Company[]> => {
  const response = await api.get("/api/superadmin/companies/pending");
  return response.data;
};

export const getAllCompanies = async (): Promise<Company[]> => {
  const response = await api.get("/api/superadmin/companies");
  return response.data;
};

export const approveCompany = async (id: string, remarks: string = ""): Promise<void> => {
  await api.post(`/api/superadmin/companies/${id}/approve`, { remarks });
};

export const rejectCompany = async (id: string, remarks: string): Promise<void> => {
  await api.post(`/api/superadmin/companies/${id}/reject`, { remarks });
};

export const markAsUnderReview = async (id: string, remarks: string = ""): Promise<void> => {
  await api.post(`/api/superadmin/companies/${id}/review`, { remarks });
};
