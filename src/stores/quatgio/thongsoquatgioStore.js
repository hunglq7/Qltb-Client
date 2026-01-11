import { create } from 'zustand';
import { message } from 'antd';
import { thongsoquatgioService } from '../../services/quatgio/thongsoquatgioService';
export const useThongsoquatgioStore = create((set, get) => ({
  dataThongsoquatgio: [],
  loading: false,

  // ================= FETCH =================
  fetchThongsoquatgio: async () => {
    set({ loading: true });
    try {
      const res = await thongsoquatgioService.getThongsoquatgio();
      set({
        dataThongsoquatgio: res.data,
        loading: false
      });
    } catch (error) {
      message.error('Không thể tải danh mục bơm nước');
      set({ loading: false });
    }
  },
getThongsoquatgioById: async (id) => {
  set({ loading: true });
  try {
    const res = await thongsoquatgioService.getThongsoquatgioDetaiById(id);
    const list = Array.isArray(res.data)
      ? res.data
      : res.data?.data || [];
    set({
      dataThongsoquatgio: list,
      loading: false
    });
  } catch {
    set({ dataThongsoquatgio: [], loading: false });
  }
},
  // ================= CREATE =================
  createThongsoquatgio: async (payload) => {
    set({ loading: true });
    try {
      const res = await thongsoquatgioService.addThongsoquatgio(payload);

      set({
        dataThongsoquatgio: [...get().dataThongsoquatgio, res.data],
        loading: false
      });
    
    } catch (error) {
      message.error('Thêm mới thất bại');
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateThongsoquatgio: async (id,payload) => {
  const items={id,...payload};
    set({ loading: true });
    try {
      const res = await thongsoquatgioService.updateThongsoquatgio(items);
      const newData = get().dataThongsoquatgio.map(item =>
        item.id === res.data.id ? res.data : item
      );
      set({
        dataThongsoquatgio: newData,
        loading: false
      });     
    } catch (error) {
      message.error('Cập nhật thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteThongsoquatgio: async (id) => {
    set({ loading: true });
    try {
      await thongsoquatgioService.deleteThongsoquatgio(id);

      set({
        dataThongsoquatgio: get().dataThongsoquatgio.filter(item => item.id !== id),
        loading: false
      });

      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE MULTIPLE =================
  deleteMultipleThongsoquatgio: async (ids) => {
    set({ loading: true });
    try {
      await thongsoquatgioService.deleteThongsoquatgios(ids);

      set({
        dataThongsoquatgio: get().dataThongsoquatgio.filter(
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