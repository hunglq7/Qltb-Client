import { create } from 'zustand';
import { message } from 'antd';
import { danhmucmayxucService } from '../services/mayxuc/danhmucmayxucService';
export const useDanhmucmayxucStore=create((set,get)=>({
dataDanhmucMayxuc:[],
loading: false,
fetchDanhmucmayxuc:async()=>{
    set({loading:true});
    try {
        const data= await danhmucmayxucService.getDanhmucmayxucs();
        set({dataDanhmucMayxuc:data.data,loading:false})
    } catch (error) {
       message.error('Failed to fetch Danhmucmayxuc');
      set({ loading: false });  
    }
},
createDanhmucmayxuc: async (items) => {
    set({ loading: true });
    try {
      const data = await danhmucmayxucService.addMayxuc(items);
      set({ dataDanhmucMayxuc: [...get().dataDanhmucMayxuc, data], loading: false });
    } catch (error) {
      message.error('Failed to create Danhmucmayxuc');
      set({ loading: false });
    }
  },
 updateDanhmucmayxuc: async (id,items) => {
    set({ loading: true });
    try {
      const mayxucs={
        id:id,
        ...items
      }
      const data = await danhmucmayxucService.updateMayxuc(mayxucs);
      const updatedDanhmucmayxuc= get().dataDanhmucMayxuc.map((dv) => (dv.id === id ? data : dv));
      set({ dataDanhmucMayxuc: updatedDanhmucmayxuc, loading: false });
    } catch (error) {
      message.error('Failed to update Danhmucmayxuc');
      set({ loading: false });
    }
  },
  deleteDanhmucmayxuc: async (id) => {
    set({ loading: true });
    try {
      await danhmucmayxucService.deleteMayxuc(id);
      set({ 
        dataDanhmucMayxuc: get().dataDanhmucMayxuc.filter((item) => item._id !== id), 
        loading: false 
      });
      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },
  // Thêm vào useThongsomayxucStore
deleteMultiple: async (selectedIds) => {
    set({ loading: true });
    try {
        // selectedIds phải là mảng phẳng [1, 2, 3]
        await danhmucmayxucService.deleteDanhmucmayxucs(selectedIds);        
        
        const currentData = get(). dataDanhmucMayxuc;
        // Sử dụng item.id để khớp với rowKey="id" trong Table
        const newData = currentData.filter(item => !selectedIds.includes(item.id));        
        
        set({  dataDanhmucMayxuc: newData, loading: false });
    } catch (error) {
        message.error('Lỗi khi xóa nhiều bản ghi');
        set({ loading: false });
        throw error; // Quăng lỗi để Component bắt được
    }
}
}));