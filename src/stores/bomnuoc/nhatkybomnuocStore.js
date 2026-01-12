import { create } from 'zustand';
import { message } from 'antd';
import { nhatkybomnuocService } from '../../services/bomnuoc/nhatkybomnuocService';
export const useNhatkybomnuocStore = create((set, get) => ({
  // ================= STATE =================
  dataNhatkybomnuoc: [],
  loading: false,

  // ================= GET BY TONGHOP ID =================
  getNhatkybomnuocById: async (tonghopbomnuocId) => {
    try {
      set({ loading: true });
      const res = await nhatkybomnuocService.getNhatkyById(tonghopbomnuocId);  
      set({ dataNhatkybomnuoc: res.data || [] });
    } catch (err) {
      console.error(err);
      message.error(res.data.message);
    } finally {
      set({ loading: false });
    }
  },

  // ================= ADD =================
  createNhatkybomnuoc: async (payload) => {
    try {
      set({ loading: true });

      // Validate frontend level
      if (!payload.tonghopbomnuocId)
        throw new Error('Thiếu tonghopbomnuocId');
      await nhatkybomnuocService.addNhatkybomnuoc(payload);
    } catch (err) {
      console.error(err);
      message.error('Thêm mới thất bại');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateNhatkybomnuoc: async (id,payload) => {
    try {
        const items={id,...payload};
      set({ loading: true });
      if (!payload.id) throw new Error('Thiếu id cập nhật');
      await nhatkybomnuocService.updateNhatkybomnuoc(items);
    } catch (err) {
      console.error(err);
      message.error('Cập nhật thất bại');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteNhatkybomnuoc: async (id) => {
    try {
      set({ loading: true });
      await nhatkybomnuocService.deleteNhatkybomnuoc(id);
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
      await nhatkybomnuocService.deleteNhatkybomnuocs(ids);
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
      dataNhatkybomnuoc: [],
      loading: false
    });
  }
}));