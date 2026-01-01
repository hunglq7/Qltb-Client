import { create } from 'zustand';
import { message } from 'antd';
import { tonghoptoidienService } from '../services/toidien/capnhattoidienService';
export const useTonghoptoidienStore=create((set,get)=>({
dataTonghop:[],
loading: false,
fetchTonghoptoidien:async()=>{
    set({loading:true});
    try {
        const data= await tonghoptoidienService.getTonghoptoidien();
        set({dataTonghop:data.data,loading:false})
    } catch (error) {
       message.error('Failed to fetch Tonghoptoidien');
      set({ loading: false });  
    }
},
createTonghoptoidien: async (items) => {
    set({ loading: true });
    try {
      const data = await tonghoptoidienService.createTonghoptoidien(items);
      set({ dataTonghop: [...get().dataTonghop, data], loading: false });
    } catch (error) {
      message.error('Failed to create Tonghoptoidien');
      set({ loading: false });
    }
  },
 updateTonghoptoidien: async (id,items) => {
    set({ loading: true });
    try {
      const toidiens={
        id:id,
        ...items
      }
      const data = await tonghoptoidienService.updateTonghoptoidien(toidiens);
      const updatedTonghoptoitruc = get().dataTonghop.map((dv) => (dv.id === id ? data : dv));
      set({ dataTonghop: updatedTonghoptoitruc, loading: false });
    } catch (error) {
      message.error('Failed to update Tonghoptoidien');
      set({ loading: false });
    }
  },
  deleteTonghoptoidien: async (id) => {
    set({ loading: true });
    try {
      await tonghoptoidienService.deleteTonghoptoidien(id);
      set({ 
        dataTonghop: get().dataTonghop.filter((item) => item._id !== id), 
        loading: false 
      });
      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },
  // Thêm vào useThongsotoidienStore
deleteMultiple: async (selectedIds) => {
    set({ loading: true });
    try {
        // selectedIds phải là mảng phẳng [1, 2, 3]
        await tonghoptoidienService.deleteMultipleTonghoptoidien(selectedIds);        
        
        const currentData = get(). dataTonghop;
        // Sử dụng item.id để khớp với rowKey="id" trong Table
        const newData = currentData.filter(item => !selectedIds.includes(item.id));        
        
        set({  dataTonghop: newData, loading: false });
    } catch (error) {
        message.error('Lỗi khi xóa nhiều bản ghi');
        set({ loading: false });
        throw error; // Quăng lỗi để Component bắt được
    }
}
}));