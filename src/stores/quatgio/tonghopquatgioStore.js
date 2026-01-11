import { create } from 'zustand';
import { message } from 'antd';
import { tonghopquatgioService } from '../../services/quatgio/tonghopquatgioService';
export const useTonghopquatgioStore = create((set, get) => ({
  dataTonghopquatgio: [],
  loading: false,
totalRecords:[],
  // ================= FETCH =================
  fetchTonghopquatgio: async () => {
    set({ loading: true });
    try {
      const res = await tonghopquatgioService.getTonghopquatgio();
      set({
        dataTonghopquatgio: res.data,
        loading: false
      });
    } catch (error) {
      message.error('Không thể tải danh mục bơm nước');
      set({ loading: false });
    }
  },

  getTonghopquatgioPaging:async(req)=>{
    set({loading:true});
    try {  
      const data=await tonghopquatgioService.getTonghopquatgioPaging(req);     
      set({dataTonghopquatgio:data.data.items,totalRecords:data.data.totalRecords,loading:false})
    } catch (error) {
       message.error('Failed to get TonghopbomnuocPaging');
        set({ loading: false }); 
    }
  },

  // ================= CREATE =================
  createTonghopquatgio: async (payload) => {
    set({ loading: true });
    try {
      const res = await tonghopquatgioService.addTonghopquatgio(payload);
      set({
        dataTonghopquatgio: [...get().dataTonghopquatgio, res.data],
        loading: false
      });
    
    } catch (error) {
      message.error('Thêm mới thất bại');
      set({ loading: false });
    }
  },

  // ================= UPDATE =================
  updateTonghopquatgio: async (id,payload) => {
  const items={id,...payload};
    set({ loading: true });
    try {
      const res = await tonghopquatgioService.updateTonghopquatgio(items);
      const newData = get().dataTonghopquatgio.map(item =>
        item.id === res.data.id ? res.data : item
      );
      set({
        dataTonghopquatgio: newData,
        loading: false
      });     
    } catch (error) {
      message.error('Cập nhật thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE ONE =================
  deleteTonghopquatgio: async (id) => {
    set({ loading: true });
    try {
      await tonghopquatgioService.deleteTonghopquatgio(id);
      set({
        dataTonghopquatgio: get().dataTonghopquatgio.filter(item => item.id !== id),
        loading: false
      });
    
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },

  // ================= DELETE MULTIPLE =================
  deleteMultipleTonghopquatgio: async (ids) => {
    set({ loading: true });
    try {
      await tonghopquatgioService.deleteTonghopquatgios(ids);
      set({
        dataTonghopquatgio: get().dataTonghopquatgio.filter(
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