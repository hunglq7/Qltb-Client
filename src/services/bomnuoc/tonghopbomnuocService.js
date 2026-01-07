import api from '../../Utils/Api';

const getTonghopbomnuoc = () =>
  api.get(`Tonghopbomnuoc`);
const getTonghopbomnuocPaging=(data)=>
  api.get('Tonghopbomnuoc/search',{params: data})
const addTonghopbomnuoc = (data) =>
  api.post(`Tonghopbomnuoc/Add`, data);

const updateTonghopbomnuoc = (data) =>
  api.put('Tonghopbomnuoc/Update', data);

const deleteTonghopbomnuoc = (id) =>
  api.delete(`Tonghopbomnuoc/${id}`);

const deleteTonghopbomnuocs = (ids) =>
  api.post(`Tonghopbomnuoc/Delete-Multiple`, ids);

const getTonghopbomnuocDetaiById=(id)=>
  api.get(`Tonghopbomnuoc/DetailById/${id}`)
export const tonghopbomnuocService = {
  getTonghopbomnuoc,
  getTonghopbomnuocPaging,
  addTonghopbomnuoc,
  updateTonghopbomnuoc,
  deleteTonghopbomnuoc,
  deleteTonghopbomnuocs,
  getTonghopbomnuocDetaiById
};