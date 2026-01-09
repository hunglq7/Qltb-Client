import { create } from 'zustand';
import { message } from 'antd';
import { danhmucquatgioService } from '../../services/quatgio/danhmucquatgioService';
export const useDanhmucquatgioStore = create((set, get) => ({
  dataDanhmucquatgio: [],
  loading: false,

  // ================= FETCH =================
  fetchDanhmucquatgio: async () => {
    set({ loading: true });
    try {
      const res = await danhmucquatgioService.getDanhmucquatgio();
      set({
        dataDanhmucquatgio: res.data,
        loading: false
      });
    } catch (error) {
      message.error('Không thể tải danh mục bơm nước');
      set({ loading: false });
    }
  },

  // ================= CREATE =================
  createDanhmucquatgio: async (payload) => {
    set({ loading: true });
    try {
      const res = await danhmucquatgioService.addDanhmucquatgio(payload);

      set({
        dataDanhmucquatgio: [...get().dataDanhmucquatgio, res.data],
        loading: false
      });
    
    } catch (error) {
      message.error('Thêm mới thất bại');
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateDanhmucquatgio: async (payload) => {
    set({ loading: true });
    try {
      const res = await danhmucquatgioService.updateDanhmucquatgio(payload);

      const newData = get().dataDanhmucquatgio.map(item =>
        item.id === res.data.id ? res.data : item
      );
      set({
        dataDanhmucquatgio: newData,
        loading: false
      });     
    } catch (error) {
      message.error('Cập nhật thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteDanhmucquatgio: async (id) => {
    set({ loading: true });
    try {
      await danhmucquatgioService.deleteDanhmucquatgio(id);

      set({
        dataDanhmucquatgio: get().dataDanhmucquatgio.filter(item => item.id !== id),
        loading: false
      });

      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE MULTIPLE =================
  deleteMultipleDanhmucquatgio: async (ids) => {
    set({ loading: true });
    try {
      await danhmucquatgioService.deleteDanhmucquatgios(ids);

      set({
        dataDanhmucquatgio: get().dataDanhmucquatgio.filter(
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