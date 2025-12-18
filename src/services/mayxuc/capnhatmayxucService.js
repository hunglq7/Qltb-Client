import api from '../../Utils/Api'
const getMayxuc = async () => {
    return await api.get('Tonghopmayxuc').then((response) => {
        return response
    });
};

const getMayxucById = async (id) => {
    return await api.get(`Tonghopmayxuc/${id}`).then((response) => {
        return response
    });
};
const addTonghopmayxuc = async (data) => {
    return api.post(`Tonghopmayxuc`, data).then(response => {
        return response
    })
}
const updateTonghopmayxuc = async (data) => {
    return api.put(`Tonghopmayxuc/update`, data).then(response => {
        return response
    })
}
const deleteMayxuc = async (id) => {
    return await api.delete(`Tonghopmayxuc/${id}`).then(response => {
        return response
    })
}

const deleteMayxucs = async (datas) => {
    return await api.post(`Tonghopmayxuc/DeleteMultipale`, datas).then(response => {
        return response
    })
}

export const capnhatmayxucService = {
    getMayxuc,
    getMayxucById,
    deleteMayxuc,
    deleteMayxucs,
    addTonghopmayxuc,
    updateTonghopmayxuc,

}
