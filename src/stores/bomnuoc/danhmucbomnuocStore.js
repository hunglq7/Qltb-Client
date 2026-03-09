import { create } from 'zustand';
import { message } from 'antd';
import { danhmucbomnuocService } from '../../services/bomnuoc/danhmucbomnuocService';

export const useDanhmucbomnuocStore = create((set, get) => ({
  dataDanhmucbomnuoc: [],
  loading: false,

  // ================= FETCH =================
  fetchDanhmucbomnuoc: async () => {
    set({ loading: true });
    try {
      const res = await danhmucbomnuocService.getDanhmucbomnuoc();
      set({
        dataDanhmucbomnuoc: res.data,
        loading: false
      });
    } catch (error) {
      message.error('Không thể tải danh mục bơm nước');
      set({ loading: false });
    }
  },

  // ================= CREATE =================
  createDanhmucbomnuoc: async (payload) => {
    set({ loading: true });
    try {
      const res = await danhmucbomnuocService.addDanhmucbomnuoc(payload);

      set({
        dataDanhmucbomnuoc: [...get().dataDanhmucbomnuoc, res.data],
        loading: false
      });
    } catch (error) {
      message.error('Thêm mới thất bại');
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateDanhmucbomnuoc: async (payload) => {
    set({ loading: true });
    try {
      const res = await danhmucbomnuocService.updateDanhmucbomnuoc(payload);

      const newData = get().dataDanhmucbomnuoc.map((item) => (item.id === res.data.id ? res.data : item));
      set({
        dataDanhmucbomnuoc: newData,
        loading: false
      });
    } catch (error) {
      message.error('Cập nhật thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteDanhmucbomnuoc: async (id) => {
    set({ loading: true });
    try {
      await danhmucbomnuocService.deleteDanhmucbomnuoc(id);

      set({
        dataDanhmucbomnuoc: get().dataDanhmucbomnuoc.filter((item) => item.id !== id),
        loading: false
      });

      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE MULTIPLE =================
  deleteMultipleDanhmucbomnuoc: async (ids) => {
    set({ loading: true });
    try {
      await danhmucbomnuocService.deleteDanhmucbomnuocs(ids);

      set({
        dataDanhmucbomnuoc: get().dataDanhmucbomnuoc.filter((item) => !ids.includes(item.id)),
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
