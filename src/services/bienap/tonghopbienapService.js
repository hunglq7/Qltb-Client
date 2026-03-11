import api from '../../Utils/Api';

const getTonghopbienap = async () => {
  try {
    const res = await api.get(`Tonghopbienap`);
    return res;
  } catch (error) {
    console.error('GET Tonghopbienap error:', error.response?.data || error.message);
    throw error;
  }
};

const addTonghopbienap = async (data) => {
  try {
  
    const res = await api.post(`Tonghopbienap/Add`, data);
    return res;
  } catch (error) {
    console.error('POST addTonghopbienap error:', error.response?.data || error.message);
    throw error;
  }
};

const updateTonghopbienap = async (data) => {
  try { 
    const res = await api.put('Tonghopbienap/Update', data);
    return res;
  } catch (error) {
    console.error('PUT updateTonghopbienap error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteTonghopbienap = async (id) => {
  try {
    const res = await api.delete(`Tonghopbienap/${id}`);

    return res;
  } catch (error) {
    console.error('DELETE id error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteTonghopbienaps = async (ids) => {
  try {

    const res = await api.post(`Tonghopbienap/DeleteSelect`, ids);
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
