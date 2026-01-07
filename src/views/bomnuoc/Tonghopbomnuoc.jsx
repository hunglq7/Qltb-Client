import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Badge from 'react-bootstrap/Badge';
import { Form, Button, Space, Modal, Tabs, Table, message, Tag, Row, Popconfirm } from 'antd';
import MainCard from 'components/MainCard';
import { useDonviStore } from '../../stores/donvi/donviStore';
import { useDanhmucbomnuocStore } from '../../stores/bomnuoc/danhmucbomnuocStore';
import { useTonghopbomnuocStore } from '../../stores/bomnuoc/TonghopbomnuocStore';
import TonghopbomnuocForm from '../../sections/bomnuoc/TonghopbomnuocForm';
import ThongsobomnuocTable from '../../sections/bomnuoc/ThongsobomnuocTable';
import NhatkybomnuocTable from '../../sections/bomnuoc/NhatkybomnuocTable';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import ActionBar from '/src/components/ActionBar';
import SearchBar from '/src/components/SearchBar';

const Tonghopbomnuoc = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bomNuoc, setBomNuoc] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
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
  const { dataDonvi, fetchDonvi } = useDonviStore();
  const { dataDanhmucbomnuoc, fetchDanhmucbomnuoc } = useDanhmucbomnuocStore();
  const {
    dataTonghopbomnuoc,
    loading,
    totalRecords,
    getTonghopbomnuocPaging,
    getTonghopbomnuocById,
    createTonghopbomnuoc,
    updateTonghopbomnuoc,
    deleteTonghopbomnuoc,
    deleteMultipleTonghopbomnuoc
  } = useTonghopbomnuocStore();

  //================= Load Data ===========================
  useEffect(() => {
    fetchDonvi();
    fetchDanhmucbomnuoc();
    fetchData();
  }, []);

  // 1. Sửa hàm fetchData để đồng bộ pagination
  const fetchData = async (page = 1, size = 10) => {
    await getTonghopbomnuocPaging({
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
    setBomNuoc(record);
    form.setFieldsValue({
      ...record,
      ngayLap: record.ngayLap ? dayjs(record.ngayLap) : null
    });

    setModalOpen(true);
  };
  // ================= DELETE =================
  const handleDelete = async (id) => {
    await deleteTonghopbomnuoc(id);
    message.success('Xóa thành công');
    fetchData();
  };
  // ================= DELETE SELECT =================
  const handleDeleteMultiple = async () => {
    try {
      await deleteMultipleTonghopbomnuoc(selectedRowKeys);
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
    try {
      const payload = {
        ...values,
        ngayLap: values.ngayLap ? values.ngayLap.format('YYYY-MM-DD') : null
      };
      if (editing) {
        await updateTonghopbomnuoc(editing.id, payload);
        message.success('Cập nhật thành công');
      } else {
        await createTonghopbomnuoc(payload);
        message.success('Thêm mới thành công');
      }

      setModalOpen(false);
      setEditing(null);
      form.resetFields();
      fetchData();
    } catch {
      message.error('Lưu dữ liệu thất bại');
    }
  };

  // ================= CREATE COLUMS =================

  const columns = [
    { title: 'Mã quản lý', dataIndex: 'maQuanLy', key: 'maQuanLy' },
    { title: 'Tên thiết bị', dataIndex: 'tenThietBi', key: 'tenThietBi' },
    { title: 'Đơn vị', dataIndex: 'tenDonVi', key: 'tenDonVi' },
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

      render: (value) => (
        <i className={value ? `ti ti-circle-filled f-12 text-success m-r-15` : `ti ti-circle-filled f-12 text-danger m-r-15`}>
          {value ? ' Đang dùng' : ' Dự phòng'}
        </i>
      )
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Capnhatbomnuoc');
    XLSX.writeFile(workbook, `Cap-Nhat-Bom-Nuoc-${dayjs(new Date()).format('DD-MM-YYYY')}.xlsx`);
  };

  // Thay đổi danh sách các lựa chọn số bản ghi trên mỗi trang
  const sizeChange = ['10', '20', '50', '100', '500', '1000', '2000', '5000', '10000'];
  const tabItems = [
    {
      key: '1',
      label: 'CẬP NHẬT TỜI ĐIỆN',
      children: (
        <TonghopbomnuocForm
          open={modalOpen}
          form={form}
          editingRecord={editing}
          onCancel={() => setModalOpen(false)}
          handleSubmit={handleSubmit}
          initialValues={editing}
          bomNuocList={dataDanhmucbomnuoc}
          donViList={dataDonvi}
        />
      )
    },
    {
      key: '2',
      label: 'NHẬT KÝ THIẾT BỊ',
      disabled: !editing,
      children: editing ? <NhatkybomnuocTable tonghopbomnuoc={bomNuoc} /> : <div>Chọn bản ghi để xem nhật ký thiết bị</div>
    },
    {
      key: '3',
      label: 'THÔNG SỐ KỸ THUẬT',
      disabled: !editing,
      children: editing ? <ThongsobomnuocTable tonghopbomnuoc={bomNuoc} /> : <div>Chọn bản ghi để xem thông số kỹ thuật</div>
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
        dataSource={dataTonghopbomnuoc}
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
};
export default Tonghopbomnuoc;
