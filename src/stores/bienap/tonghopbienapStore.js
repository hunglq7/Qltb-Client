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
      set({
        dataTonghopbienap: res.data,
        loading: false
      });
    } catch (error) {
      message.error('Không thể tải danh mục biến áp');
      set({ loading: false });
    }
  },

  // ================= CREATE =================
  createTonghopbienap: async (payload) => {
    set({ loading: true });
    try {
      const res = await tonghopbienapService.addTonghopbienap(payload);
      set({
        dataTonghopbienap: [...get().dataTonghopbienap, res.data],
        loading: false
      });
    
    } catch (error) {
      message.error('Thêm mới thất bại');
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateTonghopbienap: async (payload) => {
    set({ loading: true });
    try {
      const res = await tonghopbienapService.updateTonghopbienap(payload);
      const newData = get().dataTonghopbienap.map(item =>
        item.id === res.data.id ? res.data : item
      );
      set({
        dataTonghopbienap: newData,
        loading: false
      });     
    } catch (error) {
      message.error('Cập nhật thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteTonghopbienap: async (id) => {
    set({ loading: true });
    try {
      await tonghopbienapService.deleteTonghopbienap(id);

      set({
        dataTonghopbienap: get().dataTonghopbienap.filter(item => item.id !== id),
        loading: false
      });

      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
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
          item => !ids.includes(item.id)
        ),
        loading: false
      });

      message.success('Xóa nhiều bản ghi thành công');
    } catch (error) {
      message.error('Lỗi khi xóa nhiều bản ghi');
      set({ loading: false });
      throw error;
    }
  }
}));