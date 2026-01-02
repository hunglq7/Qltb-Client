import { create } from 'zustand';
import { message } from 'antd';
import { nhatkymayxucService } from '/src/services/mayxuc/nhatkymayxucService';

export const useNhatkymayxucStore = create((set, get) => ({
  // ================= STATE =================
  dataNhatkyMayxuc: [],
  loading: false,

  // ================= GET BY TONGHOP ID =================
  getNhatkymayxucById: async (tonghopmayxucId) => {
    try {
      set({ loading: true });
      const res = await nhatkymayxucService.getNhatkyById(tonghopmayxucId);
      console.log(res.data)
      set({ dataNhatkyMayxuc: res.data.data || [] });
    } catch (err) {
      console.error(err);
      message.error(res.data.message);
    } finally {
      set({ loading: false });
    }
  },

  // ================= ADD =================
  createNhatkymayxuc: async (payload) => {
    try {
      set({ loading: true });

      // Validate frontend level
      if (!payload.tonghopmayxucId)
        throw new Error('Thiếu tonghopmayxucId');

      await nhatkymayxucService.addNhatkymayxuc(payload);
    } catch (err) {
      console.error(err);
      message.error('Thêm mới thất bại');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateNhatkymayxuc: async (id,payload) => {
    try {
      set({ loading: true });

      if (!payload.id) throw new Error('Thiếu id cập nhật');

      await nhatkymayxucService.updateNhatkymayxuc(id,payload);
    } catch (err) {
      console.error(err);
      message.error('Cập nhật thất bại');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteNhatkymayxuc: async (id) => {
    try {
      set({ loading: true });
      await nhatkymayxucService.deleteNhatkymayxuc(id);
    } catch (err) {
      console.error(err);
      message.error('Xóa thất bại');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ================= DELETE MULTIPLE =================
  deleteMultiple: async (ids) => {
    try {
      if (!ids || ids.length === 0)
        throw new Error('Danh sách id rỗng');

      set({ loading: true });
      await nhatkymayxucService.deleteNhatkyMayxucs(ids);
    } catch (err) {
      console.error(err);
      message.error('Xóa nhiều dòng thất bại');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ================= RESET =================
  resetStore: () => {
    set({
      dataNhatkyMayxuc: [],
      loading: false
    });
  }
}));