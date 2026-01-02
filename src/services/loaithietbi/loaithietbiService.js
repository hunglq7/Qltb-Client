
import api from '/src/utils/Api'


const getLoaithietbi = async () => {
    return await api.get('Loaithietbi').then((response) => {
        return response
    });
};

const addLoaithietbi = async (data) => {
    return await api.post('Loaithietbi', data).then(response => {
        return response
    })
}

const deleteLoaithietbi = async (id) => {
    return await api.delete(`Loaithietbi/${id}`).then(response => {
        return response
    })
}

const deleteLoaithietbis = async (data) => {
    return await api.post(`Loaithietbi/DeleteMultipale`, data).then(response => {
        return response
    })
}
const updateLoaithietbi = async (data) => {
    return await api.put('Loaithietbi/update', data).then(response => {
        return response
    })
}
export const loaithietbiService = {
    getLoaithietbi,
    addLoaithietbi,
    updateLoaithietbi,
    deleteLoaithietbi,
    deleteLoaithietbis


}