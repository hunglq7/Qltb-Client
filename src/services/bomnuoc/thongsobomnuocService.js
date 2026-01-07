import api from '../../Utils/Api';

const getThongsobomnuoc = () =>
  api.get(`Thongsobomnuoc`);

const addThongsobomnuoc = (data) =>
  api.post(`Thongsobomnuoc/Add`, data);

const updateThongsobomnuoc = (data) =>
  api.put('Thongsobomnuoc/Update', data);

const deleteThongsobomnuoc = (id) =>
  api.delete(`Thongsobomnuoc/${id}`);

const deleteThongsobomnuocs = (ids) =>
  api.post(`Thongsobomnuoc/Delete-Multiple`, ids);

const getThongsobomnuocDetaiById=(id)=>
  api.get(`Thongsokythuattoitruc/DetailById/${id}`)
export const thongsobomnuocService = {
  getThongsobomnuoc,
  addThongsobomnuoc,
  updateThongsobomnuoc,
  deleteThongsobomnuoc,
  deleteThongsobomnuocs,
  getThongsobomnuocDetaiById
};