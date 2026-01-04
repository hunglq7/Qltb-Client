import { create } from 'zustand';
import { message } from 'antd';
import { danhmuctoidienService } from '/src/services/toidien/danhmuctoidienService';
export const useDanhmuctoidienStore=create((set,get)=>({
dataDanhmuc:[],
loading: false,
fetchDanhmuctoidien:async()=>{
    set({loading:true});
    try {
        const data= await danhmuctoidienService.getDanhmuctoidien();
        set({dataDanhmuc:data.data,loading:false})
    } catch (error) {
       message.error('Failed to fetch danhmuctoidien');
      set({ loading: false });  
    }
},
createDanhmuctoidien: async (danhmuc) => {
    set({ loading: true });
    try {
      const data = await danhmuctoidienService.createDanhmuctoidien(danhmuc);
      set({ dataDanhmuc: [...get().dataDanhmuc, data], loading: false });
    } catch (error) {
      message.error('Failed to create danhmuctoidien');
      set({ loading: false });
    }
  },
 updateDanhmuctoidien: async (id, danhmuc) => {
    set({ loading: true });
    try {
      const data = await danhmuctoidienService.updateDanhmuctoidien(id, danhmuc);
      const updatedDanhmuctoitruc = get().dataDanhmuc.map((dv) => (dv._id === id ? data : dv));
      set({ dataDanhmuc: updatedDanhmuctoitruc, loading: false });
    } catch (error) {
      message.error('Failed to update danhmuctoidien');
      set({ loading: false });
    }
  },
  deleteDanhmuctoidien: async (id) => {
    set({ loading: true });
    try {
      await danhmuctoidienService.deleteDanhmuctoidien(id);
      set({ 
        dataDanhmuc: get().dataDanhmuc.filter((item) => item._id !== id), 
        loading: false 
      });
      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },
  // Thêm vào useDanhmuctoidienStore
deleteMultiple: async (selectedIds) => {
    set({ loading: true });
    try {
        // Tạo danh sách object chứa Id để gửi lên Backend theo yêu cầu của C# 
        await danhmuctoidienService.deleteMultipleDanhmuctoidien(selectedIds);        
        // Cập nhật lại danh sách local sau khi xóa thành công
        const currentData = get().dataDanhmuc;
        const newData = currentData.filter(item => !selectedIds.includes(item._id || item.id));        
        set({ dataDanhmuc: newData, loading: false });
        message.success('Xóa các bản ghi thành công');
    } catch (error) {
        message.error('Lỗi khi xóa nhiều bản ghi');
        set({ loading: false });
    }
}
}));