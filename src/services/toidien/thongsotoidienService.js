import api from '../../Utils/Api'
const getThongsokythuattoidien = async () => {
    return await api.get('Thongsokythuattoitruc').then((response) => {
        return response
    });
};
const createThongsokythuattoidien=async (data)=>{   
    return await api.post('Thongsokythuattoitruc/Add',data).then((response)=>{
        return response
    })
}
const updateThongsokythuattoidien=async(data)=>{
    return await api.put('Thongsokythuattoitruc/Update',data).then((response)=>{
        return response
    })
}

const deleteThongsokythuattoidien = async(id)=>{
    return await api.delete(`Thongsokythuattoitruc/${id}`).then((response)=>{
        return response
    })
}
const deleteMultipleThongsokythuattoidien = async (listItems) => {   
    debugger
    return await api.post('Thongsokythuattoitruc/DeleteMultiple', listItems).then((response) => response);
};
const getThongsotoidienDetailById = async (id) => {
    return await api.get(`Thongsokythuattoitruc/DetailById/${id}`).then(response => {
        return response
    })
}
export const thongsokythuattoidienService={
    getThongsokythuattoidien,
    createThongsokythuattoidien,
    updateThongsokythuattoidien,
    deleteThongsokythuattoidien,
    deleteMultipleThongsokythuattoidien,
    getThongsotoidienDetailById
}
