import { create } from 'zustand';
import { message } from 'antd';
import { tonghopaptomatkhoidongtuService } from '../../services/aptomatkhoidongtu/tonghopaptomatkhoidongtuService';
export const useTonghopaptomatkhoidongtuStore = create((set) => ({
    tonghopaptomatkhoidongtus: [],
    dataTonghopaptomatkhoidongtu: [],
    totalRecords: 0,
    loading: false,
    fetchTonghopaptomatkhoidongtus: async () => {
        set({ loading: true });
        try {
            const response = await tonghopaptomatkhoidongtuService.getTonghopaptomatkhoidongtu();
            set({ tonghopaptomatkhoidongtus: response.data, dataTonghopaptomatkhoidongtu: response.data });
        } catch (error) {
            message.error('Lỗi khi tải dữ liệu');
        } finally {
            set({ loading: false });
        }

    },
    createTonghopaptomatkhoidongtu: async (data) => {
        set({ loading: true });
        try {
            const response = await tonghopaptomatkhoidongtuService.addTonghopaptomatkhoidongtu(data);
            message.success('Thêm mới thành công');
            return response;
        } catch (error) {
            console.error('Failed to create:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || 'Thêm mới thất bại';
            message.error(errorMsg);
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    updateTonghopaptomatkhoidongtu: async (data) => {
        set({ loading: true });
        try {
            const response = await tonghopaptomatkhoidongtuService.updateTonghopaptomatkhoidongtu(data);
            message.success('Cập nhật thành công');
            return response;
        } catch (error) {
            console.error('Failed to update:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || 'Cập nhật thất bại';
            message.error(errorMsg);
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    deleteTonghopaptomatkhoidongtu: async (id) => {
        set({ loading: true });
        try {
            const response = await tonghopaptomatkhoidongtuService.deleteTonghopaptomatkhoidongtu(id);
            message.success('Xóa thành công');
            return response;
        } catch (error) {
            console.error('Failed to delete:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || 'Xóa thất bại';
            message.error(errorMsg);
            throw error;
        } finally {
            set({ loading: false });
        } 
    },
    deleteTonghopaptomatkhoidongtus: async (ids) => {
        set({ loading: true });
        try {
            const response = await tonghopaptomatkhoidongtuService.deleteTonghopaptomatkhoidongtus(ids);
            message.success('Xóa nhiều thành công');
            return response;
        } catch (error) {
            console.error('Failed to delete multiple:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || 'Xóa nhiều thất bại';
            message.error(errorMsg);
            throw error;
        } finally {
            set({ loading: false });        
        }
    },
    getTonghopaptomatkhoidongtuPaging: async (params) => {
        set({ loading: true });
        try {
            const response = await tonghopaptomatkhoidongtuService.getTonghopaptomatkhoidongtuSearch(params);
            set({
                dataTonghopaptomatkhoidongtu: response.data.items || [],
                totalRecords: response.data.totalRecords || 0
            });
            return response;
        } catch (error) {
            console.error('Failed to fetch paged data:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || 'Tải dữ liệu thất bại';
            message.error(errorMsg);
            throw error;
        } finally {
            set({ loading: false });
        }
    }
}));
