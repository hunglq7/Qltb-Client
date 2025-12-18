import api from '../../Utils/Api'
const baseURL = `${import.meta.env.VITE_URL}/api`
const getNhatkyById = async (id) => {
    return await api.get(`Nhatkymaycao/DatailById/${id}`).then(response => {
        return response
    })
}

const addNhatkymaycaos = async (datas) => {
    return await api.put(`Nhatkymaycao/UpdateMultiple`, datas).then(response => {
        return response
    })
}
const addNhatkymaycao = async (data) => {
    return await api.post(`Nhatkymaycao/Add`, data).then(response => {
        return response
    })
}

const updateNhatkymaycao = async (data) => {
    return await api.put(`Nhatkymaycao/Update`, data).then(response => {
        return response
    })
}


const deleteNhatkyMaycaos = async (datas) => {
    return await api.post(`Nhatkymaycao/DeleteMultipale`, datas).then(response => {
        return response
    })
}

const deleteNhatkymaycao = async (id) => {
    return await api.delete(`Nhatkymaycao/${id}`).then(response => {
        return response
    })
}


export const nhatkymaycaoService = {
    getNhatkyById,
    addNhatkymaycao,
    addNhatkymaycaos,
    deleteNhatkyMaycaos,
    updateNhatkymaycao,
    deleteNhatkymaycao

}
