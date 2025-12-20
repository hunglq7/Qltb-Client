import React, { useEffect, useMemo, useState } from 'react';
import { Table, Button, Popconfirm, message, Space, Select, Form } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { thongsomaycaoService } from '../../services/maycao/thongsomaycaoService';
import { danhmucmaycaoService } from '../../services/maycao/danhmucmaycaoService';
import ThongSoMayCaoModal from './ThongsomaycaoModal';
import MaycaoToolbar from './MaycaoToolbar';
const { Option } = Select;

function CapnhatthongsomaycaoSection() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [mayCaoList, setMayCaoList] = useState([]);

  const [form] = Form.useForm();

  // ================= LOAD DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await thongsomaycaoService.getThongsomaycao();
      setData(res.data || []);
    } catch (err) {
      message.error('Không tải được dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchMayCao = async () => {
    try {
      const res = await danhmucmaycaoService.getDanhmucmaycaos();
      setMayCaoList(res.data || []);
    } catch {
      message.error('Không tải được danh mục máy cào');
    }
  };

  useEffect(() => {
    fetchData();
    fetchMayCao();
  }, []);
  // ================= SEARCH =================
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    return data.filter((item) => Object.values(item).join(' ').toLowerCase().includes(searchText.toLowerCase()));
  }, [data, searchText]);

  // ================= ADD / UPDATE =================
  const handleOpenAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setOpenModal(true);
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        await thongsomaycaoService.updateThongsomaycao(values);
        message.success('Cập nhật thành công');
      } else {
        await thongsomaycaoService.addThongsomaycao(values);
        message.success('Thêm mới thành công');
      }

      setOpenModal(false);
      fetchData();
    } catch (err) {
      if (!err?.errorFields) {
        message.error('Lưu dữ liệu thất bại');
      }
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await thongsomaycaoService.deleteThongsomaycao(id);
      message.success('Xóa thành công');
      fetchData();
    } catch {
      message.error('Xóa thất bại');
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Chưa chọn bản ghi nào');
      return;
    }
    try {
      await thongsomaycaoService.deleteSelectThongsomaycao(selectedRowKeys);
      message.success('Xóa nhiều bản ghi thành công');
      setSelectedRowKeys([]);
      fetchData();
    } catch {
      message.error('Xóa nhiều bản ghi thất bại');
    }
  };
  // ================= TABLE =================
  const columns = [
    {
      title: 'Thiết bị',
      dataIndex: 'tenThietBi',
      key: 'tenThietBi',
      render: (value) => mayCaoList.find((x) => x.id === value)?.tenThietBi || value
    },
    {
      title: 'Nội Dung',
      dataIndex: 'noiDung',
      key: 'noiDung'
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'donViTinh',
      key: 'donViTinh'
    },
    {
      title: 'Thông số',
      dataIndex: 'thongSo',
      key: 'thongSo'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          <Popconfirm title="Xóa bản ghi này?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];
  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    // Map dữ liệu theo cột và tiêu đề tiếng Việt
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Tên máy cào': mayCaoList.find((x) => x.id === item.mayCaoId)?.tenThietBi || '',
      'Nội dung': item.noiDung,
      'Đơn vị tính': item.donViTinh,
      'Thông số kỹ thuật': item.thongSo
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Tên máy cào', 'Đơn vị tính', 'Thông số kỹ thuật']
    });

    // Set độ rộng cột
    worksheet['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 30 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ThongSoMayCao');
    XLSX.writeFile(workbook, 'Thong_so_may_cao.xlsx');
  };
  return (
    <div>
      <MaycaoToolbar
        onSearch={setSearchText}
        handleOpenAdd={handleOpenAdd}
        handleDeleteMultiple={handleDeleteMultiple}
        handleExportExcel={handleExportExcel}
        selectedRowKeys={selectedRowKeys}
      />

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
      <ThongSoMayCaoModal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        form={form}
        editingRecord={editingRecord}
        mayCaoList={mayCaoList}
      />
    </div>
  );
}

export default CapnhatthongsomaycaoSection;
