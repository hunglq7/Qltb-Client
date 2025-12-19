import { useEffect, useState, useMemo } from 'react';
import { Space, Button, Popconfirm, Table, Row, Col, message, Form } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ActionBar from '/src//mayxuc/ActionBar';
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
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await thongsomayxucService.getThongsomayxuc();
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
      setMayXucList(res.data || []);
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
  const handleOpenAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
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
    { title: 'Thiết bị', dataIndex: 'tenThietBi' },
    { title: 'Nội dung', dataIndex: 'noiDung' },
    { title: 'Đơn vị tính', dataIndex: 'donViTinh' },
    { title: 'Thông số', dataIndex: 'thongSo' },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(record);
              setModalOpen(true);
            }}
          ></Button>
          <Popconfirm title="Xóa bản ghi?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // ================= SEARCH =================
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    return data.filter((item) => Object.values(item).join(' ').toLowerCase().includes(searchText.toLowerCase()));
  }, [data, searchText]);

  return (
    <>
      <Row gutter={8}>
        <Col flex="auto">
          <SearchBar onSearch={setSearchText} />
        </Col>
        <Col>
          <ActionBar
            handleOpenAdd={handleOpenAdd}
            onDeleteMultiple={handleDeleteMultiple}
            disabledDelete={selectedRowKeys.length === 0}
            data={data}
          />
        </Col>
      </Row>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
      />

      <ThongSoModal
        open={modalOpen}
        form={form}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editing}
        mayXucList={mayXucList}
      />
    </>
  );
}

export default CapnhatThongsoMayxuc;
