import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Form, Button, Flex, Space, Input, Modal, Tabs, Table, message, Tag, Row, Popconfirm } from 'antd';
import { tonghopmaycaoService } from '../../services/maycao/tonghopmaycaoService';
import { danhmucmaycaoService } from '../../services/maycao/danhmucmaycaoService';
import { donviService } from '../../services/donvi/donviService';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import ActionBar from '/src/components/ActionBar';
import SearchBar from '/src/components/SearchBar';
import MaycaoModel from '../../sections/maycao/MaycaoModel';
function Capnhatmaycao() {
  const [data, setData] = useState([]);
  const [mayCaoList, setMayCaoList] = useState([]);
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

  // ================= ADD / UPDATE =================

  const handleOpenAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await tonghopmaycaoService.deleteMaycao(id);
    message.success('Xóa thành công');
    fetchData();
  };

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

  const handleSubmit = async (values) => {
    try {
      if (editing) {
        await tonghopmaycaoService.updateTonghopmaycao(values);
        message.success('Cập nhật thành công');
      } else {
        await tonghopmaycaoService.addTonghopmaycao(values);
        message.success('Thêm mới thành công');
      }
      setModalOpen(false);
      setEditing(null);
      fetchData();
    } catch (err) {
      if (!err?.errorFields) {
        message.error('Lưu dữ liệu thất bại');
      }
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
      render: (_, val) => <Tag color={val ? 'red' : 'green'}>{val ? 'Dự phòng' : 'Đang dùng'}</Tag>
    },
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

      <MaycaoModel
        open={modalOpen}
        form={form}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editing}
        mayCaoList={mayCaoList}
        donViList={donViList}
      />
    </>
  );
}

export default Capnhatmaycao;
