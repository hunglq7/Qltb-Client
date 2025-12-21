import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { thongsomayxucService } from '../../services/mayxuc/thongsomayxucService';

function ThongsoMayXucTable({ thongsomayxuc }) {
  const [data, setData] = useState([]);
  const thongsomayxucData = thongsomayxuc;
  // ================= GET DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await thongsomayxucService.getThongsomayxucDetailById(thongsomayxucData.mayXucId);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [thongsomayxucData]);
  const columns = [
    { title: 'Nội dung', dataIndex: 'noiDung', key: 'noiDung' },
    { title: 'Đơn vị tính', dataIndex: 'donViTinh', key: 'donViTinh' },
    { title: 'Thông số', dataIndex: 'thongSo', key: 'thongSo' }
  ];
  return <Table dataSource={data} columns={columns} pagination={false} rowKey="id" />;
}
export default ThongsoMayXucTable;
