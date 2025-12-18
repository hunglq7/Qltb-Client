import api from '../../Utils/Api'
const getMaycao = async () => {
    return await api.get('Tonghopmaycao/getAll').then((response) => {
        return response
    });
};

const getMaycaoById = async (id) => {
    return await api.get(`Tonghopmaycao/${id}`).then((response) => {
        return response
    });
};
const addTonghopmaycao = async (data) => {
    return api.post(`Tonghopmaycao`, data).then(response => {
        return response
    })
}
const updateTonghopmaycao = async (data) => {
    return api.put(`Tonghopmaycao/update`, data).then(response => {
        return response
    })
}
const deleteMaycao = async (id) => {
    return await api.delete(`Tonghopmaycao/${id}`).then(response => {
        return response
    })
}

const deleteMaycaos = async (datas) => {
    return await api.post(`Tonghopmaycao/DeleteMultipale`, datas).then(response => {
        return response
    })
}

export const tonghopquatgioService = {
    getMaycao,
    getMaycaoById,
    deleteMaycao,
    deleteMaycaos,
    addTonghopmaycao,
    updateTonghopmaycao,

}
