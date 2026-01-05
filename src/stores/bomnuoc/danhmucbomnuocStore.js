import { create } from 'zustand';
import { message } from 'antd';
import { danhmucbomnuocService } from '../../services/bomnuoc/danhmucbomnuocService';
export const useDanhmucbomnuocStore=create((set,get)=>({
dataDanhmucbomnuoc:[],
loading: false,
fetchDanhmucbomnuoc:async()=>{
    set({loading:true});
    try {
        const data= await danhmucbomnuocService.getDanhmucbomnuoc()
        set({dataDanhmucbomnuoc:data.data,loading:false})
    } catch (error) {
       message.error('Failed to fetch Danhmucbomnuoc');
      set({ loading: false });  
    }
},
createDanhmucbomnuoc: async (items) => {
    set({ loading: true });
    try {
      const data = await danhmucbomnuocService.addDanhmucbomnuoc(items);
      set({ dataDanhmucbomnuoc: [...get().dataDanhmucbomnuoc, data], loading: false });
    } catch (error) {
      message.error('Failed to create Danhmucbomnuoc');
      set({ loading: false });
    }
  },
 updateDanhmucbomnuoc: async (items) => {

    set({ loading: true });
    try {
      
      const data = await danhmucbomnuocService.updateDanhmucbomnuoc(items);
   
      const updatedDanhmucbomnuoc= get().dataDanhmucbomnuoc.map((dv) => (dv.id === id ? data.items : dv));
      set({ dataDanhmucbomnuoc: updatedDanhmucbomnuoc, loading: false });
    } catch (error) {
      message.error('Failed to update Danhmucbomnuoc');
      set({ loading: false });
    }
  },
  deleteDanhmucbomnuoc: async (id) => {
    set({ loading: true });
    try {
      await danhmucbomnuocService.deleteDanhmucbomnuoc(id);
      set({ 
        dataDanhmucbomnuoc: get().dataDanhmucbomnuoc.filter((item) => item._id !== id), 
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
        await danhmucbomnuocService.deleteDanhmucbomnuocs(selectedIds); 
        
        const currentData = get(). dataDanhmucbomnuoc;
        // Sử dụng item.id để khớp với rowKey="id" trong Table
        const newData = currentData.filter(item => !selectedIds.includes(item.id));        
        
        set({  dataDanhmucbomnuoc: newData, loading: false });
    } catch (error) {
        message.error('Lỗi khi xóa nhiều bản ghi');
        set({ loading: false });
        throw error; // Quăng lỗi để Component bắt được
    }
}
}));