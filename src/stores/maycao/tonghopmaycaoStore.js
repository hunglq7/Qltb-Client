import { create } from 'zustand';
import { message } from 'antd';
import { tonghopmaycaoService } from '/src/services/maycao/tonghopmaycaoService';
export const useTonghopmaycaoStore=create((set,get)=>({
dataTonghopMaycao:[],
totalRecords:[],
loading: false,
fetchTonghopMaycao:async()=>{
    set({loading:true});
    try {
        const data= await tonghopmaycaoService.getMaycao();
        set({dataTonghopMaycao:data.data,loading:false})
    } catch (error) {
       message.error('Failed to fetch TonghopMaycao');
      set({ loading: false });  
    }
},

getTonghopMaycaoPaging:async(req)=>{
  set({loading:true});
  try {  
    const data=await tonghopmaycaoService.getTonghopmaycaoPaging(req);     
    set({dataTonghopMaycao:data.data.items,totalRecords:data.data.totalRecords,loading:false})
  } catch (error) {
     message.error('Failed to get TonghoptoidienPaging');
      set({ loading: false }); 
  }
},
createTonghopMaycao: async (items) => {
    set({ loading: true });
    try {
      const data = await tonghopmaycaoService.addTonghopmaycao(items);
      set({ dataTonghopMaycao: [...get().dataTonghopMaycao, data], loading: false });
    } catch (error) {
      message.error('Failed to create TonghopMaycao');
      set({ loading: false });
    }
  },
 updateTonghopMaycao: async (id,items) => {
    set({ loading: true });
    try {
      const Maycaos={
        id:id,
        ...items
      }
      const data = await tonghopmaycaoService.updateTonghopmaycao(Maycaos);
      const updatedTonghopMaycao= get().dataTonghopMaycao.map((dv) => (dv.id === id ? data : dv));
      set({ dataTonghopMaycao: updatedTonghopMaycao, loading: false });
    } catch (error) {
      message.error('Failed to update TonghopMaycao');
      set({ loading: false });
    }
  },
  deleteTonghopMaycao: async (id) => {
    set({ loading: true });
    try {
      await tonghopmaycaoService.deleteMaycao(id);
      set({ 
        dataTonghopMaycao: get().dataTonghopMaycao.filter((item) => item._id !== id), 
        loading: false 
      });
      message.success('Xóa thành công');
    } catch (error) {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },
  // Thêm vào useThongsoMaycaoStore
deleteMultiple: async (selectedIds) => {
    set({ loading: true });
    try {
        // selectedIds phải là mảng phẳng [1, 2, 3]
        await tonghopmaycaoService.deleteMaycaos(selectedIds);        
        
        const currentData = get(). dataTonghopMaycao;
        // Sử dụng item.id để khớp với rowKey="id" trong Table
        const newData = currentData.filter(item => !selectedIds.includes(item.id));        
        
        set({  dataTonghopMaycao: newData, loading: false });
    } catch (error) {
        message.error('Lỗi khi xóa nhiều bản ghi');
        set({ loading: false });
        throw error; // Quăng lỗi để Component bắt được
    }
}
}));