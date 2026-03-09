import { create } from 'zustand';
import { message } from 'antd';
import { danhmucroleService } from '../../services/role/roleService';
export const useDanhmucroleStore = create((set, get) => ({
  dataDanhmucrole: [],
  loading: false,

  // ================= FETCH =================
  fetchDanhmucrole: async () => {
    set({ loading: true });
    try {
      const res = await danhmucroleService.getDanhmucrole();
      set({
        dataDanhmucrole: res.data,
        loading: false
      });
    } catch (error) {
      message.error('Không thể tải danh mục bơm nước');
      set({ loading: false });
    }
  },

  // ================= CREATE =================
  createDanhmucrole: async (payload) => {
    set({ loading: true });
    try {
      const res = await danhmucroleService.addDanhmucrole(payload);

      set({
        dataDanhmucrole: [...get().dataDanhmucrole, res.data],
        loading: false
      });
    } catch (error) {
      message.error('Thêm mới thất bại');
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateDanhmucrole: async (payload) => {
    set({ loading: true });
    try {
      const res = await danhmucroleService.updateDanhmucrole(payload);

      const newData = get().dataDanhmucrole.map((item) => (item.id === res.data.id ? res.data : item));
      set({
        dataDanhmucrole: newData,
        loading: false
      });
    } catch (error) {
      message.error('Cập nhật thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteDanhmucrole: async (id) => {
    set({ loading: true });
    try {
      await danhmucroleService.deleteDanhmucrole(id);

      set({
        dataDanhmucrole: get().dataDanhmucrole.filter((item) => item.id !== id),
        loading: false
      });

      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE MULTIPLE =================
  deleteMultipleDanhmucrole: async (ids) => {
    set({ loading: true });
    try {
      await danhmucroleService.deleteDanhmucroles(ids);

      set({
        dataDanhmucrole: get().dataDanhmucrole.filter((item) => !ids.includes(item.id)),
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
