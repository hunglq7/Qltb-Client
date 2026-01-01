import { useEffect, useState, useMemo } from 'react';
import { Space, Button, Popconfirm, Table, Row, message, Form } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import ActionBar from '/src/components/ActionBar';
import SearchBar from '/src/components/SearchBar';
import ThongSoModal from '/src/sections/mayxuc/ThongSoModal';
import { thongsomayxucService } from '../../services/mayxuc/thongsomayxucService';
import { danhmucmayxucService } from '../../services/mayxuc/danhmucmayxucService';
import * as XLSX from 'xlsx';

function CapnhatThongsoMayxuc() {
  const [data, setData] = useState([]);
  const [mayXucList, setMayXucList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // ================= LOAD DATA =================
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

  // ================= ADD =================

  const handleOpenAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await thongsomayxucService.deleteThongsomayxuc(id);
    message.success('Xóa thành công');
    fetchData();
  };
  // ================= DELETE MULTIPLE =================
  const handleDeleteMultiple = async () => {
    try {
      await thongsomayxucService.deleteSelectThongsomayxuc(selectedRowKeys);
      message.success('Xóa nhiều thành công');
      setSelectedRowKeys([]);
      fetchData();
    } catch (error) {
      console.log('error,', error);
      message.error('Xóa bản ghi thất bại');
    }
  };

  // ================= SAVE =================
  const handleSubmit = async (values) => {
    if (editing) {
      await thongsomayxucService.updateThongsomayxuc(editing.id, values);
      message.success('Cập nhật thành công');
    } else {
      await thongsomayxucService.addThongsomayxuc(values);
      message.success('Thêm mới thành công');
    }
    setModalOpen(false);
    setEditing(null);
    fetchData();
  };

  // ================= CREATE COLUMS =================
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

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Thiết bị': mayXucList.find((x) => x.id === item.mayXucId)?.tenThietBi || '',
      'Nội dung': item.noiDung,
      'Đơn vị tính': item.donViTinh,
      'Thông số kỹ thuật': item.thongSo
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Thiết bị', 'Nội dung', 'Đơn vị tính', 'Thông số kỹ thuật']
    });

    worksheet['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 45 }, { wch: 15 }, { wch: 30 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ThongSoThietBi');
    XLSX.writeFile(workbook, 'Thong-So-Thiet-Bi.xlsx');
  };

  return (
    <>
      <Row gutter={8} style={{ marginBottom: 12 }}>
        <SearchBar onSearch={setSearchText} />
        <ActionBar
          handleOpenAdd={handleOpenAdd}
          onDeleteMultiple={handleDeleteMultiple}
          disabledDelete={selectedRowKeys.length === 0}
          selectedRowKeys={selectedRowKeys}
          handleExportExcel={handleExportExcel}
        />
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
