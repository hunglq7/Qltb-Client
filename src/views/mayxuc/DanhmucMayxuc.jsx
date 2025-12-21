import React, { useEffect, useState, useMemo } from 'react';
import { Table, Input, Button, Popconfirm, Form, Space, Switch, DatePicker, message, Row, Tag } from 'antd';
import { DeleteOutlined, SaveOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import ActionBar from '/src/components/ActionBar';
import SearchBar from '/src/components/SearchBar';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { danhmucmayxucService } from '../../services/mayxuc/danhmucmayxucService';

// ================= EditableCell =================

const EditableCell = ({ editing, dataIndex, title, inputType, record, children, ...restProps }) => {
  let inputNode;

  switch (inputType) {
    case 'boolean':
      inputNode = <Switch />;
      break;
    case 'date':
      inputNode = <DatePicker picker="year" />;
      break;
    default:
      inputNode = <Input />;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          valuePropName={inputType === 'boolean' ? 'checked' : 'value'}
          style={{ margin: 0 }}
          rules={[{ required: false, message: `Nhập ${title}` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function DanhmucMayXuc() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');

  // ================= LOAD DATA =================
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await danhmucmayxucService.getDanhmucmayxucs();
    setData(res.data);
  };

  // ================= EDIT =================
  const isEditing = (record) => record.id === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      namSanXuat: record.namSanXuat ? dayjs(record.namSanXuat, 'YYYY') : null
    });
    setEditingKey(record.id);
  };

  const cancel = () => setEditingKey('');

  // ================= SAVE =================
  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const payload = {
        ...row,
        id: id,
        namSanXuat: row.namSanXuat ? row.namSanXuat.format('YYYY') : null
      };

      if (String(id).startsWith('new_')) {
        // ➕ THÊM MỚI
        const { id, ...createPayload } = payload;
        await danhmucmayxucService.addMayxuc(createPayload);
        message.success('Thêm mới thành công');
      } else {
        // ✏️ CẬP NHẬT

        await danhmucmayxucService.updateMayxuc(payload);
        message.success('Cập nhật thành công');
      }

      setEditingKey('');
      loadData();
    } catch (err) {
      message.error('Lỗi dữ liệu');
    }
  };
  // ================= DELETE =================
  const handleDelete = async (id) => {
    await danhmucmayxucService.deleteMayxuc(id);
    message.success('Đã xóa');
    loadData();
  };

  // ================= ADD NEW =================
  const handleOpenAdd = async () => {
    const tempId = `new_${Date.now()}`;
    const newItem = {
      id: tempId,
      maTaiSan: '',
      tenThietBi: '',
      loaiThietBi: '',
      tinhTrang: true,
      namSanXuat: dayjs(),
      hangSanXuat: '',
      ghiChu: ''
    };
    setData((prev) => [newItem, ...prev]);
    form.setFieldsValue(newItem);
    setEditingKey(tempId);
  };

  // ================= DELETE SELECT=================
  const handleDeleteMultiple = async () => {
    await danhmucmayxucService.deleteDanhmucmayxucs(selectedRowKeys);
    message.success('Xóa nhiều thành công');
    setSelectedRowKeys([]);
    loadData();
  };
  // ================= SEARCH =================
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    return data.filter((item) => Object.values(item).join(' ').toLowerCase().includes(searchText.toLowerCase()));
  }, [data, searchText]);

  // ================= EXPORT EXCEL=================
  const handleExportExcel = () => {
    // Map dữ liệu theo cột và tiêu đề tiếng Việt
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Mã tài sản': item.maTaiSan,
      'Tên thiết bị': item.tenThietBi,
      'Loại thiết bị': item.loaiThietBi,
      'Tình trạng': item.tinhTrang ? 'Đang dùng' : 'Không dùng',
      'Năm sản xuất': item.namSanXuat,
      'Hãng sản xuất': item.hangSanXuat,
      'Ghi chú': item.ghiChu
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Mã tài sản', 'Tên thiết bị', 'Loại thiết bị', 'Tình trạng', 'Năm sản xuất', 'Hãng sản xuất', 'Ghi chú']
    });
    // Set độ rộng cột
    worksheet['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 45 }, { wch: 45 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danhmucmayxuc');
    XLSX.writeFile(workbook, 'Danh-Muc-May_xuc.xlsx');
  };

  // ================= CREATE COLUMS=================
  const columns = [
    // { title: 'ID', dataIndex: 'id', edit: false },
    { title: 'Mã tài sản', dataIndex: 'maTaiSan', editable: true },
    { title: 'Tên thiết bị', dataIndex: 'tenThietBi', editable: true },
    { title: 'Loại thiết bị', dataIndex: 'loaiThietBi', editable: true },
    {
      title: 'Tình trạng',
      dataIndex: 'tinhTrang',
      editable: true,
      render: (val) => <Tag color={val ? 'green' : 'red'}>{val ? 'Đang dùng' : 'Dự phòng'}</Tag>
    },
    {
      title: 'Năm sản xuất',
      dataIndex: 'namSanXuat',
      editable: true
    },
    { title: 'Hãng sản xuất', dataIndex: 'hangSanXuat', editable: true },
    { title: 'Ghi chú', dataIndex: 'ghiChu', editable: true },
    {
      title: 'Thao tác',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button icon={<SaveOutlined />} onClick={() => save(record.id)} />
            <Button icon={<CloseOutlined />} onClick={cancel} />
          </Space>
        ) : (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => edit(record)}></Button>
            <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)}>
              <Button icon={<DeleteOutlined />} danger></Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  // ================= mergedColumns =================
  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'tinhTrang' ? 'boolean' : col.dataIndex === 'namSanXuat' ? 'date' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
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
      <Form form={form} component={false}>
        <Table
          components={{ body: { cell: EditableCell } }}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys
          }}
          dataSource={filteredData}
          columns={mergedColumns}
          bordered
        />
      </Form>
    </>
  );
}
