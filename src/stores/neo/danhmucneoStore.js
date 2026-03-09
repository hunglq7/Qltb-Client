import { create } from 'zustand';
import { message } from 'antd';
import { danhmucneoService } from '../../services/neo/danhmucneoService';
export const useDanhmucneoStore = create((set, get) => ({
  dataDanhmucneo: [],
    loading: false,
    // ================= FETCH =================
    fetchDanhmucneo: async () => {
      set({ loading: true });
        try {
            const res = await danhmucneoService.getDanhmucneo();
            set({
                dataDanhmucneo: res.data,
                loading: false
            });
        } catch (error) {
            message.error('Không thể tải danh mục neo');
            set({ loading: false });
        }
    },

    // ================= CREATE =================
    createDanhmucneo: async (data) => {
      set({ loading: true });
        try {
            const res = await danhmucneoService.addDanhmucneo(data);
            set({ loading: false });
            message.success('Thêm danh mục neo thành công');
            return res;
        } catch (error) {
            message.error('Không thể thêm danh mục neo');
            set({ loading: false });
        }
    },

    // ================= UPDATE =================
    updateDanhmucneo: async (data) => {
      set({ loading: true });
        try {
            const res = await danhmucneoService.updateDanhmucneo(data);
            set({ loading: false });
            message.success('Cập nhật danh mục neo thành công');
            return res;
        } catch (error) {
            message.error('Không thể cập nhật danh mục neo');
            set({ loading: false });
        }
    },

    // ================= DELETE ONE =================
    deleteDanhmucneo: async (id) => {
      set({ loading: true });
        try {
            const res = await danhmucneoService.deleteDanhmucneo(id);
            set({ loading: false });
            message.success('Xóa danh mục neo thành công');
            return res;
        } catch (error) {
            message.error('Không thể xóa danh mục neo');
            set({ loading: false });
        }
    },
    // ================= DELETE MULTIPLE =================
    deleteDanhmucneos: async (ids) => {
      set({ loading: true });
        try {
            const res = await danhmucneoService.deleteDanhmucneos(ids);
            set({ loading: false });
            message.success('Xóa danh mục neo thành công');
            return res;
        } catch (error) {
            message.error('Không thể xóa danh mục neo');
            set({ loading: false });
        }

    }
}));