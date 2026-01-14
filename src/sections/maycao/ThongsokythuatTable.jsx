import React, { useEffect, useState, memo } from 'react';
import { Table } from 'antd';
import { thongsomaycaoService } from '../../services/maycao/thongsomaycaoService';

function ThongsokythuatTable({ thongsomaycao }) {
  const [data, setData] = useState([]);
  const thongsomaycaosData = thongsomaycao;

  // ================= GET DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await thongsomaycaoService.getThongsomaycaoDetailById(thongsomaycaosData.mayCaoId);

        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [thongsomaycaosData]);

  const columns = [
    { title: 'Nội dung', dataIndex: 'noiDung', key: 'noiDung' },
    { title: 'Đơn vị tính', dataIndex: 'donViTinh', key: 'donViTinh' },
    { title: 'Thông số', dataIndex: 'thongSo', key: 'thongSo' }
  ];
  return <Table dataSource={data} columns={columns} pagination={false} rowKey="id" />;
}

export default memo(ThongsokythuatTable);
