import { create } from 'zustand';
import { message } from 'antd';
import { loaithietbiService } from '/src/services/loaithietbi/loaithietbiService';
export const useLoaithietbiStore=create((set,get)=>({
dataLoaithietbi:[],
loading: false,
fetchLoaithietbi:async()=>{
    set({loading:true});
    try {
        const data= await loaithietbiService.getLoaithietbi();
        set({dataLoaithietbi:data.data,loading:false})
    } catch (error) {
       message.error('Failed to fetch Loaithietbi');
      set({ loading: false });  
    }
},
createLoaithietbi: async (items) => {
    set({ loading: true });
    try {
      const data = await loaithietbiService.addLoaithietbi(items);
      set({ dataLoaithietbi: [...get().dataLoaithietbi, data], loading: false });
    } catch (error) {
      message.error('Failed to create Loaithietbi');
      set({ loading: false });
    }
  },
 updateLoaithietbi: async (items) => {
    set({ loading: true });
    try {
      const data = await loaithietbiService.updateLoaithietbi(items);
      const updatedLoaithietbi = get().dataLoaithietbi.map((dv) => (dv._id === id ? data : dv));
      set({ dataLoaithietbi: updatedLoaithietbi, loading: false });
    } catch (error) {
      message.error('Failed to update Loaithietbi');
      set({ loading: false });
    }
  },
  deleteLoaithietbi: async (id) => {
    set({ loading: true });
    try {
      await loaithietbiService.deleteLoaithietbi(id);
      set({ 
        dataLoaithietbi: get().dataLoaithietbi.filter((item) => item._id !== id), 
        loading: false 
      });
      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },
  // Thêm vào useLoaithietbiStore
deleteMultiple: async (selectedIds) => {
    set({ loading: true });
    try {
        // Tạo danh sách object chứa Id để gửi lên Backend theo yêu cầu của C# 
        await loaithietbiService.deleteLoaithietbis(selectedIds);        
        // Cập nhật lại danh sách local sau khi xóa thành công
        const currentData = get().dataLoaithietbi;
        const newData = currentData.filter(item => !selectedIds.includes(item._id || item.id));        
        set({ dataLoaithietbi: newData, loading: false });
        message.success('Xóa các bản ghi thành công');
    } catch (error) {
        message.error('Lỗi khi xóa nhiều bản ghi');
        set({ loading: false });
    }
}
}));