import { useEffect, useState, useMemo } from 'react';
import { Space, Button, Popconfirm, Table, Row, message, Form, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainCard from '/src/components/MainCard';
import ActionBar from '/src/components/ActionBar';
import SearchBar from '/src/components/SearchBar';
import ThongsoForm from '../../components/ThongsoForm';
import { useDanhmucquatgioStore } from '../../stores/quatgio/danhmucquatgioStore';
import { useThongsoquatgioStore } from '../../stores/quatgio/thongsoquatgioStore';
import * as XLSX from 'xlsx';

const Thongsoquatgio = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const { dataDanhmucquatgio, fetchDanhmucquatgio } = useDanhmucquatgioStore();
  const {
    dataThongsoquatgio,
    loading,
    fetchThongsoquatgio,
    createThongsoquatgio,
    updateThongsoquatgio,
    deleteThongsoquatgio,
    deleteMultipleThongsoquatgio
  } = useThongsoquatgioStore();
  //================= Load Data ===========================
  useEffect(() => {
    fetchDanhmucquatgio();
    fetchThongsoquatgio();
  }, []);
  const dataSource = useMemo(() => {
    return [
      ...dataThongsoquatgio.map((item) => ({
        ...item
      }))
    ];
  }, [dataThongsoquatgio]);

  // ================= Acction ADD =================

  const handleOpenAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  // ================= Acction EDIT =================
  const handleOpenEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      quatGioId: record.quatGioId,
      noiDung: record.noiDung,
      donViTinh: record.donViTinh,
      thongSo: record.thongSo
    });
    setModalOpen(true);
  };
  // ================= DELETE =================
  const handleDelete = async (id) => {
    await deleteThongsoquatgio(id);
    message.success('Xóa thành công');
    fetchThongsoquatgio();
  };

  // ================= DELETE MULTIPLE =================
  const handleDeleteMultiple = async () => {
    try {
      // Lọc lấy các ID hợp lệ (kiểu number) trước khi gửi
      const ids = selectedRowKeys.filter((key) => typeof key === 'number');
      if (ids.length > 0) {
        await deleteMultipleThongsoquatgio(ids);
        message.success('Xóa nhiều thành công');
        setSelectedRowKeys([]);
        fetchThongsoquatgio();
      }
    } catch (error) {
      console.error('Lỗi:', error);
      message.error('Xóa bản ghi đã chọn thất bại');
    }
  };

  // ================= SAVE =================
  const handleSubmit = async (values) => {
    if (editing) {
      await updateThongsoquatgio(editing.id, values);
      message.success('Cập nhật thành công');
    } else {
      await createThongsoquatgio(values);
      message.success('Thêm mới thành công');
    }
    fetchThongsoquatgio();
    setModalOpen(false);
    setEditing(null);
  };

  // ================= SEARCH =================
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;
    return dataSource.filter((item) => Object.values(item).join(' ').toLowerCase().includes(searchText.toLowerCase()));
  }, [dataSource, searchText]);

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Thiết bị': item.tenThietBi,
      'Nội dung': item.noiDung,
      'Đơn vị tính': item.donViTinh,
      'Thông số kỹ thuật': item.thongSo
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Thiết bị', 'Nội dung', 'Đơn vị tính', 'Thông số kỹ thuật']
    });

    worksheet['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 45 }, { wch: 15 }, { wch: 30 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ThongSoQuatGio');
    XLSX.writeFile(workbook, 'Thong-So-Quat-Gio.xlsx');
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
          <Button icon={<EditOutlined />} onClick={() => handleOpenEdit(record)}></Button>
          <Popconfirm title="Xóa bản ghi?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Space>
      )
    }
  ];
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

        <Modal
          zIndex={1500}
          title={editing ? 'Cập nhật' : 'Thêm mới'}
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={() => form.submit()}
        >
          <ThongsoForm
            form={form}
            onSubmit={handleSubmit}
            selectDataList={dataThongsoquatgio}
            selectLable={'Thiết bị'}
            selectName={'quatGioId'}
          />
        </Modal>
      </MainCard>
    </>
  );
};

export default Thongsoquatgio;
