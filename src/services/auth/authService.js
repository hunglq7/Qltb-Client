import api from '../../utils/Api'
const loginWithUserCredentials = async (email, password) => {
    const data = {
        email, password
    }
    return await api.post('Users/authenticate', data).then((response) => {
        localStorage.setItem("accessToken", JSON.stringify(response));
        return response
    });
}

const accessToken = () => {
    return localStorage['accessToken']
        ? JSON.parse(localStorage['accessToken']).resultObj
        : null;
}
const logout = () => {
    localStorage.clear();
};

export const authService = {
    loginWithUserCredentials,
    logout,
    accessToken
}