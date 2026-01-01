import api from '../../Utils/Api'
const getDanhmuctoidien = async () => {
    return await api.get('Danhmuctoitruc').then((response) => {
        return response
    });
};
const createDanhmuctoidien=async (data)=>{   
    return await api.post('Danhmuctoitruc/Add',data).then((response)=>{
        return response
    })
}
const updateDanhmuctoidien=async(data)=>{
    return await api.put('Danhmuctoitruc/Update',data).then((response)=>{
        return response
    })
}

const deleteDanhmuctoidien = async(id)=>{
    return await api.delete(`Danhmuctoitruc/DatailById/${id}`).then((response)=>{
        return response
    })
}
const deleteMultipleDanhmuctoidien = async (listItems) => {    
    return await api.post('Danhmuctoitruc/DeleteMultipale', listItems).then((response) => response);
};
export const danhmuctoidienService={
    getDanhmuctoidien,
    createDanhmuctoidien,
    updateDanhmuctoidien,
    deleteDanhmuctoidien,
    deleteMultipleDanhmuctoidien
}
