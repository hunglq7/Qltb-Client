import api from '../../Utils/Api';
const getTonghopaptomatkhoidongtu = () => api.get(`Tonghopaptomatkhoidongtu`);
const addTonghopaptomatkhoidongtu = (data) => api.post(`Tonghopaptomatkhoidongtu/Add`, data);
const updateTonghopaptomatkhoidongtu = (data) => api.put(`Tonghopaptomatkhoidongtu/Update`, data);
const deleteTonghopaptomatkhoidongtu = (id) => api.delete(`Tonghopaptomatkhoidongtu/${id}`);
const deleteTonghopaptomatkhoidongtus = (ids) => api.post(`Tonghopaptomatkhoidongtu/Delete-Multiple`, ids);
const getTonghopaptomatkhoidongtuPaging = (params) => api.get(`Tonghopaptomatkhoidongtu/paging`, { params });
const getTonghopaptomatkhoidongtuSearch = (params) => api.get(`Tonghopaptomatkhoidongtu/search`, { params });
export const tonghopaptomatkhoidongtuService = {
    getTonghopaptomatkhoidongtu,
    addTonghopaptomatkhoidongtu,
    updateTonghopaptomatkhoidongtu,
    deleteTonghopaptomatkhoidongtu,
    deleteTonghopaptomatkhoidongtus,
    getTonghopaptomatkhoidongtuPaging,
    getTonghopaptomatkhoidongtuSearch
};