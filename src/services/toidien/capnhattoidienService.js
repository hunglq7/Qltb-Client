import api from '../../Utils/Api'
const getTonghoptoidien = async () => {
    return await api.get('Tonghoptoitruc/getAll').then((response) => {
        return response
    });
};

const getTonghoptoidienPaging = async(data)=>{  
    return await api.get('Tonghoptoitruc/search',{params: data}).then((response)=>{        
        return response
    })
}
const createTonghoptoidien=async (data)=>{   
    return await api.post('Tonghoptoitruc/Add',data).then((response)=>{
        return response
    })
}
const updateTonghoptoidien=async(data)=>{
    return await api.put('Tonghoptoitruc/Update',data).then((response)=>{
        return response
    })
}

const deleteTonghoptoidien = async(id)=>{
    return await api.delete(`Tonghoptoitruc/${id}`).then((response)=>{
        return response
    })
}
const deleteMultipleTonghoptoidien = async (listItems) => {   
    debugger
    return await api.post('Tonghoptoitruc/DeleteMultiple', listItems).then((response) => response);
};
export const tonghoptoidienService={
    getTonghoptoidien,
    createTonghoptoidien,
    updateTonghoptoidien,
    deleteTonghoptoidien,
    deleteMultipleTonghoptoidien,
    getTonghoptoidienPaging
}
