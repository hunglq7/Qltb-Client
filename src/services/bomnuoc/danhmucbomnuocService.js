import api from '../../Utils/Api';

const getDanhmucbomnuoc = () =>
  api.get(`Danhmucbomnuoc`);

const addDanhmucbomnuoc = (data) =>
  api.post(`Danhmucbomnuoc/Add`, data);

const updateDanhmucbomnuoc = (data) =>
  api.put('Danhmucbomnuoc/Update', data);

const deleteDanhmucbomnuoc = (id) =>
  api.delete(`Danhmucbomnuoc/${id}`);

const deleteDanhmucbomnuocs = (ids) =>
  api.post(`Danhmucbomnuoc/Delete-Multiple`, ids);

export const danhmucbomnuocService = {
  getDanhmucbomnuoc,
  addDanhmucbomnuoc,
  updateDanhmucbomnuoc,
  deleteDanhmucbomnuoc,
  deleteDanhmucbomnuocs
};