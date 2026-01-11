import { create } from 'zustand';
import { message } from 'antd';
import { nhatkyquatgioService } from '../../services/quatgio/nhatkyquatgioService';
export const useNhatkyquatgioStore = create((set, get) => ({
  // ================= STATE =================
  dataNhatkyquatgio: [],
  loading: false,

  // ================= GET BY TONGHOP ID =================
  getNhatkyquatgioById: async (tonghopquatgioId) => {
    try {
      set({ loading: true });
      const res = await nhatkyquatgioService.getNhatkyById(tonghopquatgioId);  
      
      set({ dataNhatkyquatgio: res.data.data || [] });
    } catch (err) {
      console.error(err);
      message.error(res.data.message);
    } finally {
      set({ loading: false });
    }
  },

  // ================= ADD =================
  createNhatkyquatgio: async (payload) => {
    try {
      set({ loading: true });

      // Validate frontend level
      if (!payload.tonghopquatgioId)
        throw new Error('Thiếu tonghopquatgioId');
      await nhatkyquatgioService.addNhatkyquatgio(payload);
    } catch (err) {
      console.error(err);
      message.error('Thêm mới thất bại');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateNhatkyquatgio: async (id,payload) => {
    try {
        const items={id,...payload};
      set({ loading: true });
      if (!payload.id) throw new Error('Thiếu id cập nhật');
      await nhatkyquatgioService.updateNhatkyquatgio(items);
    } catch (err) {
      console.error(err);
      message.error('Cập nhật thất bại');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteNhatkyquatgio: async (id) => {
    try {
      set({ loading: true });
      await nhatkyquatgioService.deleteNhatkyquatgio(id);
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
      await nhatkyquatgioService.deleteNhatkyquatgios(ids);
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
      dataNhatkyquatgio: [],
      loading: false
    });
  }
}));