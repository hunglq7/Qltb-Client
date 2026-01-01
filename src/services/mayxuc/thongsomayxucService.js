import api from '../../Utils/Api'


const getThongsomayxuc = async () => {
    return await api.get('Thongsokythuatmayxuc').then((response) => {
        return response
    });
};


const addThongsomayxuc = async (data) => {
    return await api.post(`Thongsokythuatmayxuc`, data).then(response => {
        return response
    })
}
const updateThongsomayxuc = async (id,data) => {
    const mayxucs={
        id:id,
        ...data
    }
    return api.put(`Thongsokythuatmayxuc/update`,mayxucs).then(response => {
        return response
    })
}
const deleteThongsomayxuc = async (id) => {
    return api.delete(`Thongsokythuatmayxuc/${id}`).then(response => {
        return response
    })
}
const deleteSelectThongsomayxuc = async (ids=[]) => {
    return api.post(`Thongsokythuatmayxuc/delete-multiple`, ids).then(response => {
        return response
    })
}
const getThongsomayxucById = async (id) => {
    return await api.get(`Thongsokythuatmayxuc/${id}`).then(response => {
        return response
    })
}

const getThongsomayxucDetailById = async (id) => {
    return await api.get(`Thongsokythuatmayxuc/DetailById/${id}`).then(response => {
        return response
    })
}



export const thongsomayxucService = {
    getThongsomayxucById,
    getThongsomayxuc,
    addThongsomayxuc,
    updateThongsomayxuc,
    deleteThongsomayxuc,
    deleteSelectThongsomayxuc,
    getThongsomayxucDetailById
}