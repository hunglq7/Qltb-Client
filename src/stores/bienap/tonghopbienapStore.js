import { create } from 'zustand';
import { message } from 'antd';
import { tonghopbienapService } from '../../services/bienap/tonghopbienapService';

export const useTonghopbienapStore = create((set, get) => ({
  dataTonghopbienap: [],
  loading: false,

  // ================= FETCH =================
  fetchTonghopbienap: async () => {
    set({ loading: true });
    try {
      const res = await tonghopbienapService.getTonghopbienap();
      console.log('Store fetchTonghopbienap response:', res);
      
      // Backend trả về { data: [...], success: true }
      const data = res.data?.data && Array.isArray(res.data.data) ? res.data.data : [];
      console.log('Store fetchTonghopbienap final data:', data);
      
      set({
        dataTonghopbienap: data,
        loading: false
      });
    } catch (error) {
      console.error('Store fetchTonghopbienap error:', error);
      const errorMsg = error.response?.data?.message || error.message;
      message.error('Không thể tải tổng hợp biến áp: ' + errorMsg);
      set({ 
        dataTonghopbienap: [],
        loading: false 
      });
    }
  },

  // ================= CREATE =================
  createTonghopbienap: async (payload) => {
    set({ loading: true });
    try {
      const res = await tonghopbienapService.addTonghopbienap(payload);
      console.log('Create response:', res);
      
      // Backend trả về { data: result, success: true }
      const newData = res.data?.data || res.data;
      if (newData && newData.Id) {
        set({
          dataTonghopbienap: [...get().dataTonghopbienap, newData],
          loading: false
        });
        message.success('Thêm mới thành công');
      } else {
        throw new Error(res.data?.message || 'Thêm mới thất bại');
      }
    } catch (error) {
      console.error('Create error:', error);
      const errorMsg = error.response?.data?.message || error.message;
      message.error('Thêm mới thất bại: ' + errorMsg);
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateTonghopbienap: async (payload) => {
    set({ loading: true });
    try {
      const res = await tonghopbienapService.updateTonghopbienap(payload);
      console.log('Update response:', res);
      
      // Backend trả về { data: result, success: true }
      const updatedData = res.data?.data || res.data;
      if (updatedData && updatedData.Id) {
        const newData = get().dataTonghopbienap.map(item =>
          item.Id === updatedData.Id ? updatedData : item
        );
        set({
          dataTonghopbienap: newData,
          loading: false
        });
        message.success('Cập nhật thành công');
      } else {
        throw new Error(res.data?.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Update error:', error);
      const errorMsg = error.response?.data?.message || error.message;
      message.error('Cập nhật thất bại: ' + errorMsg);
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteTonghopbienap: async (id) => {
    set({ loading: true });
    try {
      await tonghopbienapService.deleteTonghopbienap(id);

      set({
        dataTonghopbienap: get().dataTonghopbienap.filter(item => item.Id !== id),
        loading: false
      });

      message.success('Xóa thành công');
    } catch (error) {
      console.error('Delete error:', error);
      const errorMsg = error.response?.data?.message || error.message;
      message.error('Xóa thất bại: ' + errorMsg);
      set({ loading: false });
    }
  },

  // ================= DELETE MULTIPLE =================
  deleteMultipleTonghopbienap: async (ids) => {
    set({ loading: true });
    try {
      await tonghopbienapService.deleteTonghopbienaps(ids);

      set({
        dataTonghopbienap: get().dataTonghopbienap.filter(
          item => !ids.includes(item.Id)
        ),
        loading: false
      });

      message.success('Xóa nhiều bản ghi thành công');
    } catch (error) {
      console.error('Delete multiple error:', error);
      const errorMsg = error.response?.data?.message || error.message;
      message.error('Xóa nhiều thất bại: ' + errorMsg);
      set({ loading: false });
    }
  }
}));