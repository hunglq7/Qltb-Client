import api from '../../Utils/Api';

const getThongsoquatgio = () =>
  api.get(`Thongsoquatgio`);

const addThongsoquatgio = (data) =>
  api.post(`Thongsoquatgio/Add`, data);

const updateThongsoquatgio = (data) =>
  api.put('Thongsoquatgio/Update', data);

const deleteThongsoquatgio = (id) =>
  api.delete(`Thongsoquatgio/${id}`);

const deleteThongsoquatgios = (ids) =>
  api.post(`Thongsoquatgio/DeleteSelect`, ids);
const getThongsoquatgioDetaiById=(id)=>
  api.get(`Thongsoquatgio/DetailById/${id}`)
export const thongsoquatgioService = {
  getThongsoquatgio,
  addThongsoquatgio,
  updateThongsoquatgio,
  deleteThongsoquatgio,
  deleteThongsoquatgios,
  getThongsoquatgioDetaiById
};