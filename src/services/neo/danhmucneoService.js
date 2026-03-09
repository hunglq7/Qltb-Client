import api from '../../Utils/Api';
const getDanhmucneo = () => api.get(`DanhmucNeo`);
const addDanhmucneo = (data) => api.post(`DanhmucNeo/Add`, data);
const updateDanhmucneo = (data) => api.put(`DanhmucNeo/Update`, data);
const deleteDanhmucneo = (id) => api.delete(`DanhmucNeo/Delete/${id}`);
const deleteDanhmucneos = (ids) => api.post(`DanhmucNeo/Delete-Multiple`, ids);
export const danhmucneoService = {
    getDanhmucneo,
    addDanhmucneo,
    updateDanhmucneo,
    deleteDanhmucneo,
    deleteDanhmucneos
};