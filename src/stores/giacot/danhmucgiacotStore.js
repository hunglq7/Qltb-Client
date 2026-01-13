import { create } from 'zustand';
import { message } from 'antd';
import { danhmucgiacotService } from '../../services/giacot/danhmucgiacotService';
export const useDanhmucgiacotStore = create((set, get) => ({
  dataDanhmucgiacot: [],
  loading: false,

  // ================= FETCH =================
  fetchDanhmucgiacot: async () => {
    set({ loading: true });
    try {
      const res = await danhmucgiacotService.getDanhmucgiacot();
      set({
        dataDanhmucgiacot: res.data,
        loading: false
      });
    } catch (error) {
      message.error('Không thể tải danh mục bơm nước');
      set({ loading: false });
    }
  },

  // ================= CREATE =================
  createDanhmucgiacot: async (payload) => {
    set({ loading: true });
    try {
      const res = await danhmucgiacotService.addDanhmucgiacot(payload);

      set({
        dataDanhmucgiacot: [...get().dataDanhmucgiacot, res.data],
        loading: false
      });
    
    } catch (error) {
      message.error('Thêm mới thất bại');
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateDanhmucgiacot: async (payload) => {
    set({ loading: true });
    try {
      const res = await danhmucgiacotService.updateDanhmucgiacot(payload);

      const newData = get().dataDanhmucgiacot.map(item =>
        item.id === res.data.id ? res.data : item
      );
      set({
        dataDanhmucgiacot: newData,
        loading: false
      });     
    } catch (error) {
      message.error('Cập nhật thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteDanhmucgiacot: async (id) => {
    set({ loading: true });
    try {
      await danhmucgiacotService.deleteDanhmucgiacot(id);

      set({
        dataDanhmucgiacot: get().dataDanhmucgiacot.filter(item => item.id !== id),
        loading: false
      });

      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE MULTIPLE =================
  deleteMultipleDanhmucgiacot: async (ids) => {
    set({ loading: true });
    try {
      await danhmucgiacotService.deleteDanhmucgiacots(ids);

      set({
        dataDanhmucgiacot: get().dataDanhmucgiacot.filter(
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