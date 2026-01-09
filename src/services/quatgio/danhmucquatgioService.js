import api from '../../Utils/Api';

const getDanhmucquatgio = () =>
  api.get(`Danhmucquatgio`);

const addDanhmucquatgio = (data) =>
  api.post(`Danhmucquatgio/Add`, data);

const updateDanhmucquatgio = (data) =>
  api.put('Danhmucquatgio/Update', data);

const deleteDanhmucquatgio = (id) =>
  api.delete(`Danhmucquatgio/${id}`);

const deleteDanhmucquatgios = (ids) =>
  api.post(`Danhmucquatgio/DeleteSelect`, ids);

export const danhmucquatgioService = {
  getDanhmucquatgio,
  addDanhmucquatgio,
  updateDanhmucquatgio,
  deleteDanhmucquatgio,
  deleteDanhmucquatgios
};