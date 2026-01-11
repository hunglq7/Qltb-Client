import api from '../../Utils/Api';

const getTonghopquatgio = () =>
  api.get(`Tonghopquatgio/getAll`);
const getTonghopquatgioPaging=(data)=>
  api.get('Tonghopquatgio/search',{params: data})
const addTonghopquatgio = (data) =>
  api.post(`Tonghopquatgio/Add`, data);

const updateTonghopquatgio = (data) =>
  api.put('Tonghopquatgio/Update', data);

const deleteTonghopquatgio = (id) =>
  api.delete(`Tonghopquatgio/${id}`);

const deleteTonghopquatgios = (ids) =>
  api.post(`Tonghopquatgio/DeleteSelect`, ids);

export const tonghopquatgioService = {
  getTonghopquatgio,
  addTonghopquatgio,
  updateTonghopquatgio,
  deleteTonghopquatgio,
  deleteTonghopquatgios,
  getTonghopquatgioPaging
};