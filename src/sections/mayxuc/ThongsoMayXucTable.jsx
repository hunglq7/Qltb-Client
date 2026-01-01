import React, { useEffect } from 'react';
import { Table, Spin } from 'antd';
import { useThongsomayxucStore } from '../../stores/thongsomayxucStore';

function ThongsoMayXucTable({ thongsomayxuc }) {
  const { dataThongsoMayxuc, getThongsomayxucById, loading } = useThongsomayxucStore();

  useEffect(() => {
    if (thongsomayxuc?.mayxucId) {
      getThongsomayxucById(thongsomayxuc.mayxucId);
    }
  }, [thongsomayxuc?.mayxucId]);

  const columns = [
    {
      title: 'Nội dung',
      dataIndex: 'noiDung'
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'donViTinh',
      width: 150
    },
    {
      title: 'Thông số',
      dataIndex: 'thongSo',
      width: 150
    }
  ];

  return (
    <Spin spinning={loading}>
      <Table
        rowKey="id"
        dataSource={Array.isArray(dataThongsoMayxuc) ? dataThongsoMayxuc : []}
        columns={columns}
        pagination={false}
        bordered
      />
    </Spin>
  );
}

export default ThongsoMayXucTable;
