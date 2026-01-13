import api from '../../Utils/Api';

const getCapnhatgiacot = () =>
  api.get(`Capnhatgiacot`);

const addCapnhatgiacot = (data) =>
  api.post(`Capnhatgiacot/Add`, data);

const updateCapnhatgiacot = (data) =>
  api.put('Capnhatgiacot/Update', data);

const deleteCapnhatgiacot = (id) =>
  api.delete(`Capnhatgiacot/${id}`);

const deleteCapnhatgiacots = (ids) =>
  api.post(`Capnhatgiacot/DeleteSelect`, ids);

export const capnhatgiacotService = {
  getCapnhatgiacot,
  addCapnhatgiacot,
  updateCapnhatgiacot,
  deleteCapnhatgiacot,
  deleteCapnhatgiacots
};