import { create } from 'zustand';
import { message } from 'antd';
import { danhmuckhoanbalangService } from '../../services/khoanbalang/danhmuckhoanbalangService';
export const useDanhmuckhoanbalangStore = create((set, get) => ({
  dataDanhmuckhoanbalang: [],
  loading: false,
    // ================= FETCH =================
    fetchDanhmuckhoanbalang: async () => {
        set({ loading: true });
        try {
            const res = await danhmuckhoanbalangService.getDanhmuckhoanbalang();
            set({
                dataDanhmuckhoanbalang: res.data,
                loading: false
            });
        } catch (error) {
            message.error('Không thể tải danh mục khoan ba lang');
            set({ loading: false });
        }
    },

    // ================= CREATE =================
    createDanhmuckhoanbalang: async (data) => {
        set({ loading: true });
        try {
            const res = await danhmuckhoanbalangService.addDanhmuckhoanbalang(data);
            set({ loading: false });
            message.success('Thêm danh mục khoan ba lang thành công');
            return res;
        } catch (error) {
            message.error('Không thể thêm danh mục khoan ba lang');
            set({ loading: false });
        }
    },

    // ================= UPDATE =================
    updateDanhmuckhoanbalang: async (data) => {
        set({ loading: true }); 
        try {
            const res = await danhmuckhoanbalangService.updateDanhmuckhoanbalang(data);
            set({ loading: false });
            message.success('Cập nhật danh mục khoan ba lang thành công');
            return res;
        } catch (error) {
            message.error('Không thể cập nhật danh mục khoan ba lang');
            set({ loading: false });
        }
    },

    // ================= DELETE ONE =================
    deleteDanhmuckhoanbalang: async (id) => {
        set({ loading: true });
        try {
            const res = await danhmuckhoanbalangService.deleteDanhmuckhoanbalang(id);
            set({ loading: false });
            message.success('Xóa danh mục khoan ba lang thành công');
            return res;
        } catch (error) {
            message.error('Không thể xóa danh mục khoan ba lang');
            set({ loading: false });
        }
    },

    // ================= DELETE MULTIPLE =================
    deleteDanhmuckhoanbalangs: async (ids) => {
        set({ loading: true }); 
        try {
            const res = await danhmuckhoanbalangService.deleteDanhmuckhoanbalangs(ids);
            set({ loading: false });
            message.success('Xóa danh mục khoan ba lang thành công');
            return res;
        } catch (error) {
            message.error('Không thể xóa danh mục khoan ba lang');
            set({ loading: false });
        }
    },
}));