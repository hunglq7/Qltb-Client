import api from '../../Utils/Api'

const deleteDanhmucmayxucs = async (ids) => {
    return api.post(`Mayxuc/delete-multiple`, ids).then(response => {
        return response
    })
}
const getDanhmucmayxucs = async () => {
    return await api.get('Mayxuc').then((response) => {
        return response
    });
};

const addMayxuc=async(data)=>{
    return await api.post('Mayxuc/add',data).then((response)=>{
        return response
    })
}
const updateMayxuc=async(data)=>{
    return await api.put('Mayxuc/update',data).then((response)=>{
        return response
    })
}
const deleteMayxuc=async(id)=>{
    return await api.delete(`Mayxuc/${id}`).then((response)=>{
        return response
    })
}


export const danhmucmayxucService = {
    addMayxuc,
    updateMayxuc,
    deleteMayxuc,
    getDanhmucmayxucs, 
    deleteDanhmucmayxucs,

}