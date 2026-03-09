import api from '../../Utils/Api';

const getTonghopbienap = async () => {
  try {
    const res = await api.get(`Tonghopbienap`);
    console.log('GET Tonghopbienap response:', res);
    return res;
  } catch (error) {
    console.error('GET Tonghopbienap error:', error.response?.data || error.message);
    throw error;
  }
};

const addTonghopbienap = async (data) => {
  try {
    console.log('POST addTonghopbienap payload:', data);
    const res = await api.post(`Tonghopbienap/Add`, data);
    console.log('POST addTonghopbienap response:', res);
    return res;
  } catch (error) {
    console.error('POST addTonghopbienap error:', error.response?.data || error.message);
    throw error;
  }
};

const updateTonghopbienap = async (data) => {
  try {
    console.log('PUT updateTonghopbienap payload:', data);
    const res = await api.put('Tonghopbienap/Update', data);
    console.log('PUT updateTonghopbienap response:', res);
    return res;
  } catch (error) {
    console.error('PUT updateTonghopbienap error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteTonghopbienap = async (id) => {
  try {
    const res = await api.delete(`Tonghopbienap/${id}`);
    console.log('DELETE id response:', res);
    return res;
  } catch (error) {
    console.error('DELETE id error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteTonghopbienaps = async (ids) => {
  try {
    console.log('POST deleteTonghopbienaps payload:', ids);
    const res = await api.post(`Tonghopbienap/DeleteSelect`, ids);
    console.log('POST deleteTonghopbienaps response:', res);
    return res;
  } catch (error) {
    console.error('POST deleteTonghopbienaps error:', error.response?.data || error.message);
    throw error;
  }
};

export const tonghopbienapService = {
  getTonghopbienap,
  addTonghopbienap,
  updateTonghopbienap,
  deleteTonghopbienap,
  deleteTonghopbienaps
};
