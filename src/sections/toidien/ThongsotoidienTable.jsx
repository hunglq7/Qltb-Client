import { useEffect, memo } from 'react';
import { Table, Spin } from 'antd';
import { useThongsotoidienStore } from '../../stores/toidien/thongsotoidienStore';
function ThongsotoidienTable({ tonghoptoidien }) {
  const { dataThongso, getThongsotoidienById, loading } = useThongsotoidienStore();
  useEffect(() => {
    if (tonghoptoidien?.thietbiId) {
      getThongsotoidienById(tonghoptoidien.thietbiId);
    }
  }, [tonghoptoidien?.thietbiId]);
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
      <Table rowKey="id" dataSource={Array.isArray(dataThongso) ? dataThongso : []} columns={columns} pagination={false} bordered />
    </Spin>
  );
}

export default memo(ThongsotoidienTable);
