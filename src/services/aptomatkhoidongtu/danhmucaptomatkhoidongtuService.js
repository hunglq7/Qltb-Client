import api from '../../Utils/Api';
const getDanhmucaptomatkhoidongtu = () => api.get(`DanhmucAptomatKhoidongtu`);
const addDanhmucaptomatkhoidongtu = (data) => api.post(`DanhmucAptomatKhoidongtu/Add`, [data]);
const updateDanhmucaptomatkhoidongtu = (data) => api.put(`DanhmucAptomatKhoidongtu/Update`, [data]);
const deleteDanhmucaptomatkhoidongtu = (id) => api.delete(`DanhmucAptomatKhoidongtu/${id}`);
const deleteDanhmucaptomatkhoidongtus = (ids) => api.post(`DanhmucAptomatKhoidongtu/Delete-Multiple`, ids);
export const danhmucaptomatkhoidongtuService = {
    getDanhmucaptomatkhoidongtu,
    addDanhmucaptomatkhoidongtu,
    updateDanhmucaptomatkhoidongtu,
    deleteDanhmucaptomatkhoidongtu,
    deleteDanhmucaptomatkhoidongtus
};