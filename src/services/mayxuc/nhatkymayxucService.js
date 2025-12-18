import api from '../../Utils/Api'
const baseURL = `${import.meta.env.VITE_URL}/api`
const getNhatkyById = async (id) => {
    return await api.get(`Nhatkymayxuc/DatailById/${id}`).then(response => {
        return response
    })
}

const addNhatkymayxucs = async (datas) => {
    return await api.put(`Nhatkymayxuc/UpdateMultiple`, datas).then(response => {
        return response
    })
}
const addNhatkymayxuc = async (data) => {
    return await api.post(`Nhatkymayxuc/Add`, data).then(response => {
        return response
    })
}

const updateNhatkymayxuc = async (data) => {
    return await api.put(`Nhatkymayxuc/Update`, data).then(response => {
        return response
    })
}


const deleteNhatkyMayxucs = async (datas) => {
    return await api.post(`Nhatkymayxuc/DeleteMultipale`, datas).then(response => {
        return response
    })
}

const deleteNhatkymayxuc = async (id) => {
    return await api.delete(`Nhatkymayxuc/${id}`).then(response => {
        return response
    })
}


export const nhatkymayxucService = {
    getNhatkyById,
    addNhatkymayxuc,
    addNhatkymayxucs,
    deleteNhatkyMayxucs,
    updateNhatkymayxuc,
    deleteNhatkymayxuc

}
