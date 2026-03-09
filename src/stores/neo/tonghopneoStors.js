import { create } from 'zustand';
import { message } from 'antd';
import { tonghopneoService } from '../../services/neo/tonghopneoService';
export const useTonghopneoStore = create((set, get) => ({
  dataTonghopneo: [],
    loading: false,
    // ================= FETCH =================
    fetchTonghopneo: async (params) => {
        set({ loading: true });
        try {
            const response = await tonghopneoService.getTonghopneo(params);
            set({ dataTonghopneo: response.data });
        } catch (error) {
            message.error('Error fetching tonghopneo data');
        } finally {
            set({ loading: false });
        }
    },
    // ================= CREATE =================
    createTonghopneo: async (data) => {
        set({ loading: true });
        try {
            const response = await tonghopneoService.addTonghopneo(data);
            message.success('Thêm thành công');
            return response;
        } catch (error) {
            message.error('Error creating tonghopneo');
        } finally {
            set({ loading: false });
        }
    },
    // ================= UPDATE =================
    updateTonghopneo: async (data) => {
        set({ loading: true });
        try {
            const response = await tonghopneoService.updateTonghopneo(data);
            message.success('Cập nhật thành công');
            return response;
        } catch (error) {
            message.error('Error updating tonghopneo');
        } finally {
            set({ loading: false });
        }
    },
    // ================= DELETE ONE =================
    deleteTonghopneo: async (id) => {
        set({ loading: true });
        try {
            const response = await tonghopneoService.deleteTonghopneo(id);
            message.success('Xóa thành công');
            return response;
        } catch (error) {
            message.error('Error deleting tonghopneo');
        } finally {
            set({ loading: false });
        }
    },
    // ================= DELETE MULTIPLE =================
    deleteTonghopneos: async (ids) => {
        set({ loading: true });
        try {
            const response = await tonghopneoService.deleteMultipleTonghopneo(ids);
            message.success('Xóa nhiều thành công');
            return response;
        } catch (error) {
            message.error('Error deleting multiple tonghopneo');
        } finally {
            set({ loading: false });
        }
    }
}));