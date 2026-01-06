import { create } from 'zustand';
import { message } from 'antd';
import { thongsobomnuocService } from '../../services/bomnuoc/thongsobomnuocService';
export const useThongsobomnuocStore = create((set, get) => ({
  dataThongsobomnuoc: [],
  loading: false,

  // ================= FETCH =================
  fetchThongsobomnuoc: async () => {
    set({ loading: true });
    try {
      const res = await thongsobomnuocService.getThongsobomnuoc();
      set({
        dataThongsobomnuoc: res.data,
        loading: false
      });
    } catch (error) {
      message.error('Không thể tải danh mục bơm nước');
      set({ loading: false });
    }
  },

  // ================= CREATE =================
  createThongsobomnuoc: async (payload) => {
    set({ loading: true });
    try {
      const res = await thongsobomnuocService.addThongsobomnuoc(payload);

      set({
        dataThongsobomnuoc: [...get().dataThongsobomnuoc, res.data],
        loading: false
      });
    
    } catch (error) {
      message.error('Thêm mới thất bại');
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateThongsobomnuoc: async (payload) => {
    set({ loading: true });
    try {
      const res = await thongsobomnuocService.updateThongsobomnuoc(payload);

      const newData = get().dataThongsobomnuoc.map(item =>
        item.id === res.data.id ? res.data : item
      );
      set({
        dataThongsobomnuoc: newData,
        loading: false
      });     
    } catch (error) {
      message.error('Cập nhật thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteThongsobomnuoc: async (id) => {
    set({ loading: true });
    try {
      await thongsobomnuocService.deleteThongsobomnuoc(id);

      set({
        dataThongsobomnuoc: get().dataThongsobomnuoc.filter(item => item.id !== id),
        loading: false
      });

      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE MULTIPLE =================
  deleteMultipleThongsobomnuoc: async (ids) => {
    set({ loading: true });
    try {
      await thongsobomnuocService.deleteThongsobomnuocs(ids);

      set({
        dataThongsobomnuoc: get().dataThongsobomnuoc.filter(
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