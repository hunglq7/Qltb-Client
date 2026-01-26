import { create } from 'zustand';
import { message } from 'antd';
import { TonghopRoleService } from '../../services/role/tonghoproleService';
export const useTonghopRoleStore = create((set, get) => ({
  dataTonghopRole: [],
  loading: false,

  // ================= FETCH =================
  fetchTonghopRole: async () => {
    set({ loading: true });
    try {
      const res = await TonghopRoleService.getTonghopRole();
      set({
        dataTonghopRole: res.data,
        loading: false
      });
    } catch (error) {
      message.error('Không thể tải danh mục bơm nước');
      set({ loading: false });
    }
  },

  // ================= CREATE =================
  createTonghopRole: async (payload) => {
    set({ loading: true });
    try {
      const res = await TonghopRoleService.addTonghopRole(payload);

      set({
        dataTonghopRole: [...get().dataTonghopRole, res.data],
        loading: false
      });
    
    } catch (error) {
      message.error('Thêm mới thất bại');
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateTonghopRole: async (payload) => {
    set({ loading: true });
    try {
      const res = await TonghopRoleService.updateTonghopRole(payload);

      const newData = get().dataTonghopRole.map(item =>
        item.id === res.data.id ? res.data : item
      );
      set({
        dataTonghopRole: newData,
        loading: false
      });     
    } catch (error) {
      message.error('Cập nhật thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteTonghopRole: async (id) => {
    set({ loading: true });
    try {
      await TonghopRoleService.deleteTonghopRole(id);

      set({
        dataTonghopRole: get().dataTonghopRole.filter(item => item.id !== id),
        loading: false
      });

      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE MULTIPLE =================
  deleteMultipleTonghopRole: async (ids) => {
    set({ loading: true });
    try {
      await TonghopRoleService.deleteTonghopRoles(ids);

      set({
        dataTonghopRole: get().dataTonghopRole.filter(
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