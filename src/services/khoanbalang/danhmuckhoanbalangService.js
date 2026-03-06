import api from '../../Utils/Api';
const getDanhmuckhoanbalang = () =>
  api.get(`DanhmucKhoanBalang`);
const addDanhmuckhoanbalang = (data) =>
  api.post(`DanhmucKhoanBalang/Add`, data);
const updateDanhmuckhoanbalang = (data) =>
  api.put(`DanhmucKhoanBalang/Update`, data);
const deleteDanhmuckhoanbalang = (id) =>
  api.delete(`DanhmucKhoanBalang/Delete/${id}`);
const deleteDanhmuckhoanbalangs = (ids) =>
  api.post(`DanhmucKhoanBalang/Delete-Multiple`, ids);
export const danhmuckhoanbalangService = {  
  getDanhmuckhoanbalang,
  addDanhmuckhoanbalang,
  updateDanhmuckhoanbalang,
  deleteDanhmuckhoanbalang,
  deleteDanhmuckhoanbalangs
};
