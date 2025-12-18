import api from '../../Utils/Api'
const updateDanhmucmaycaos = async (data) => {
    return api.put(`Danhmucmaycao/UpdateMultiple`, data).then(response => {
        return response
    })
}

const deleteDanhmucmaycaos = async (ids) => {
    debugger;
    return api.post(`Danhmucmaycao/DeleteMultipale`, {data:ids}).then(response => {
        return response
    })
}



const getDanhmucmaycaos = async () => {
    return await api.get('Danhmucmaycao').then((response) => {
        return response
    });
};

const addDanhmucmaycao = async (data) => {
    return await api.post(`Danhmucmaycao/Add`, data).then(response => {
        return response
    })
}

const updateDanhmucmaycao = async (data) => {
    return await api.put(`Danhmucmaycao/Update`, data).then(response => {
        return response
    })
}
const deleteDanhmucmaycao = async (id) => {
    return await api.delete(`Danhmucmaycao/DatailById/${id}`).then(response => {
        return response
    })
}


export const danhmucmaycaoService = {
    getDanhmucmaycaos,
    updateDanhmucmaycaos,
    deleteDanhmucmaycaos,
    updateDanhmucmaycao,
    addDanhmucmaycao,
    deleteDanhmucmaycao

}