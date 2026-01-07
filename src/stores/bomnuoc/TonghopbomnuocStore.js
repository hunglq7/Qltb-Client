import { create } from 'zustand';
import { message } from 'antd';
import { tonghopbomnuocService } from '../../services/bomnuoc/tonghopbomnuocService';
export const useTonghopbomnuocStore = create((set, get) => ({
  dataTonghopbomnuoc: [],
  loading: false,
totalRecords:[],
  // ================= FETCH =================
  fetchTonghopbomnuoc: async () => {
    set({ loading: true });
    try {
      const res = await tonghopbomnuocService.getTonghopbomnuoc();
      set({
        dataTonghopbomnuoc: res.data,
        loading: false
      });
    } catch (error) {
      message.error('Không thể tải danh mục bơm nước');
      set({ loading: false });
    }
  },
getTonghopbomnuocPaging:async(req)=>{
  set({loading:true});
  try {  
    const data=await tonghopbomnuocService.getTonghopbomnuocPaging(req);     
    set({dataTonghopbomnuoc:data.data.items,totalRecords:data.data.totalRecords,loading:false})
  } catch (error) {
     message.error('Failed to get TonghopbomnuocPaging');
      set({ loading: false }); 
  }
},
  getTonghopbomnuocById: async (id) => {
  set({ loading: true });
  try {
    const res = await tonghopbomnuocService.getTonghopbomnuocDetaiById(id);
    const list = Array.isArray(res.data)
      ? res.data
      : res.data?.data || [];
    set({
      dataTonghopbomnuoc: list,
      loading: false
    });
  } catch {
    set({ dataTonghopbomnuoc: [], loading: false });
  }
},

  // ================= CREATE =================
  createTonghopbomnuoc: async (payload) => {
    set({ loading: true });
    try {
      const res = await tonghopbomnuocService.addTonghopbomnuoc(payload);

      set({
        dataTonghopbomnuoc: [...get().dataTonghopbomnuoc, res.data],
        loading: false
      });
    
    } catch (error) {
      message.error('Thêm mới thất bại');
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateTonghopbomnuoc: async (payload) => {
    set({ loading: true });
    try {
      const res = await tonghopbomnuocService.updateTonghopbomnuoc(payload);
      const newData = get().dataTonghopbomnuoc.map(item =>
        item.id === res.data.id ? res.data : item
      );
      set({
        dataTonghopbomnuoc: newData,
        loading: false
      });     
    } catch (error) {
      message.error('Cập nhật thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteTonghopbomnuoc: async (id) => {
    set({ loading: true });
    try {
      await tonghopbomnuocService.deleteTonghopbomnuoc(id);

      set({
        dataTonghopbomnuoc: get().dataTonghopbomnuoc.filter(item => item.id !== id),
        loading: false
      });
    
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE MULTIPLE =================
  deleteMultipleTonghopbomnuoc: async (ids) => {
    set({ loading: true });
    try {
      await tonghopbomnuocService.deleteTonghopbomnuocs(ids);
      set({
        dataTonghopbomnuoc: get().dataTonghopbomnuoc.filter(
          item => !ids.includes(item.id)
        ),
        loading: false
      });
     
    } catch (error) {
      message.error('Lỗi khi xóa nhiều bản ghi');
      set({ loading: false });
      throw error;
    }
  }
}));