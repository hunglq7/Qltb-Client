import { Button, Space } from 'antd';
import * as XLSX from 'xlsx';

export default function ActionBar({ onAdd, onDeleteMultiple, disabledDelete, data }) {
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ThongSoMayXuc');
    XLSX.writeFile(wb, 'thong-so-may-xuc.xlsx');
  };

  return (
    <Space style={{ marginBottom: 16 }}>
      <Button type="primary" onClick={onAdd}>
        Thêm mới
      </Button>

      <Button danger disabled={disabledDelete} onClick={onDeleteMultiple}>
        Xóa nhiều
      </Button>

      <Button onClick={exportExcel}>Xuất Excel</Button>
    </Space>
  );
}
