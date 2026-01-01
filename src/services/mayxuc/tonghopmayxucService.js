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
    return api.post(`Tonghopmayxuc/Add`, data).then(response => {
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
    return await api.post(`Tonghopmayxuc/DeleteMultiple`, datas).then(response => {
        return response
    })
}

export const tonghopmayxucService = {
    getMayxuc,
    getMayxucById,
    deleteMayxuc,
    deleteMayxucs,
    addTonghopmayxuc,
    updateTonghopmayxuc,

}
