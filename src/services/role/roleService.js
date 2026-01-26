import api from '../../Utils/Api';

const getDanhmucrole = () =>
  api.get(`Danhmucrole`);

const addDanhmucrole = (data) =>
  api.post(`Danhmucrole/Add`, data);

const updateDanhmucrole = (data) =>
  api.put('Danhmucrole/Update', data);

const deleteDanhmucrole = (id) =>
  api.delete(`Danhmucrole/${id}`);

const deleteDanhmucroles = (ids) =>
  api.post(`Danhmucrole/DeleteSelect`, ids);

export const danhmucroleService = {
  getDanhmucrole,
  addDanhmucrole,
  updateDanhmucrole,
  deleteDanhmucrole,
  deleteDanhmucroles
};