import apiClient from "@config/apiClient";
import { ENDPOINTS } from "@config/apiConfig";

export const doctorService = {
  // Vaccinations list (optionally by branch)
  getVaccinations: async (branchId = null, params = {}) => {
    const q = { ...params };
    if (branchId) q.branchId = branchId;
    const response = await apiClient.get(ENDPOINTS.SERVICES.VACCINATIONS.LIST, {
      params: q,
    });
    return response.data;
  },

  // Examinations / medical records
  getExaminations: async (branchId = null, params = {}) => {
    const q = { ...params };
    if (branchId) q.branchId = branchId;
    const response = await apiClient.get(ENDPOINTS.SERVICES.EXAMINATIONS.LIST, {
      params: q,
    });
    return response.data;
  },

  getVaccinationDetails: async (vaccinationId) => {
    if (!vaccinationId) return { success: false, data: [] };
    const response = await apiClient.get(
      `${ENDPOINTS.SERVICES.VACCINATIONS.LIST}/${vaccinationId}/details`
    );
    return response.data;
  },

  // Doctor schedule by employee id

  // Create a new medical examination (Bác sĩ tạo hồ sơ khám mới)
  createMedicalExamination: async (payload) => {
    if (!payload) throw new Error("payload required");
    const response = await apiClient.post(
      ENDPOINTS.SERVICES.EXAMINATIONS.CREATE,
      payload
    );
    return response.data;
  },

  // Update an existing examination (Bác sĩ edits a Kham_benh)
  updateExamination: async (examinationId, payload, doctorId) => {
    if (!examinationId) throw new Error("examinationId required");
    const response = await apiClient.put(
      ENDPOINTS.SERVICES.EXAMINATIONS.UPDATE(examinationId),
      payload
    );
    return response.data;
  },

  // Add prescriptions to an examination: payload { prescriptions: [ { MaSP, SoLuong }, ... ] }
  addPrescriptions: async (examinationId, prescriptions, doctorId) => {
    if (!examinationId) throw new Error("examinationId required");
    const response = await apiClient.post(
      ENDPOINTS.SERVICES.EXAMINATIONS.PRESCRIPTIONS(examinationId),
      { prescriptions }
    );
    return response.data;
  },

  // Get prescriptions for an examination
  getPrescriptions: async (examinationId) => {
    if (!examinationId) throw new Error("examinationId required");
    const response = await apiClient.get(
      ENDPOINTS.SERVICES.EXAMINATIONS.PRESCRIPTIONS(examinationId)
    );
    return response.data;
  },

  // Update vaccination details for a session: payload { details: [ { MaSP, LieuLuong, TrangThai }, ... ] }
  updateVaccinationDetails: async (vaccinationId, details) => {
    if (!vaccinationId) return null;
    const response = await apiClient.put(
      ENDPOINTS.SERVICES.VACCINATIONS.DETAILS(vaccinationId),
      { details }
    );
    return response.data;
  },
};

export default doctorService;
