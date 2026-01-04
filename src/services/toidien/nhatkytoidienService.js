import api from '../../Utils/Api';

const getNhatkyById = (id) =>
  api.get(`NhatkyTonghoptoitruc/tonghop/${id}`);

const addNhatkyTonghoptoitruc = (data) =>
  api.post(`NhatkyTonghoptoitruc`, data);

const updateNhatkyTonghoptoitruc = (id,data) =>
  api.put(`NhatkyTonghoptoitruc/${id}`, data);

const deleteNhatkyTonghoptoitruc = (id) =>
  api.delete(`NhatkyTonghoptoitruc/${id}`);

const deleteNhatkyTonghoptoitrucs = (ids) =>
  api.post(`NhatkyTonghoptoitruc/delete-multiple`, ids);

export const nhatkyTonghoptoitrucService = {
  getNhatkyById,
  addNhatkyTonghoptoitruc,
  updateNhatkyTonghoptoitruc,
  deleteNhatkyTonghoptoitruc,
  deleteNhatkyTonghoptoitrucs
};