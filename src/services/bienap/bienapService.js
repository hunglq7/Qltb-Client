import api from '../../Utils/Api';

const getDanhmucBienap = () => api.get(`DanhmucBienap`);

const addDanhmucBienap = (data) => api.post(`DanhmucBienap/Add`, data);

const updateDanhmucBienap = (data) => api.put('DanhmucBienap/Update', data);

const deleteDanhmucBienap = (id) => api.delete(`DanhmucBienap/${id}`);

const deleteDanhmucBienaps = (ids) => api.post(`DanhmucBienap/DeleteSelect`, ids);

export const danhmucBienapService = {
  getDanhmucBienap,
  addDanhmucBienap,
  updateDanhmucBienap,
  deleteDanhmucBienap,
  deleteDanhmucBienaps
};
