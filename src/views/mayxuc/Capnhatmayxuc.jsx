import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
<<<<<<< HEAD
import { Form, Button, Space, Modal, Tabs, Table, message, Tag, Row, Popconfirm, Col } from 'antd';
import { useTonghopmayxucStore } from '../../stores/tonghopmayxucStore';
import { useDanhmucmayxucStore } from '../../stores/danhmucmayxucStore';
import { useDonviStore } from '../../stores/donviStore';
import { useLoaithietbiStore } from '../../stores/loaithietbiStore';
import NhatkyMayxucTable from '../../sections/mayxuc/NhatkyMayxucTable';
import ThongsoMayXucTable from '../../sections/mayxuc/ThongsoMayXucTable';
import * as XLSX from 'xlsx';
import dayjs, { Dayjs } from 'dayjs';
import ActionBar from '/src/components/ActionBar';
import SearchBar from '/src/components/SearchBar';
import MayxucForm from '../../sections/mayxuc/MayxucForm';
function Capnhatmayxuc() {
  const [activeTab, setActiveTab] = useState('1');
  const [mayxuc, setMayxuc] = useState([]);
=======
import { Form, Button, Space, Modal, Tabs, Table, message, Tag, Row, Popconfirm } from 'antd';
import { capnhatmayxucService } from '../../services/mayxuc/capnhatmayxucService';
import { danhmucmayxucService } from '../..//services/mayxuc/danhmucmayxucService';
import { donviService } from '../../services/donvi/donviService';
import { loaithietbiService } from '../../services/loaithietbi/loaithietbiService';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import ActionBar from '/src/components/ActionBar';
import SearchBar from '/src/components/SearchBar';
import MayxucForm from '../../sections/mayxuc/MayxucForm';
import NhatkyMayxucTable from '../..//sections/mayxuc/NhatkyMayxucTable';
import ThongsoMayXucTable from '../../sections/mayxuc/ThongsoMayXucTable';

function Capnhatmayxuc() {
  const [data, setData] = useState([]);
  const [mayXucList, setMayXucList] = useState([]);
  const [loaiThietBiList, setLoaiThietBiList] = useState([]);
  const [mayxuc, setMayxuc] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [donViList, setDonViList] = useState([]);
  const [loading, setLoading] = useState(false);
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
<<<<<<< HEAD
  const { dataDanhmucMayxuc, fetchDanhmucmayxuc } = useDanhmucmayxucStore();
  const { dataDonvi, fetchDonvi } = useDonviStore();
  const { dataLoaithietbi, fetchLoaithietbi } = useLoaithietbiStore();
  const { dataTonghopMayxuc, loading, fetchTonghopmayxuc, createTonghopmayxuc, updateTonghopmayxuc, deleteTonghopmayxuc, deleteMultiple } =
    useTonghopmayxucStore();

  //================= Load Data ===========================
  useEffect(() => {
    fetchDonvi();
    fetchDanhmucmayxuc();
    fetchTonghopmayxuc();
    fetchLoaithietbi();
  }, []);

  const dataSource = useMemo(() => {
    return [
      ...dataTonghopMayxuc.map((item) => ({
        ...item
      }))
    ];
  }, [dataTonghopMayxuc]);

=======

  // ================= LOAD DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await capnhatmayxucService.getMayxuc();
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
      message.error('Không tải được danh mục máy xúc');
    }
  };
  const fetchDonvi = async () => {
    try {
      const res = await donviService.getDonvi();
      setDonViList(res.data || []);
    } catch {
      message.error('Không tải được danh mục máy xúc');
    }
  };
  const fetchLoaiThietBi = async () => {
    try {
      const res = await loaithietbiService.getLoaithietbi();
      setLoaiThietBiList(res.data || []);
    } catch {
      message.error('Không tải được danh mục máy xúc');
    }
  };
  useEffect(() => {
    fetchData();
    fetchMayxuc();
    fetchDonvi();
    fetchLoaiThietBi();
  }, []);

>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
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
<<<<<<< HEAD
    await deleteTonghopmayxuc(id);
    message.success('Xóa thành công');
    fetchTonghopmayxuc();
=======
    await capnhatmayxucService.deleteMayxuc(id);
    message.success('Xóa thành công');
    fetchData();
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
  };

  // ================= DELETE SELECT =================
  const handleDeleteMultiple = async () => {
    try {
<<<<<<< HEAD
      await deleteMultiple(selectedRowKeys);
      message.success('Xóa nhiều thành công');
      setSelectedRowKeys([]);
      fetchTonghopmayxuc();
=======
      await capnhatmayxucService.deleteMayxucs(selectedRowKeys);
      message.success('Xóa nhiều thành công');
      setSelectedRowKeys([]);
      fetchData();
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
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
<<<<<<< HEAD
        ngayLap: values.ngayLap ? values.ngayLap.format('YYYY-MM-DD') : null
      };
      if (editing) {
        await updateTonghopmayxuc(editing.id, payload);
        message.success('Cập nhật thành công');
      } else {
        await createTonghopmayxuc(payload);
=======
        Id: editing ? editing.id : undefined,
        ngayLap: values.ngayLap ? values.ngayLap.toISOString() : null
      };

      if (editing) {
        await capnhatmayxucService.updateTonghopmayxuc(payload);
        message.success('Cập nhật thành công');
      } else {
        await capnhatmayxucService.addTonghopmayxuc(payload);
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
        message.success('Thêm mới thành công');
      }

      setModalOpen(false);
      setEditing(null);
      form.resetFields();
<<<<<<< HEAD
      fetchTonghopmayxuc();
=======
      fetchData();
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
    } catch {
      message.error('Lưu dữ liệu thất bại');
    }
  };

  // ================= CREATE COLUMS =================
