import api from '../../Utils/Api';

const getNhatkyById = (id) =>
  api.get(`Nhatkymayxuc/tonghop/${id}`);

const addNhatkymayxuc = (data) =>
  api.post(`Nhatkymayxuc`, data);

const updateNhatkymayxuc = (id,data) =>
  api.put(`Nhatkymayxuc/${id}`, data);

const deleteNhatkymayxuc = (id) =>
  api.delete(`Nhatkymayxuc/${id}`);

const deleteNhatkyMayxucs = (ids) =>
  api.post(`Nhatkymayxuc/delete-multiple`, ids);

export const nhatkymayxucService = {
  getNhatkyById,
  addNhatkymayxuc,
  updateNhatkymayxuc,
  deleteNhatkymayxuc,
  deleteNhatkyMayxucs
};