import api from '/src/utils/Api'

const getDonvi = async () => {
    return await api.get('Phongban').then((response) => {
        return response
    });
};
const addDonvi = async (data) => {
    return await api.post('Phongban/Add', data).then(response => {
        return response
    })
}

const deleteDonvi = async (id) => {
    return await api.delete(`Phongban/${id}`).then(response => {
        return response
    })
}

const deleteDonvis = async (data) => {
    return await api.post(`Phongban/DeleteSelect`, data).then(response => {
        return response
    })
}
const updateDonvi = async (data) => {
    return await api.put('Phongban/Update', data).then(response => {
        return response
    })
}
export const donviService = {
    getDonvi,
    addDonvi,
    updateDonvi,
    deleteDonvi,
    deleteDonvis

}