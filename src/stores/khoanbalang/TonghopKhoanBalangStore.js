import { create } from 'zustand';
import { message } from 'antd';
import { tonghopKhoanBalangService } from '../../services/khoanbalang/tonghopKhoanBalangService';
export const useTonghopKhoanBalangStore = create((set, get) => ({
  dataTonghopKhoanBalang: [],
    loading: false,
    // ================= FETCH =================
    fetchTonghopKhoanBalang: async (params) => {
        set({ loading: true });
        try {
            const response = await tonghopKhoanBalangService.getTonghopKhoanBalang(params);
            set({ dataTonghopKhoanBalang: response.data, loading: false });
        } catch (error) {
            message.error('Error fetching TonghopKhoanBalang');
            set({ loading: false });
        }
    },
    // ================= CREATE =================
    createTonghopKhoanBalang: async (data) => {
        set({ loading: true });
        try {
            const response = await tonghopKhoanBalangService.addTonghopKhoanBalang(data);
            set({ loading: false });
            message.success('Thêm thành công');
            return response;
        } catch (error) {
            message.error('Error creating TonghopKhoanBalang');
            set({ loading: false });
        }
    },
    // ================= UPDATE =================
    updateTonghopKhoanBalang: async (data) => {
        set({ loading: true });
        try {
            const response = await tonghopKhoanBalangService.updateTonghopKhoanBalang(data);
            set({ loading: false });
            message.success('Cập nhật thành công');
            return response;
        } catch (error) {
            message.error('Error updating TonghopKhoanBalang');
            set({ loading: false });
        }
    },
    // ================= DELETE ONE =================
    deleteTonghopKhoanBalang: async (id) => {
        set({ loading: true });
        try {
            const response = await tonghopKhoanBalangService.deleteTonghopKhoanBalang(id);
            set({ loading: false });
            message.success('Xóa thành công');
            return response;
        } catch (error) {
            message.error('Error deleting TonghopKhoanBalang');
            set({ loading: false });
        }
    },
    // ================= DELETE MULTIPLE =================
    deleteTonghopKhoanBalangs: async (ids) => {
        set({ loading: true });
        try {
            const response = await tonghopKhoanBalangService.deleteTonghopKhoanBalangs(ids);
            set({ loading: false });
            message.success('Xóa thành công');
            return response;
        } catch (error) {
            message.error('Error deleting TonghopKhoanBalang');
            set({ loading: false });
        }
    },
}));