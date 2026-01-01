import { create } from 'zustand';
import { message } from 'antd';
import { tonghopmayxucService } from '../services/mayxuc/tonghopmayxucService';
export const useTonghopmayxucStore=create((set,get)=>({
dataTonghopMayxuc:[],
loading: false,
fetchTonghopmayxuc:async()=>{
    set({loading:true});
    try {
        const data= await tonghopmayxucService.getMayxuc();
        set({dataTonghopMayxuc:data.data,loading:false})
    } catch (error) {
       message.error('Failed to fetch Tonghopmayxuc');
      set({ loading: false });  
    }
},
createTonghopmayxuc: async (items) => {
    set({ loading: true });
    try {
      const data = await tonghopmayxucService.addTonghopmayxuc(items);
      set({ dataTonghopMayxuc: [...get().dataTonghopMayxuc, data], loading: false });
    } catch (error) {
      message.error('Failed to create Tonghopmayxuc');
      set({ loading: false });
    }
  },
 updateTonghopmayxuc: async (id,items) => {
    set({ loading: true });
    try {
      const mayxucs={
        id:id,
        ...items
      }
      const data = await tonghopmayxucService.updateTonghopmayxuc(mayxucs);
      const updatedTonghopmayxuc= get().dataTonghopMayxuc.map((dv) => (dv.id === id ? data : dv));
      set({ dataTonghopMayxuc: updatedTonghopmayxuc, loading: false });
    } catch (error) {
      message.error('Failed to update Tonghopmayxuc');
      set({ loading: false });
    }
  },
  deleteTonghopmayxuc: async (id) => {
    set({ loading: true });
    try {
      await tonghopmayxucService.deleteMayxuc(id);
      set({ 
        dataTonghopMayxuc: get().dataTonghopMayxuc.filter((item) => item._id !== id), 
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
        await tonghopmayxucService.deleteMayxucs(selectedIds);        
        
        const currentData = get(). dataTonghopMayxuc;
        // Sử dụng item.id để khớp với rowKey="id" trong Table
        const newData = currentData.filter(item => !selectedIds.includes(item.id));        
        
        set({  dataTonghopMayxuc: newData, loading: false });
    } catch (error) {
        message.error('Lỗi khi xóa nhiều bản ghi');
        set({ loading: false });
        throw error; // Quăng lỗi để Component bắt được
    }
}
}));