import { create } from 'zustand';
import { message } from 'antd';
import { thongsomayxucService } from '../services/mayxuc/thongsomayxucService';

export const useThongsomayxucStore = create((set, get) => ({
  dataThongsoMayxuc: [],
  loading: false,

  fetchThongsomayxuc:async()=>{
    set({loading:true});
    try {
        const data= await thongsomayxucService.getThongsomayxuc();
        set({dataThongsoMayxuc:data.data,loading:false})
    } catch (error) {
       message.error('Failed to fetch Thongsotoidien');
      set({ loading: false });  
    }
},
 getThongsomayxucById: async (id) => {
  set({ loading: true });
  try {
    const res = await thongsomayxucService.getThongsomayxucDetailById(id);
console.log(res)
    const list = Array.isArray(res.data)
      ? res.data
      : res.data?.data || [];

    set({
      dataThongsoMayxuc: list,
      loading: false
    });
  } catch {
    set({ dataThongsoMayxuc: [], loading: false });
  }
},

  createThongsomayxuc: async (data) => {
    set({ loading: true });
    try {
      const res = await thongsomayxucService.addThongsomayxuc(data);
      set({
        dataThongsoMayxuc: [...get().dataThongsoMayxuc, res.data],
        loading: false
      });
      message.success('Thêm thành công');
    } catch {
      message.error('Thêm thất bại');
      set({ loading: false });
    }
  },
 updateThongsomayxuc: async (id,items) => {
    set({ loading: true });
    try {
      const mayxucs={
        id:id,
        ...items
      }
      const data = await thongsomayxucService.updateThongsomayxuc(mayxucs);
      const updatedThongsomayxuc= get().dataThongsoMayxuc.map((dv) => (dv.id === id ? data : dv));
      set({ dataThongsoMayxuc: updatedThongsomayxuc, loading: false });
    } catch (error) {
      message.error('Failed to update Thongsomayxuc');
      set({ loading: false });
    }
  },
   deleteThongsomayxuc: async (id) => {
    set({ loading: true });
    try {
      await thongsomayxucService.deleteThongsomayxuc(id);
      set({
        dataThongsoMayxuc: get().dataThongsoMayxuc.filter(item => item.id !== id),
        loading: false
      });
      message.success('Xóa thành công');
    } catch {
      message.error('Xóa thất bại');
      set({ loading: false });
    }
  },

  deleteMultiple: async (ids) => {
    set({ loading: true });
    try {
      await thongsomayxucService.deleteSelectThongsomayxuc(ids);
      set({
        dataThongsoMayxuc: get().dataThongsoMayxuc.filter(
          item => !ids.includes(item.id)
        ),
        loading: false
      });
      message.success('Xóa nhiều thành công');
    } catch {
      message.error('Xóa nhiều thất bại');
      set({ loading: false });
    }
  }
}));