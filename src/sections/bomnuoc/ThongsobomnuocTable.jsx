import { useEffect } from 'react';
import { Table, Spin } from 'antd';
import { useThongsobomnuocStore } from '../../stores/bomnuoc/thongsobomnuocStore';
const ThongsobomnuocTable = ({ tonghopbomnuoc }) => {
  const { dataThongsobomnuoc, loading, getThongsobomnuocById } = useThongsobomnuocStore();
  useEffect(() => {
    if (tonghopbomnuoc?.thietbiId) {
      getThongsobomnuocById(tonghopbomnuoc?.thietbiId);
    }
  }, [tonghopbomnuoc?.thietbiId]);
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
        dataSource={Array.isArray(dataThongsobomnuoc) ? dataThongsobomnuoc : []}
        columns={columns}
        pagination={false}
        bordered
      />
    </Spin>
  );
};

export default ThongsobomnuocTable;
