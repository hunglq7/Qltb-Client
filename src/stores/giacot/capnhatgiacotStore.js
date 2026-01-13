import { create } from 'zustand';
import { message } from 'antd';
import { capnhatgiacotService } from '../../services/giacot/capnhatgiacotService';
export const useCapnhatgiacotStore = create((set, get) => ({
  dataCapnhatgiacot: [],
  loading: false,

  // ================= FETCH =================
  fetchCapnhatgiacot: async () => {
    set({ loading: true });
    try {
      const res = await capnhatgiacotService.getCapnhatgiacot();
      set({
        dataCapnhatgiacot: res.data,
        loading: false
      });
    } catch (error) {
      message.error('Không thể tải danh mục bơm nước');
      set({ loading: false });
    }
  },

  // ================= CREATE =================
  createCapnhatgiacot: async (payload) => {
    set({ loading: true });
    try {
      const res = await capnhatgiacotService.addCapnhatgiacot(payload);

      set({
        dataCapnhatgiacot: [...get().dataCapnhatgiacot, res.data],
        loading: false
      });
    
    } catch (error) {
      message.error('Thêm mới thất bại');
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateCapnhatgiacot: async (payload) => {
    set({ loading: true });
    try {
      const res = await capnhatgiacotService.updateCapnhatgiacot(payload);

      const newData = get().dataCapnhatgiacot.map(item =>
        item.id === res.data.id ? res.data : item
      );
      set({
        dataCapnhatgiacot: newData,
        loading: false
      });     
    } catch (error) {
      message.error('Cập nhật thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteCapnhatgiacot: async (id) => {
    set({ loading: true });
    try {
      await capnhatgiacotService.deleteCapnhatgiacot(id);

      set({
        dataCapnhatgiacot: get().dataCapnhatgiacot.filter(item => item.id !== id),
        loading: false
      });

      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE MULTIPLE =================
  deleteMultipleCapnhatgiacot: async (ids) => {
    set({ loading: true });
    try {
      await capnhatgiacotService.deleteCapnhatgiacots(ids);

      set({
        dataCapnhatgiacot: get().dataCapnhatgiacot.filter(
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