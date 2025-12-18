import api from '../../Utils/Api'
const updateDanhmucmayxucs = async (data) => {
    return api.put(`Danhmucmayxuc/UpdateMultiple`, data).then(response => {
        return response
    })
}

const deleteDanhmucmayxucs = async (data) => {
    return api.post(`Danhmucmayxuc/DeleteMultipale`, data).then(response => {
        return response
    })
}



const getDanhmucmayxucs = async () => {
    return await api.get('Danhmucmayxuc').then((response) => {
        return response
    });
};

export const danhmucmayxucService = {
    getDanhmucmayxucs,
    updateDanhmucmayxucs,
    deleteDanhmucmayxucs,

}