import { useEffect, useState } from 'react';
import { Space, Button, Popconfirm, Table } from 'antd';
import ActionBar from '/src/sections/mayxuc/ActionBar';
import SearchBar from '/src/sections/mayxuc/SearchBar';
import ThongSoModal from '/src/sections/mayxuc/ThongSoModal';
import { thongsomayxucService } from '../../services/mayxuc/thongsomayxucService';
import { danhmucmayxucService } from '../../services/mayxuc/danhmucmayxucService';

function CapnhatThongsoMayxuc() {
  const [data, setData] = useState([]);
  const [mayXucList, setMayXucList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  //   const loadData = async (keyword = '') => {
  //     setLoading(true);
  //     const res = await thongsomayxucService.getThongsomayxuc(keyword);
  //     setData(res || []);
  //     setLoading(false);
  //   };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await thongsomayxucService.getThongsomayxuc();
      console.log(res.data);
      setData(res.data || []);
    } catch (err) {
      message.error('Không tải được dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchMayxuc = async () => {
    try {
      const res = await danhmucmayxucService.getDanhmucmayxucs();
      setMayXucListt(res.data || []);
    } catch {
      message.error('Không tải được danh mục máy cào');
    }
  };
  useEffect(() => {
    fetchData();
    fetchMayxuc();
  }, []);

  const handleSubmit = async (values) => {
    if (editing) {
      await thongsomayxucService.updateThongsomayxuc(values);
      message.success('Cập nhật thành công');
    } else {
      await thongsomayxucService.addThongsomayxuc(values);
      message.success('Thêm mới thành công');
    }
    setModalOpen(false);
    setEditing(null);
    fetchData();
  };

  const handleDelete = async (id) => {
    await thongsomayxucService.deleteThongsomayxuc(id);
    message.success('Xóa thành công');
    fetchData();
  };

  const handleDeleteMultiple = async () => {
    await thongsomayxucService.deleteSelectThongsomayxuc(selectedRowKeys);
    message.success('Xóa nhiều thành công');
    setSelectedRowKeys([]);
    fetchData();
  };

  const columns = [
    { title: 'Máy xúc', dataIndex: 'tenMayXuc' },
    { title: 'Nội dung', dataIndex: 'noiDung' },
    { title: 'Đơn vị tính', dataIndex: 'donViTinh' },
    { title: 'Thông số', dataIndex: 'thongSo' },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setEditing(record);
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm title="Xóa bản ghi?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];
  return (
    <>
      <Space>
        <SearchBar onSearch={fetchData} />

        <ActionBar
          onAdd={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          onDeleteMultiple={handleDeleteMultiple}
          disabledDelete={selectedRowKeys.length === 0}
          data={data}
        />
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
      />

      <ThongSoModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editing}
        mayXucList={mayXucList}
      />
    </>
  );
}

export default CapnhatThongsoMayxuc;
