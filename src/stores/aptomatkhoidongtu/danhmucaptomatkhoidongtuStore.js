import { create } from 'zustand';
import { message } from 'antd';
import { danhmucaptomatkhoidongtuService } from '../../services/aptomatkhoidongtu/danhmucaptomatkhoidongtuService';
export const useDanhmucaptomatkhoidongtuStore = create((set, get) => ({
  dataDanhmucaptomatkhoidongtu: [],
    loading: false,
    // ================= FETCH =================
    fetchDanhmucaptomatkhoidongtu: async () => {
      set({ loading: true });
        try {
            const res = await danhmucaptomatkhoidongtuService.getDanhmucaptomatkhoidongtu();
            set({ dataDanhmucaptomatkhoidongtu: res.data });
        } catch (error) {
            message.error('Failed to fetch danh mục aptomat khôi động từ');
        } finally {
            set({ loading: false });
        }
    },

    // ================= CREATE =================
    createDanhmucaptomatkhoidongtu: async (data) => {
      set({ loading: true });
        try {
            const res = await danhmucaptomatkhoidongtuService.addDanhmucaptomatkhoidongtu(data);
            message.success('Thêm danh mục aptomat khôi động từ thành công');
            return res;
        } catch (error) {
            console.error('Failed to create:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || 'Thêm thất bại';
            message.error(errorMsg);
            throw error;
        } finally {set({ loading: false });
        }   
    },


    // ================= UPDATE =================
    updateDanhmucaptomatkhoidongtu: async (data) => {
      set({ loading: true });
        try {
            const res = await danhmucaptomatkhoidongtuService.updateDanhmucaptomatkhoidongtu(data);
            message.success('Cập nhật danh mục aptomat khôi động từ thành công');
            return res;
        } catch (error) {
            console.error('Failed to update:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || 'Cập nhật thất bại';
            message.error(errorMsg);
            throw error;
        } finally {set({ loading: false });
        }
    },

    // ================= DELETE ONE =================
    deleteDanhmucaptomatkhoidongtu: async (id) => {
      set({ loading: true });
        try {
            const res = await danhmucaptomatkhoidongtuService.deleteDanhmucaptomatkhoidongtu(id);
            message.success('Xóa danh mục aptomat khôi động từ thành công');
            return res;
        } catch (error) {
            message.error('Xóa danh mục aptomat khôi động từ thất bại');
        } finally {set({ loading: false });
        }
    },
    // ================= DELETE MULTIPLE =================
    deleteDanhmucaptomatkhoidongtus: async (ids) => {
      set({ loading: true });
        try {
            const res = await danhmucaptomatkhoidongtuService.deleteDanhmucaptomatkhoidongtus(ids);
            message.success('Xóa nhiều danh mục aptomat khôi động từ thành công');
            return res;
        } catch (error) {
            message.error('Failed to delete multiple danh mục aptomat khôi động từ');
        } finally {set({ loading: false });
        }    },
}));
