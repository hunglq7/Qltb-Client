import api from '../../Utils/Api';
const getTonghopneo = (params) => api.get(`Tonghopneo`, { params });
const addTonghopneo = (data) => api.post(`Tonghopneo/Add`, data);
const updateTonghopneo = (data) => api.put(`Tonghopneo/Update`, data);
const deleteTonghopneo = (id) => api.delete(`Tonghopneo/Delete/${id}`);
const deleteMultipleTonghopneo = (ids) => api.post(`Tonghopneo/Delete-Multiple`, ids);
export const tonghopneoService = {
  getTonghopneo,
  addTonghopneo,
    updateTonghopneo,
    deleteTonghopneo,
    deleteMultipleTonghopneo
};