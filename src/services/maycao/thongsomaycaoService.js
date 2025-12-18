import api from '../../Utils/Api'
const getThongsomaycao = async () => {
    return await api.get('Thongsokythuatmaycao').then((response) => {
        return response
    });
};


const addThongsomaycao = async (data) => {
    return await api.post(`Thongsokythuatmaycao`, data).then(response => {
        return response
    })
}
const updateThongsomaycao = async (data) => {
    return api.put(`Thongsokythuatmaycao/update`, data).then(response => {
        return response
    })
}
const deleteThongsomaycao = async (id) => {
    return api.delete(`Thongsokythuatmaycao/${id}`).then(response => {
        return response
    })
}
const deleteSelectThongsomaycao = async (data) => {
    return api.post(`Thongsokythuatmaycao/DeleteMultipale`, data).then(response => {
        return response
    })
}
const getThongsomaycaoById = async (id) => {
    return await api.get(`Thongsokythuatmaycao/${id}`).then(response => {
        return response
    })
}

const getThongsomaycaoDetailById = async (id) => {
    return await api.get(`Thongsokythuatmaycao/DetailById/${id}`).then(response => {
        return response
    })
}



export const thongsomaycaoService = {
    getThongsomaycaoById,
    getThongsomaycao,
    addThongsomaycao,
    updateThongsomaycao,
    deleteThongsomaycao,
    deleteSelectThongsomaycao,
    getThongsomaycaoDetailById
}