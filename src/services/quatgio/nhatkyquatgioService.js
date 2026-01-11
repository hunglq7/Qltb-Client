import api from '../../Utils/Api';

const getNhatkyById = (id) =>
  api.get(`Nhatkyquatgio/tonghopquatgioId/${id}`);

const addNhatkyquatgio = (data) =>
  api.post(`Nhatkyquatgio/Add`, data);

const updateNhatkyquatgio = (data) =>
  api.put(`Nhatkyquatgio/Update`, data);

const deleteNhatkyquatgio = (id) =>
  api.delete(`Nhatkyquatgio/${id}`);

const deleteNhatkyquatgios = (ids) =>
  api.post(`Nhatkyquatgio/DeleteSelect`, ids);

export const nhatkyquatgioService = {
  getNhatkyById,
  addNhatkyquatgio,
  updateNhatkyquatgio,
  deleteNhatkyquatgio,
  deleteNhatkyquatgios
};