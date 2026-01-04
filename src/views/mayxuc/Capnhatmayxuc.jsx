import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Form, Button, Space, Modal, Tabs, Table, message, Tag, Row, Popconfirm, Col } from 'antd';
import { useTonghopmayxucStore } from '../../stores/tonghopmayxucStore';
import { useDanhmucmayxucStore } from '../../stores/danhmucmayxucStore';
import { useDonviStore } from '../../stores/donviStore';
import { useLoaithietbiStore } from '../../stores/loaithietbiStore';
import NhatkyMayxucTable from '../../sections/mayxuc/NhatkyMayxucTable';
import ThongsoMayXucTable from '../../sections/mayxuc/ThongsoMayXucTable';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import ActionBar from '/src/components/ActionBar';
import SearchBar from '/src/components/SearchBar';
import MayxucForm from '../../sections/mayxuc/MayxucForm';
function Capnhatmayxuc() {
  const [activeTab, setActiveTab] = useState('1');
  const [mayxuc, setMayxuc] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const { dataDanhmucMayxuc, fetchDanhmucmayxuc } = useDanhmucmayxucStore();
  const { dataDonvi, fetchDonvi } = useDonviStore();
  const { dataLoaithietbi, fetchLoaithietbi } = useLoaithietbiStore();
  const {
    dataTonghopMayxuc,
    loading,
    fetchTonghopmayxuc,
    createTonghopmayxuc,
    updateTonghopmayxuc,
    deleteTonghopmayxuc,
    deleteMultiple,
    getTonghopmayxucPaging,
    totalRecords
  } = useTonghopmayxucStore();
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
  //================= Load Data ===========================
  useEffect(() => {
    fetchDonvi();
    fetchDanhmucmayxuc();
    fetchLoaithietbi();
    fetchData();
  }, []);

  // 1. Sửa hàm fetchData để đồng bộ pagination
  const fetchData = async (page = 1, size = 10) => {
    await getTonghopmayxucPaging({
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
    setMayxuc(record);
    form.setFieldsValue({
      ...record,
      ngayLap: record.ngayLap ? dayjs(record.ngayLap) : null
    });

    setModalOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await deleteTonghopmayxuc(id);
    message.success('Xóa thành công');
    fetchTonghopmayxuc();
  };

  // ================= DELETE SELECT =================
  const handleDeleteMultiple = async () => {
    try {
      await deleteMultiple(selectedRowKeys);
      message.success('Xóa nhiều thành công');
      setSelectedRowKeys([]);
      fetchTonghopmayxuc();
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
        await updateTonghopmayxuc(editing.id, payload);
        message.success('Cập nhật thành công');
      } else {
        await createTonghopmayxuc(payload);

        message.success('Thêm mới thành công');
      }

      setModalOpen(false);
      setEditing(null);
      form.resetFields();
      fetchTonghopmayxuc();
    } catch {
      message.error('Lưu dữ liệu thất bại');
    }
  };

  // ================= CREATE COLUMS =================

  const columns = [
    { title: 'Mã quản lý', dataIndex: 'maQuanLy', key: 'maQuanLy' },
    { title: 'Tên thiết bị', dataIndex: 'tenMayXuc', key: 'tenMayXuc' },
    { title: 'Đơn vị', dataIndex: 'tenPhongBan', key: 'tenPhongBan' },

    { title: 'Vị trí lắp đặt', dataIndex: 'viTriLapDat', key: 'viTriLapDat' },
    {
      title: 'Ngày lắp đặt',
      dataIndex: 'ngayLap',
      key: 'ngayLap',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '')
    },
    { title: 'Tình trạng TB', dataIndex: 'tinhTrang', key: 'tinhTrang' },
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

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    const exportData = dataTonghopMayxuc.map((item, index) => ({
      STT: index + 1,

      'Thiết bị': dataDanhmuc.find((x) => x.id === item.danhmuctoitrucId)?.tenThietBi || '',
      'Nội dung': item.tenThietBi,
      'Đơn vị tính': item.viTriLapDat,
      'Thông số kỹ thuật': item.tenDonVi
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Thiết bị', 'Nội dung', 'Đơn vị tính', 'Thông số kỹ thuật']
    });

    worksheet['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 45 }, { wch: 15 }, { wch: 30 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tonghopmayxuc');
    XLSX.writeFile(workbook, 'Tong-hop-may-xuc.xlsx');
  };
  const sizeChange = ['10', '20', '50', '100', '500', '1000', '2000', '5000', '10000'];
  const tabItems = [
    {
      key: '1',

      label: 'CẬP NHẬT TỜI ĐIỆN',

      children: (
        <MayxucForm
          open={modalOpen}
          form={form}
          editingRecord={editing}
          onCancel={() => setModalOpen(false)}
          handleSubmit={handleSubmit}
          initialValues={editing}
          mayXucList={dataDanhmucMayxuc}
          donViList={dataDonvi}
          loaiThietBiList={dataLoaithietbi}
        />
      )
    },
    {
      key: '2',
      label: 'NHẬT KÝ THIẾT BỊ',
      disabled: !editing,
      children: editing ? <NhatkyMayxucTable thongsomayxuc={mayxuc} /> : <div>Chọn bản ghi để xem nhật ký thiết bị</div>
    },
    {
      key: '3',
      label: 'THÔNG SỐ KỸ THUẬT',
      disabled: !editing,
      children: editing ? <ThongsoMayXucTable thongsomayxuc={mayxuc} /> : <div>Chọn bản ghi để xem thông số kỹ thuật</div>
    }
  ];
  console.log(dataTonghopMayxuc);
  return (
    <>
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
        dataSource={dataTonghopMayxuc}
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
        width={1000}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems}></Tabs>
      </Modal>
    </>
  );
}

export default Capnhatmayxuc;
