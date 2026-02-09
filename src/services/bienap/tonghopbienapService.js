import api from '../../Utils/Api';

const getTonghopbienap = () =>
  api.get(`Tonghopbienap`);

const addTonghopbienap = (data) =>
  api.post(`Tonghopbienap/Add`, data);

const updateTonghopbienap = (data) =>
  api.put('Tonghopbienap/Update', data);

const deleteTonghopbienap = (id) =>
  api.delete(`Tonghopbienap/${id}`);

const deleteTonghopbienaps = (ids) =>
  api.post(`Tonghopbienap/DeleteSelect`, ids);

export const tonghopbienapService = {
  getTonghopbienap,
  addTonghopbienap,
  updateTonghopbienap,
  deleteTonghopbienap,
  deleteTonghopbienaps
};