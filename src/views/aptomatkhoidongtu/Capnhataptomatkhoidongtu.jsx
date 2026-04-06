import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Form, Button, Space, Modal, Table, message, Tag, Row, Popconfirm } from 'antd';
import ActionBar from '/src/components/ActionBar';
import SearchBar from '/src/components/SearchBar';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { useDonviStore } from '../../stores/donvi/donviStore';
import { useDanhmucaptomatkhoidongtuStore } from '../../stores/aptomatkhoidongtu/danhmucaptomatkhoidongtuStore';
import { useTonghopaptomatkhoidongtuStore } from '../../stores/aptomatkhoidongtu/tonghopaptomatkhoidongtuStore';
import AptomatKhoidongtuForm from '../../sections/aptomatkhoidongtu/AptomatKhoidogtuForm';
const Capnhataptomatkhoidongtu = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const { dataDonvi, fetchDonvi } = useDonviStore();
  const { dataDanhmucaptomatkhoidongtu, fetchDanhmucaptomatkhoidongtu } = useDanhmucaptomatkhoidongtuStore();
  const {
    loading,
    dataTonghopaptomatkhoidongtu,
    getTonghopaptomatkhoidongtuPaging,
    createTonghopaptomatkhoidongtu,
    updateTonghopaptomatkhoidongtu,
    deleteTonghopaptomatkhoidongtu,
    deleteTonghopaptomatkhoidongtus,
    totalRecords
  } = useTonghopaptomatkhoidongtuStore();
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
    fetchDanhmucaptomatkhoidongtu();
    fetchData();
  }, []);

  // 1. Sửa hàm fetchData để đồng bộ pagination
  const fetchData = async (page = 1, size = 10) => {
    await getTonghopaptomatkhoidongtuPaging({
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
    setModalOpen(true);
  };

  // ================= EDIT =================
  const handleOpenEdit = (record) => {
    setEditing(record);
    setModalOpen(true);
  };
  // ================= DELETE =================
  const handleDelete = async (id) => {
    await deleteTonghopaptomatkhoidongtu(id);
    fetchData(1, pagination.pageSize);
  };

  // ================= DELETE SELECT =================
  const handleDeleteMultiple = async () => {
    try {
      await deleteTonghopaptomatkhoidongtus(selectedRowKeys);
      setSelectedRowKeys([]);
      fetchData(1, pagination.pageSize);
    } catch (error) {
      console.log('error,', error);
      message.error('Xóa bản ghi thất bại');
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (values) => {
    try {
      const payload = {
        Id: editing?.id || 0,
        ...values,
        NgayKiemDinh: values.ngayKiemDinh?.format('YYYY-MM-DD'),
        NamSanXuat: values.namSanXuat?.format('YYYY-MM-DD'),
        DuPhong: values.duPhong ?? false
      };

      if (editing) {
        await updateTonghopaptomatkhoidongtu(payload);
      } else {
        await createTonghopaptomatkhoidongtu(payload);
      }

      setModalOpen(false);
      setEditing(null);
      fetchData(1, pagination.pageSize);
    } catch {
      message.error('Lưu dữ liệu thất bại');
    }
  };

  const columns = [
    { title: 'Tên thiết bị', dataIndex: 'tenThietBi', key: 'tenThietBi' },
    { title: 'Đơn vị', dataIndex: 'tenDonVi', key: 'tenDonVi' },
    { title: 'Vị trí lắp đặt', dataIndex: 'viTriLapDat', key: 'viTriLapDat' },
    {
      title: 'Kiểm định',
      dataIndex: 'ngayKiemDinh',
      key: 'ngayKiemDinh',
      render: (value) => (value ? dayjs(value).format('YYYY') : '')
    },
    {
      title: 'Năm SX',
      dataIndex: 'namSanXuat',
      key: 'namSanXuat',
      render: (value) => (value ? dayjs(value).format('YYYY') : '')
    },
    { title: 'Điện áp SD(V)', dataIndex: 'dienApSuDung', key: 'dienApSuDung' },
    { title: 'I(đm)', dataIndex: 'idm', key: 'idm' },
    { title: 'Điện áp ĐK(V)', dataIndex: 'dienApDieuKhien', key: 'dienApDieuKhien' },
    { title: 'Chế độ làm việc', dataIndex: 'cheDoLamViec', key: 'cheDoLamViec' },
    { title: 'Thông gió', dataIndex: 'thongGio', key: 'thongGio' },
    {
      title: 'Nối đất(<2 ôm)',
      dataIndex: 'noiDat',
      key: 'noiDat',
      render: (value) => <Tag color={value ? 'green' : 'red'}>{value ? 'Đạt' : 'Không đạt'}</Tag>
    },
    {
      title: 'Khe hở PN(<0.1mm)',
      dataIndex: 'kheHoPhongNo',
      key: 'kheHoPhongNo',
      render: (value) => <Tag color={value ? 'green' : 'red'}>{value ? 'Đạt' : 'Không đạt'}</Tag>
    },
    {
      title: 'Mở nhanh',
      dataIndex: 'napMoNhanh',
      key: 'napMoNhanh',
      render: (value) => <Tag color={value ? 'green' : 'red'}>{value ? 'Đạt' : 'Không đạt'}</Tag>
    },
    {
      title: 'Tay dao',
      dataIndex: 'tayDao',
      key: 'tayDao',
      render: (value) => <Tag color={value ? 'green' : 'red'}>{value ? 'Đạt' : 'Không đạt'}</Tag>
    },
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
    const exportData = dataTonghopaptomatkhoidongtu.map((item, index) => ({
      STT: index + 1,
      'Thiết bị': item.tenThietBi,
      'Đơn vị': item.tenDonVi,
      'Vị trí lắp đặt': item.viTriLapDat,
      'Ngày kiểm định': item.ngayKiemDinh ? dayjs(item.ngayKiemDinh).format('YYYY') : '',
      'Năm sản xuất': item.namSanXuat ? dayjs(item.namSanXuat).format('YYYY') : '',
      'Điện áp sử dụng': item.dienApSuDung,
      'I(đm)': item.idm,
      'Điện áp điều khiển': item.dienApDieuKhien,
      'Chế độ làm việc': item.cheDoLamViec,
      'Thông gió': item.thongGio,
      'Nối đất(<2 ôm)': item.noiDat ? 'Đạt' : 'Không đạt',
      'Khe hở phòng nổ(<0.1mm)': item.kheHoPhongNo ? 'Đạt' : 'Không đạt',
      'Nap mở nhanh': item.napMoNhanh ? 'Đạt' : 'Không đạt',
      'Tay đảo': item.tayDao ? 'Đạt' : 'Không đạt',
      'Bit có cáp': item.bitCoCap,
      'Cấp phòng nổ': item.capPhongNo,
      'Tình trạng thiết bị': item.tinhTrangThietBi,
      'Dự phòng': item.duPhong ? 'Đang dùng' : 'Dự phòng',
      'Ghi chú': item.ghiChu
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: [
        'STT',
        'Thiết bị',
        'Đơn vị',
        'Vị trí lắp đặt',
        'Ngày kiểm định',
        'Năm sản xuất',
        'Điện áp sử dụng',
        'I(đm)',
        'Điện áp điều khiển',
        'Chế độ làm việc',
        'Thông gió',
        'Nối đất(<2 ôm)',
        'Khe hở phòng nổ(<0.1mm)',
        'Nap mở nhanh',
        'Tay đảo',
        'Bit có cáp',
        'Cấp phòng nổ',
        'Tình trạng thiết bị',
        'Dự phòng',
        'Ghi chú'
      ]
    });

    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 10 },
      { wch: 35 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TonghopAptomatKhoidongtu');
    XLSX.writeFile(workbook, 'Tong-hop-aptomat-khoidongtu.xlsx');
  };
  const sizeChange = ['10', '20', '50', '100', '500', '1000', '2000', '5000', '10000'];
  console.log('dataTonghopaptomatkhoidongtu', dataTonghopaptomatkhoidongtu);
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
        dataSource={dataTonghopaptomatkhoidongtu}
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
        footer={null}
        onCancel={() => setModalOpen(false)}
        zIndex={1500}
        width={1000}
        afterOpenChange={(open) => {
          if (!open) return;

          if (!editing) {
            // ===== ADD =====
            form.resetFields();
            form.setFieldsValue({
              kheHoPhongNo: true,
              napMoNhanh: true,
              tayDao: true,
              noiDat: true,
              duPhong: true
            });

            // focus chuẩn
            setTimeout(() => {
              const input = document.querySelector('.ant-select-selection-search-input');
              input?.focus();
              // document.querySelector('.ant-select-selector')?.click();
            }, 100);
          } else {
            // ===== EDIT =====
            form.setFieldsValue({
              aptomatKhoidongtuId: editing.aptomatkhoidongtuId,
              donViId: editing.donViId,
              viTriLapDat: editing.viTriLapDat,
              dienApSuDung: editing.dienApSuDung,
              idm: editing.idm,
              dienApDieuKhien: editing.dienApDieuKhien,
              cheDoLamViec: editing.cheDoLamViec,
              thongGio: editing.thongGio,
              noiDat: editing.noiDat,
              kheHoPhongNo: editing.kheHoPhongNo,
              napMoNhanh: editing.napMoNhanh,
              tayDao: editing.tayDao,
              bitCoCap: editing.bitCoCap,
              capPhongNo: editing.capPhongNo,
              tinhTrangThietBi: editing.tinhTrangThietBi,
              duPhong: editing.duPhong,
              ghiChu: editing.ghiChu,
              ngayKiemDinh: editing.ngayKiemDinh ? dayjs(editing.ngayKiemDinh) : null,
              namSanXuat: editing.namSanXuat ? dayjs(editing.namSanXuat) : null
            });
          }
        }}
      >
        <AptomatKhoidongtuForm
          open={modalOpen}
          form={form}
          editingRecord={editing}
          onCancel={() => setModalOpen(false)}
          handleSubmit={handleSubmit}
          initialValues={editing}
          aptomatkhoidongtuList={dataDanhmucaptomatkhoidongtu}
          donViList={dataDonvi}
        />
      </Modal>
    </>
  );
};

export default Capnhataptomatkhoidongtu;
