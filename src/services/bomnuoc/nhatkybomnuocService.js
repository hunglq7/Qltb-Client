import api from '../../Utils/Api';

const getNhatkyById = (id) =>
  api.get(`Nhatkybomnuoc/DatailById/${id}`);

const addNhatkybomnuoc = (data) =>
  api.post(`Nhatkybomnuoc/Add`, data);

const updateNhatkybomnuoc = (data) =>
  api.put(`Nhatkybomnuoc/Update`, data);

const deleteNhatkybomnuoc = (id) =>
  api.delete(`Nhatkybomnuoc/${id}`);

const deleteNhatkybomnuocs = (ids) =>
  api.post(`Nhatkybomnuoc/DeleteSelect`, ids);

export const nhatkybomnuocService = {
  getNhatkyById,
  addNhatkybomnuoc,
  updateNhatkybomnuoc,
  deleteNhatkybomnuoc,
  deleteNhatkybomnuocs
};