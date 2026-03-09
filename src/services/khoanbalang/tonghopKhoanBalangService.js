import api from '../../Utils/Api';
const getTonghopKhoanBalang = (params) => api.get(`TonghopKhoanBalang`, { params });
const addTonghopKhoanBalang = (data) => api.post(`TonghopKhoanBalang/Add`, data);
const updateTonghopKhoanBalang = (data) => api.put(`TonghopKhoanBalang/Update`, data);
const deleteTonghopKhoanBalang = (id) => api.delete(`TonghopKhoanBalang/Delete/${id}`);
const deleteTonghopKhoanBalangs = (ids) => api.post(`TonghopKhoanBalang/Delete-Multiple`, ids);
export const tonghopKhoanBalangService = {
  getTonghopKhoanBalang,
  addTonghopKhoanBalang,
  updateTonghopKhoanBalang,
  deleteTonghopKhoanBalang,
  deleteTonghopKhoanBalangs
};
