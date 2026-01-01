import { create } from 'zustand';
import { message } from 'antd';
import { nhatkymayxucService } from '../services/mayxuc/nhatkymayxucService';
export const useNhatkymayxucStore=create((set,get)=>({
dataNhatkyMayxuc:[],
loading: false,
getNhatkymayxucById:async(id)=>{
    set({loading:true});
    try {
        const data= await nhatkymayxucService.getNhatkyById(id);
        set({dataNhatkyMayxuc:data.data,loading:false})
    } catch (error) {
       message.error('Failed to fetch Nhatkymayxuc');
      set({ loading: false });  
    }
},
createNhatkymayxuc: async (items) => {
    set({ loading: true });
    try {
      const data = await nhatkymayxucService.addNhatkymayxuc(items);
      set({ dataNhatkyMayxuc: [...get().dataNhatkyMayxuc, data], loading: false });
    } catch (error) {
      message.error('Failed to create Nhatkymayxuc');
      set({ loading: false });
    }
  },
 updateNhatkymayxuc: async (id,items) => {
    set({ loading: true });
    try {
      const mayxucs={
        id:id,
        ...items
      }
      const data = await nhatkymayxucService.updateNhatkymayxuc(mayxucs);
      const updatedNhatkymayxuc= get().dataNhatkyMayxuc.map((dv) => (dv.id === id ? data : dv));
      set({ dataNhatkyMayxuc: updatedNhatkymayxuc, loading: false });
    } catch (error) {
      message.error('Failed to update Nhatkymayxuc');
      set({ loading: false });
    }
  },
  deleteNhatkymayxuc: async (id) => {
    set({ loading: true });
    try {
      await nhatkymayxucService.deleteNhatkymayxuc(id);
      set({ 
        dataNhatkyMayxuc: get().dataNhatkyMayxuc.filter((item) => item._id !== id), 
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
        await nhatkymayxucService.deleteNhatkyMayxucs(selectedIds);        
        
        const currentData = get(). dataNhatkyMayxuc;
        // Sử dụng item.id để khớp với rowKey="id" trong Table
        const newData = currentData.filter(item => !selectedIds.includes(item.id));        
        
        set({  dataNhatkyMayxuc: newData, loading: false });
    } catch (error) {
        message.error('Lỗi khi xóa nhiều bản ghi');
        set({ loading: false });
        throw error; // Quăng lỗi để Component bắt được
    }
}
}));