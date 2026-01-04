import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Form, Button, Space, Modal, Tabs, Table, message, Tag, Row, Popconfirm } from 'antd';
import MainCard from 'components/MainCard';
import { useDanhmuctoidienStore } from '../../stores/damuctoidienStore';
import { useTonghoptoidienStore } from '../../stores/tonghoptoidienStore';
import { useDonviStore } from '../../stores/donviStore';
import ThongsotoidienTable from '../../sections/toidien/ThongsotoidienTable';
import NhatkytoidienTable from '../../sections/toidien/NhatkytoidienTable';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import ActionBar from '/src/components/ActionBar';
import SearchBar from '/src/components/SearchBar';
import TonghopToidienForm from '../../sections/toidien/TonghopToidienForm';

function Capnhattoidien() {
  const [activeTab, setActiveTab] = useState('1');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [toiDien, setToiDien] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '',
    duPhong: null,
    tuNgay: null,
    denNgay: null
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [form] = Form.useForm();
  const { dataDanhmuc, fetchDanhmuctoidien } = useDanhmuctoidienStore();
  const { dataDonvi, fetchDonvi } = useDonviStore();
  const {
    dataTonghop,
    loading,
    fetchTonghoptoidien,
    createTonghoptoidien,
    updateTonghoptoidien,
    deleteTonghoptoidien,
    deleteMultiple,
    getTonghoptoidienPaging,
    totalRecords
  } = useTonghoptoidienStore();

  //================= Load Data ===========================
  useEffect(() => {
    fetchDonvi();
    fetchDanhmuctoidien();
    fetchData();
  }, []);

  // 1. Sửa hàm fetchData để đồng bộ pagination
  const fetchData = async (page = 1, size = 10) => {
    await getTonghoptoidienPaging({
      ...filters,
      pageIndex: page,
      pageSize: size
    });
    // Nếu bạn muốn quản lý state pagination tại component:
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: size
      // total: res.totalRecords // Lấy từ store hoặc res
    }));
  };

  // ================= ADD =================

  const handleOpenAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  // ================= EDIT =================
  const handleOpenEdit = (record) => {
    setEditing(record);
    setToiDien(record);
    form.setFieldsValue({
      ...record,
      ngayLap: record.ngayLap ? dayjs(record.ngayLap) : null
    });

    setModalOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await deleteTonghoptoidien(id);
    message.success('Xóa thành công');
    fetchTonghoptoidien();
  };

  // ================= DELETE SELECT =================
  const handleDeleteMultiple = async () => {
    try {
      await deleteMultiple(selectedRowKeys);
      message.success('Xóa nhiều thành công');
      setSelectedRowKeys([]);
      fetchTonghoptoidien();
    } catch (error) {
      console.log('error,', error);
      message.error('Xóa bản ghi thất bại');
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        ngayLap: values.ngayLap ? values.ngayLap.format('YYYY-MM-DD') : null
      };
      if (editing) {
        await updateTonghoptoidien(editing.id, payload);
        message.success('Cập nhật thành công');
      } else {
        await createTonghoptoidien(payload);
        message.success('Thêm mới thành công');
      }

      setModalOpen(false);
      setEditing(null);
      form.resetFields();
      fetchTonghoptoidien();
    } catch {
      message.error('Lưu dữ liệu thất bại');
    }
  };

  // ================= CREATE COLUMS =================

  const columns = [
    { title: 'Mã quản lý', dataIndex: 'maQuanLy', key: 'maQuanLy' },
    { title: 'Tên thiết bị', dataIndex: 'tenThietBi', key: 'tenThietBi' },
    { title: 'Đơn vị', dataIndex: 'phongBan', key: 'phongBan' },
    { title: 'Vị trí lắp đặt', dataIndex: 'viTriLapDat', key: 'viTriLapDat' },
    {
      title: 'Ngày lắp đặt',
      dataIndex: 'ngayLap',
      key: 'ngayLap',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '')
    },
    { title: 'Tình trạng TB', dataIndex: 'tinhTrangThietBi', key: 'tinhTrangThietBi' },
    {
      title: 'Dự phòng',
      dataIndex: 'duPhong',
      key: 'duPhong',
      render: (value) => <Tag color={value ? 'green' : 'red'}>{value ? 'Đang dùng' : 'Dự phòng'}</Tag>
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          <Popconfirm title="Xóa bản ghi?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // // ================= SEARCH =================
  // const filteredData = useMemo(() => {
  //   if (!searchText) return dataSource;

  //   return dataTonghop.filter((item) =>
  //     Object.values(item)
  //       .filter((v) => v !== null && v !== undefined)
  //       .join(' ')
  //       .toLowerCase()
  //       .includes(searchText.toLowerCase())
  //   );
  // }, [dataSource, searchText]);

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    const exportData = dataTonghop.map((item, index) => ({
      STT: index + 1,
      'Mã quản lý': item.maQuanLy,
      'Thiết bị': item.tenThietBi,
      'Ngày lắp': dayjs(item.ngayLap).format('DD/MM/YYYY'),
      'Đơn vị': item.phongBan,
      'Tình trạng thiết bị': item.tinhTrangThietBi,
      'Vị trí lắp đặt': item.viTriLapDat,
      'Dự phòng': item.duPhong ? 'Đang dùng' : 'Dự phòng'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Mã quản lý', 'Thiết bị', 'Ngày lắp', 'Đơn vị', 'Tình trạng thiết bị', 'Vị trí lắp đặt', 'Dự phòng']
    });

    worksheet['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 30 }, { wch: 15 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Capnhattoidien');
    XLSX.writeFile(workbook, `Cap-Nhat-Toi-Dien-${dayjs(new Date()).format('DD-MM-YYYY')}.xlsx`);
  };

  // Thay đổi danh sách các lựa chọn số bản ghi trên mỗi trang
  const sizeChange = ['10', '20', '50', '100', '500', '1000', '2000', '5000', '10000'];
  const tabItems = [
    {
      key: '1',
      label: 'CẬP NHẬT TỜI ĐIỆN',
      children: (
        <TonghopToidienForm
          open={modalOpen}
          form={form}
          editingRecord={editing}
          onCancel={() => setModalOpen(false)}
          handleSubmit={handleSubmit}
          initialValues={editing}
          toiTrucList={dataDanhmuc}
          donViList={dataDonvi}
        />
      )
    },
    {
      key: '2',
      label: 'NHẬT KÝ THIẾT BỊ',
      disabled: !editing,
      children: editing ? <NhatkytoidienTable tonghoptoidien={toiDien} /> : <div>Chọn bản ghi để xem nhật ký thiết bị</div>
    },
    {
      key: '3',
      label: 'THÔNG SỐ KỸ THUẬT',
      disabled: !editing,
      children: editing ? <ThongsotoidienTable tonghoptoidien={toiDien} /> : <div>Chọn bản ghi để xem thông số kỹ thuật</div>
    }
  ];

  return (
    <MainCard>
      <Row gutter={8} style={{ marginBottom: 12 }}>
        <SearchBar setFilters={setFilters} fetchData={fetchData} filters={filters} pagination={pagination} />
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
        dataSource={dataTonghop}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: totalRecords, // Lấy từ store
          onChange: (page, pageSize) => fetchData(page, pageSize), // Sửa lại cách gọi hàm
          showSizeChanger: true,
          pageSizeOptions: sizeChange, // Thêm dòng này để hiển thị các tùy chọn của bạn
          showTotal: (total) => `Tổng số: ${total} bản ghi`
        }}
      />

      <Modal
        title={editing ? 'Cập nhật thiết bị' : 'Thêm mới thiết bị'}
        open={modalOpen}
        footer={null} // ✅ để Form tự submit
        onCancel={() => setModalOpen(false)}
        zIndex={1500}
        width={900}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems}></Tabs>
      </Modal>
    </MainCard>
  );
}

export default Capnhattoidien;
