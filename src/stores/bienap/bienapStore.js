import { create } from 'zustand';
import { message } from 'antd';
import { danhmucBienapService } from '../../services/bienap/bienapService';
export const useDanhmucBienapStore = create((set, get) => ({
  dataDanhmucBienap: [],
  loading: false,

  // ================= FETCH =================
  fetchDanhmucBienap: async () => {
    set({ loading: true });
    try {
      const res = await danhmucBienapService.getDanhmucBienap();
      set({
        dataDanhmucBienap: res.data,
        loading: false
      });
    } catch (error) {
      message.error('Không thể tải danh mục biến áp');
      set({ loading: false });
    }
  },

  // ================= CREATE =================
  createDanhmucBienap: async (payload) => {
    set({ loading: true });
    try {
      const res = await danhmucBienapService.addDanhmucBienap(payload);
      set({
        dataDanhmucBienap: [...get().dataDanhmucBienap, res.data],
        loading: false
      });
    } catch (error) {
      message.error('Thêm mới thất bại');
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateDanhmucBienap: async (payload) => {
    set({ loading: true });
    try {
      const res = await danhmucBienapService.updateDanhmucBienap(payload);

      const newData = get().dataDanhmucBienap.map((item) => (item.id === res.data.id ? res.data : item));
      set({
        dataDanhmucBienap: newData,
        loading: false
      });
    } catch (error) {
      message.error('Cập nhật thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteDanhmucBienap: async (id) => {
    set({ loading: true });
    try {
      await danhmucBienapService.deleteDanhmucBienap(id);

      set({
        dataDanhmucBienap: get().dataDanhmucBienap.filter((item) => item.id !== id),
        loading: false
      });

      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE MULTIPLE =================
  deleteMultipleDanhmucBienap: async (ids) => {
    set({ loading: true });
    try {
      await danhmucBienapService.deleteDanhmucBienaps(ids);

      set({
        dataDanhmucBienap: get().dataDanhmucBienap.filter((item) => !ids.includes(item.id)),
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
