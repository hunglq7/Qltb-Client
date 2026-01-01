import { create } from 'zustand';
import { message } from 'antd';
import { donviService } from '../services/donvi/donviService';
export const useDonviStore=create((set,get)=>({
dataDonvi:[],
loading: false,
fetchDonvi:async()=>{
    set({loading:true});
    try {
        const data= await donviService.getDonvi();
        set({dataDonvi:data.data,loading:false})
    } catch (error) {
       message.error('Failed to fetch Donvi');
      set({ loading: false });  
    }
},
createDonvi: async (items) => {
    set({ loading: true });
    try {
      const data = await donviService.addDonvi(items);
      set({ dataDonvi: [...get().dataDonvi, data], loading: false });
    } catch (error) {
      message.error('Failed to create Donvi');
      set({ loading: false });
    }
  },
 updateDonvi: async (items) => {
    set({ loading: true });
    try {
      const data = await donviService.updateDonvi(items);
      const updatedDonvi = get().dataDonvi.map((dv) => (dv._id === id ? data : dv));
      set({ dataDonvi: updatedDonvi, loading: false });
    } catch (error) {
      message.error('Failed to update Donvi');
      set({ loading: false });
    }
  },
  deleteDonvi: async (id) => {
    set({ loading: true });
    try {
      await donviService.deleteDonvi(id);
      set({ 
        dataDonvi: get().dataDonvi.filter((item) => item._id !== id), 
        loading: false 
      });
      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },
  // Thêm vào useDonviStore
deleteMultiple: async (selectedIds) => {
    set({ loading: true });
    try {
        // Tạo danh sách object chứa Id để gửi lên Backend theo yêu cầu của C# 
        await donviService.deleteDonvis(selectedIds);        
        // Cập nhật lại danh sách local sau khi xóa thành công
        const currentData = get().dataDonvi;
        const newData = currentData.filter(item => !selectedIds.includes(item._id || item.id));        
        set({ dataDonvi: newData, loading: false });
        message.success('Xóa các bản ghi thành công');
    } catch (error) {
        message.error('Lỗi khi xóa nhiều bản ghi');
        set({ loading: false });
    }
}
}));