<<<<<<< HEAD

  const columns = [
    { title: 'Mã quản lý', dataIndex: 'maQuanLy', key: 'maQuanLy' },
    { title: 'Tên thiết bị', dataIndex: 'tenMayXuc', key: 'tenMayXuc' },
    { title: 'Đơn vị', dataIndex: 'tenPhongBan', key: 'tenPhongBan' },
=======
  const columns = [
    { title: 'Mã quản lý', dataIndex: 'maQuanLy', key: 'maQuanLy' },
    { title: 'Tên thiết bị', dataIndex: 'tenMayXuc', key: 'tenThietBi' },
    { title: 'Đơn vị', dataIndex: 'tenPhongBan', key: 'tenDonVi' },
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
    { title: 'Vị trí lắp đặt', dataIndex: 'viTriLapDat', key: 'viTriLapDat' },
    {
      title: 'Ngày lắp đặt',
      dataIndex: 'ngayLap',
      key: 'ngayLap',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '')
    },
<<<<<<< HEAD
    { title: 'Tình trạng TB', dataIndex: 'tinhTrang', key: 'tinhTrang' },
=======
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
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

  // ================= SEARCH =================
  const filteredData = useMemo(() => {
<<<<<<< HEAD
    if (!searchText) return dataSource;

    return dataTonghopMayxuc.filter((item) =>
=======
    if (!searchText) return data;

    return data.filter((item) =>
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
      Object.values(item)
        .filter((v) => v !== null && v !== undefined)
        .join(' ')
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
<<<<<<< HEAD
  }, [dataSource, searchText]);
=======
  }, [data, searchText]);
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
<<<<<<< HEAD
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
=======
      'Mã quản lý': item.maQuanLy,
      'Thiết bị': item.tenMayXuc,
      'Đơn vị': item.tenPhongBan,
      'Loại thiết bị': item.loaiThietBi,
      'Vị trí lắp đặt': item.viTriLapDat,
      'Ngày lắp đặt': item.ngayLap ? dayjs(item.ngayLap).format('DD/MM/YYYY') : '',
      'Tình trạng TB': item.duPhong ? 'Đang dùng' : 'Dự phòng',
      'Số lượng': item.soLuong,
      'Tình trạng hoạt động': item.tinhTrang,
      'Ghi chú': item.ghiChu
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: [
        'STT',
        'Mã quản lý',
        'Thiết bị',
        'Đơn vị',
        'Loại thiết bị',
        'Vị trí lắp đặt',
        'Ngày lắp đặt',
        'Tình trạng TB',
        'Số lượng',
        'Tình trạng hoạt động',
        'Ghi chú'
      ]
    });

    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 30 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cap-nhat-may-xuc');
    XLSX.writeFile(workbook, 'Cap-nhat-may-xuc.xlsx');
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
  };

  const tabItems = [
    {
      key: '1',
<<<<<<< HEAD
      label: 'CẬP NHẬT TỜI ĐIỆN',
=======
      label: 'CẬP NHẬT MÁY XÚC',
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
      children: (
        <MayxucForm
          open={modalOpen}
          form={form}
          editingRecord={editing}
          onCancel={() => setModalOpen(false)}
          handleSubmit={handleSubmit}
          initialValues={editing}
<<<<<<< HEAD
          mayXucList={dataDanhmucMayxuc}
          donViList={dataDonvi}
          loaiThietBiList={dataLoaithietbi}
=======
          mayXucList={mayXucList}
          donViList={donViList}
          loaiThietBiList={loaiThietBiList}
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
        />
      )
    },
    {
      key: '2',
      label: 'NHẬT KÝ THIẾT BỊ',
      disabled: !editing,
<<<<<<< HEAD
      children: editing ? <NhatkyMayxucTable thongsomayxuc={mayxuc} /> : <div>Chọn bản ghi để xem nhật ký thiết bị</div>
=======
      children: editing ? <NhatkyMayxucTable nhatkymayxuc={mayxuc} /> : <div>Chọn bản ghi để xem nhật ký thiết bị</div>
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9
    },
    {
      key: '3',
      label: 'THÔNG SỐ KỸ THUẬT',
      disabled: !editing,
      children: editing ? <ThongsoMayXucTable thongsomayxuc={mayxuc} /> : <div>Chọn bản ghi để xem thông số kỹ thuật</div>
    }
  ];

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
<<<<<<< HEAD
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Tag variant="outlined" color="blue">
            <h6 className="flex justify-content-center align-items-center">
              Tổng số thiết bị:{' '}
              <span style={{ color: 'red' }}>
                <b>{filteredData.length}</b>
              </span>{' '}
            </h6>
          </Tag>
        </Col>
      </Row>
=======
>>>>>>> 537f274e78cef12bbe19b109ca1c996ea85717c9

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
        title={editing ? 'Cập nhật thiết bị' : 'Thêm mới thiết bị'}
        open={modalOpen}
        footer={null} // ✅ để Form tự submit
        onCancel={() => setModalOpen(false)}
        zIndex={1500}
        width={900}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems}></Tabs>
      </Modal>
    </>
  );
}

export default Capnhatmayxuc;
