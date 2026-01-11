import { useEffect } from 'react';
import { Table, Spin } from 'antd';
import { useThongsoquatgioStore } from '../../stores/quatgio/thongsoquatgioStore';
const ThongsoquatgioTable = ({ tonghopquatgio }) => {
  const { dataThongsoquatgio, loading, getThongsoquatgioById } = useThongsoquatgioStore();
  useEffect(() => {
    if (tonghopquatgio?.thietbiId) {
      getThongsoquatgioById(tonghopquatgio?.thietbiId);
    }
  }, [tonghopquatgio?.thietbiId]);
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
        dataSource={Array.isArray(dataThongsoquatgio) ? dataThongsoquatgio : []}
        columns={columns}
        pagination={false}
        bordered
      />
    </Spin>
  );
};

export default ThongsoquatgioTable;
