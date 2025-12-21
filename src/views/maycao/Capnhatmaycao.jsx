import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Form, Button, Space, Modal, Tabs, Table, message, Tag, Row, Popconfirm } from 'antd';
import { tonghopmaycaoService } from '../../services/maycao/tonghopmaycaoService';
import { danhmucmaycaoService } from '../../services/maycao/danhmucmaycaoService';
import { donviService } from '../../services/donvi/donviService';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import ActionBar from '/src/components/ActionBar';
import SearchBar from '/src/components/SearchBar';
import MaycaoForm from '../../sections/maycao/MaycaoForm';
import NhatkyMaycaoTable from '../../sections/maycao/NhatkyMaycaoTable';
import ThongsokythuatTable from '../../sections/maycao/ThongsokythuatTable';
ThongsokythuatTable;
function Capnhatmaycao() {
  const [data, setData] = useState([]);
  const [mayCaoList, setMayCaoList] = useState([]);
  const [maycao, setMaycao] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [donViList, setDonViList] = useState([]);
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
      const res = await tonghopmaycaoService.getMaycao();
      setData(res.data || []);
    } catch (err) {
      message.error('Không tải được dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaycao = async () => {
    try {
      const res = await danhmucmaycaoService.getDanhmucmaycaos();
      setMayCaoList(res.data || []);
    } catch {
      message.error('Không tải được danh mục máy cào');
    }
  };
  const fetchDonvi = async () => {
    try {
      const res = await donviService.getDonvi();
      setDonViList(res.data || []);
    } catch {
      message.error('Không tải được danh mục máy cào');
    }
  };
  useEffect(() => {
    fetchData();
    fetchMaycao();
    fetchDonvi();
  }, []);

  // ================= ADD =================

  const handleOpenAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  // ================= EDIT =================
  const handleOpenEdit = (record) => {
    setEditing(record);
    setMaycao(record);
    form.setFieldsValue({
      ...record,
      ngayLap: record.ngayLap ? dayjs(record.ngayLap) : null
    });

    setModalOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await tonghopmaycaoService.deleteMaycao(id);
    message.success('Xóa thành công');
    fetchData();
  };

  // ================= DELETE SELECT =================
  const handleDeleteMultiple = async () => {
    try {
      await tonghopmaycaoService.deleteMaycaos(selectedRowKeys);
      message.success('Xóa nhiều thành công');
      setSelectedRowKeys([]);
      fetchData();
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
        ngayLap: values.ngayLap ? values.ngayLap.toISOString() : null
      };

      if (editing) {
        await tonghopmaycaoService.updateTonghopmaycao(payload);
        message.success('Cập nhật thành công');
      } else {
        await tonghopmaycaoService.addTonghopmaycao(payload);
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
    if (!searchText) return data;

    return data.filter((item) =>
      Object.values(item)
        .filter((v) => v !== null && v !== undefined)
        .join(' ')
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Thiết bị': mayCaoList.find((x) => x.id === item.mayCaoId)?.tenThietBi || '',
      'Nội dung': item.tenThietBi,
      'Đơn vị tính': item.viTriLapDat,
      'Thông số kỹ thuật': item.tenDonVi
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Thiết bị', 'Nội dung', 'Đơn vị tính', 'Thông số kỹ thuật']
    });

    worksheet['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 45 }, { wch: 15 }, { wch: 30 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ThongSoThietBi');
    XLSX.writeFile(workbook, 'Thong-So-Thiet-Bi.xlsx');
  };

  const tabItems = [
    {
      key: '1',
      label: 'CẬP NHẬT MÁY CÀO',
      children: (
        <MaycaoForm
          open={modalOpen}
          form={form}
          editingRecord={editing}
          onCancel={() => setModalOpen(false)}
          handleSubmit={handleSubmit}
          initialValues={editing}
          mayCaoList={mayCaoList}
          donViList={donViList}
        />
      )
    },
    {
      key: '2',
      label: 'NHẬT KÝ THIẾT BỊ',
      disabled: !editing,
      children: editing ? <NhatkyMaycaoTable nhatkymaycao={maycao} /> : <div>Chọn bản ghi để xem nhật ký thiết bị</div>
    },
    {
      key: '3',
      label: 'THÔNG SỐ KỸ THUẬT',
      disabled: !editing,
      children: editing ? <ThongsokythuatTable thongsomaycao={maycao} /> : <div>Chọn bản ghi để xem thông số kỹ thuật</div>
    }
  ];
  console.log('Dữ liệu:', data, mayCaoList, donViList);
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

export default Capnhatmaycao;
