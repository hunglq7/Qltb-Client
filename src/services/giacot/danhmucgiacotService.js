import api from '../../Utils/Api';

const getDanhmucgiacot = () =>
  api.get(`Danhmucgiacot`);

const addDanhmucgiacot = (data) =>
  api.post(`Danhmucgiacot/Add`, data);

const updateDanhmucgiacot = (data) =>
  api.put('Danhmucgiacot/Update', data);

const deleteDanhmucgiacot = (id) =>
  api.delete(`Danhmucgiacot/${id}`);

const deleteDanhmucgiacots = (ids) =>
  api.post(`Danhmucgiacot/DeleteSelect`, ids);

export const danhmucgiacotService = {
  getDanhmucgiacot,
  addDanhmucgiacot,
  updateDanhmucgiacot,
  deleteDanhmucgiacot,
  deleteDanhmucgiacots
};