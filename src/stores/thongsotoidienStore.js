import { create } from 'zustand';
import { message } from 'antd';
import { thongsokythuattoidienService } from '../services/toidien/thongsotoidienService';
export const useThongsotoidienStore=create((set,get)=>({
dataThongso:[],
loading: false,
fetchThongsotoidien:async()=>{
    set({loading:true});
    try {
        const data= await thongsokythuattoidienService.getThongsokythuattoidien();
        set({dataThongso:data.data,loading:false})
    } catch (error) {
       message.error('Failed to fetch Thongsotoidien');
      set({ loading: false });  
    }
},
createThongsotoidien: async (Thongso) => {
    set({ loading: true });
    try {
      const data = await thongsokythuattoidienService.createThongsokythuattoidien(Thongso);
      set({ dataThongso: [...get().dataThongso, data], loading: false });
    } catch (error) {
      message.error('Failed to create Thongsotoidien');
      set({ loading: false });
    }
  },
 updateThongsotoidien: async (id, Thongso) => {
    set({ loading: true });
    try {
      const data = await thongsokythuattoidienService.updateThongsokythuattoidien(id, Thongso);
      const updatedThongsotoitruc = get().dataThongso.map((dv) => (dv._id === id ? data : dv));
      set({ dataThongso: updatedThongsotoitruc, loading: false });
    } catch (error) {
      message.error('Failed to update Thongsotoidien');
      set({ loading: false });
    }
  },
  deleteThongsotoidien: async (id) => {
    set({ loading: true });
    try {
      await thongsokythuattoidienService.deleteThongsokythuattoidien(id);
      set({ 
        dataThongso: get().dataThongso.filter((item) => item._id !== id), 
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
        await thongsokythuattoidienService.deleteMultipleThongsokythuattoidien(selectedIds);        
        
        const currentData = get().dataThongso;
        // Sử dụng item.id để khớp với rowKey="id" trong Table
        const newData = currentData.filter(item => !selectedIds.includes(item.id));        
        
        set({ dataThongso: newData, loading: false });
    } catch (error) {
        message.error('Lỗi khi xóa nhiều bản ghi');
        set({ loading: false });
        throw error; // Quăng lỗi để Component bắt được
    }
}
}));