import api from '../../Utils/Api'


const getLoaithietbi = async () => {
    return await api.get('Loaithietbi').then((response) => {
        return response
    });
};



export const loaithietbiService = {
    getLoaithietbi

}