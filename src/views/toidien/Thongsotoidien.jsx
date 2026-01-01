import { useEffect, useState, useMemo } from 'react';
import { Space, Button, Popconfirm, Table, Row, message, Form } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainCard from '../../components/MainCard';
import ActionBar from '/src/components/ActionBar';
import SearchBar from '/src/components/SearchBar';
import ThongsoToidienModal from '/src/sections/toidien/ThongsoToidienModal';
import { useThongsotoidienStore } from '../../stores/thongsotoidienStore';
import { useDanhmuctoidienStore } from '../../stores/damuctoidienStore';
import * as XLSX from 'xlsx';

function Thongsotoidien() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { dataThongso, loading, fetchThongsotoidien, createThongsotoidien, updateThongsotoidien, deleteThongsotoidien, deleteMultiple } =
    useThongsotoidienStore();
  const { dataDanhmuc, fetchDanhmuctoidien } = useDanhmuctoidienStore();

  //================= Load Data ===========================
  useEffect(() => {
    fetchThongsotoidien();
    fetchDanhmuctoidien();
  }, []);

  const dataSource = useMemo(() => {
    return [
      ...dataThongso.map((item) => ({
        ...item
      }))
    ];
  }, [dataThongso]);

  // ================= Acction ADD =================

  const handleOpenAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await deleteThongsotoidien(id);
    message.success('Xóa thành công');
    fetchThongsotoidien();
  };

  // ================= DELETE MULTIPLE =================
  const handleDeleteMultiple = async () => {
    try {
      // Lọc lấy các ID hợp lệ (kiểu number) trước khi gửi
      const ids = selectedRowKeys.filter((key) => typeof key === 'number');
      if (ids.length > 0) {
        await deleteMultiple(ids);
        message.success('Xóa nhiều thành công');
        setSelectedRowKeys([]);
        fetchThongsotoidien();
      }
    } catch (error) {
      console.error('Lỗi:', error);
      message.error('Xóa bản ghi đã chọn thất bại');
    }
  };

  // ================= SAVE =================
  const handleSubmit = async (values) => {
    if (editing) {
      await updateThongsotoidien(values);
      fetchThongsotoidien();
      message.success('Cập nhật thành công');
    } else {
      await createThongsotoidien(values);
      fetchThongsotoidien();
      message.success('Thêm mới thành công');
    }
    setModalOpen(false);
    setEditing(null);
  };

  // ================= CREATE COLUMS =================
  const columns = [
    { title: 'Thiết bị', dataIndex: 'tenToiTruc' },
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
    if (!searchText) return dataSource;
    return dataThongso.filter((item) => Object.values(item).join(' ').toLowerCase().includes(searchText.toLowerCase()));
  }, [dataThongso, searchText]);

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Thiết bị': item.tenToiTruc,
      'Nội dung': item.noiDung,
      'Đơn vị tính': item.donViTinh,
      'Thông số kỹ thuật': item.thongSo
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Thiết bị', 'Nội dung', 'Đơn vị tính', 'Thông số kỹ thuật']
    });

    worksheet['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 45 }, { wch: 15 }, { wch: 30 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ThongSoToidien');
    XLSX.writeFile(workbook, 'Thong-So-Toi-Dien.xlsx');
  };
  return (
    <>
      <MainCard>
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

        <ThongsoToidienModal
          open={modalOpen}
          form={form}
          onCancel={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          initialValues={editing}
          toiTrucList={dataDanhmuc}
        />
      </MainCard>
    </>
  );
}

export default Thongsotoidien;
