import api from '../../Utils/Api';

const getTonghopRole = () =>
  api.get(`TonghopRole`);

const addTonghopRole = (data) =>
  api.post(`TonghopRole/Add`, data);

const updateTonghopRole = (data) =>
  api.put('TonghopRole/Update', data);

const deleteTonghopRole = (id) =>
  api.delete(`TonghopRole/${id}`);

const deleteTonghopRoles = (ids) =>
  api.post(`TonghopRole/DeleteSelect`, ids);

export const TonghopRoleService = {
  getTonghopRole,
  addTonghopRole,
  updateTonghopRole,
  deleteTonghopRole,
  deleteTonghopRoles
};