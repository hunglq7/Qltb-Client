import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row, Tag, Switch, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNhatkymayxucStore } from '../../stores/nhatkymayxucStore';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

// ================= EditableCell =================

const EditableCell = ({ editing, dataIndex, title, inputType, record, children, ...restProps }) => {
  let inputNode;

  switch (inputType) {
    case 'boolean':
      inputNode = <Switch />;
      break;
    case 'date':
      inputNode = <DatePicker format={'DD/MM/YYYY'} />;
      break;
    default:
      inputNode = <Input />;
  }
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex} // 👈 BẮT BUỘC
          valuePropName={inputType === 'boolean' ? 'checked' : 'value'}
          style={{ margin: 0 }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
function NhatkyMayxucTable({ thongsomayxuc }) {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [localData, setLocalData] = useState([]);
  const id = thongsomayxuc?.id ?? thongsomayxuc?.mayCaoId ?? null;
  const { dataNhatkyMayxuc, loading, getNhatkymayxucById, createNhatkymayxuc, updateNhatkymayxuc, deleteNhatkymayxuc, deleteMultiple } =
    useNhatkymayxucStore();
  //=================Load NhatkymayxucById========================
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      await getNhatkymayxucById(id);
    } catch (err) {
      message.error('Không tải được dữ liệu');
    } finally {
      console.log('Lối kiểu dữ liệu');
    }
  };

  const dataSource = useMemo(() => {
    return [
      ...localData,
      ...dataNhatkyMayxuc.map((item) => ({
        ...item,
        key: item.id
      }))
    ];
  }, [dataNhatkyMayxuc, localData]);

  // ================= EDIT =================
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      ngaythang: record.ngaythang ? dayjs(record.ngaythang) : null
    });
    setEditingKey(record.key);
  };

  //====================CANCEL=================
  const cancel = () => {
    setLocalData([]);
    setEditingKey('');
  };

  // ================= SAVE =================
  const save = async (key) => {
    try {
      if (!id) {
        message.error('Chưa có tổng hợp máy xúc');
        return;
      }

      const row = await form.validateFields();
      const record = dataSource.find((item) => item.key === key);
      if (!record) return;

      if (String(key).startsWith('new_')) {
        await createNhatkymayxuc({
          tongHopMayXucId: id,
          ngayThang: row.ngaythang.toISOString(),
          donVi: row.donVi,
          viTri: row.viTri,
          trangThai: row.trangThai,
          ghiChu: row.ghiChu
        });
        message.success('Thêm mới thành công');
      } else {
        await updateNhatkymayxuc(record.id, {
          ngayThang: row.ngaythang.toISOString(),
          donVi: row.donVi,
          viTri: row.viTri,
          trangThai: row.trangThai,
          ghiChu: row.ghiChu
        });
        message.success('Cập nhật thành công');
      }

      setEditingKey('');
      setLocalData([]);
      fetchData();
    } catch (err) {
      console.error(err);
      message.error('Backend từ chối dữ liệu (400)');
    }
  };

  //======================DELETE==================================
  const handleDelete = async (record) => {
    if (String(record.key).startsWith('new_')) {
      setLocalData([]);
    } else {
      await deleteNhatkymayxuc(record.id);
      fetchData();
    }
  };

  // ================= ADD-NEW=================
  const handleOpenAdd = () => {
    if (editingKey) return message.warning('Hoàn thành dòng đang sửa');
    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      id: null,
      tonghopmayxucId: id,
      ngaythang: dayjs(),
      donVi: '',
      viTri: '',
      trangThai: true,
      ghiChu: ''
    };
    setLocalData([newRow]);
    form.setFieldsValue(newRow);
    setEditingKey(key);
  };

  const columns = [
    {
      title: 'Ngày tháng',
      dataIndex: 'ngaythang',
      key: 'ngaythang',
      width: 160,
      editable: true,
      inputType: 'date', // 👈 QUAN TRỌNG
      fixed: 'left',
      render: (val) => (val && dayjs(val).isValid() ? dayjs(val).format('DD/MM/YYYY') : '-')
    },
    {
      title: 'Đơn vị',
      dataIndex: 'donVi',
      key: 'donVi',
      editable: true,
      fixed: 'left'
    },
    {
      title: 'Vị trí',
      dataIndex: 'viTri',
      key: 'viTri',
      editable: true,
      width: 160
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      editable: true,
      key: 'trangThai',
      render: (value) => <Tag color={value ? 'green' : 'red'}>{value ? 'Đang dùng' : 'Dự phòng'}</Tag>
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      editable: true,
      width: 160
    },
    {
      title: 'Hành động',
      render: (_, record) => {
        const editing = isEditing(record);
        return editing ? (
          <Space>
            <Button type="primary" icon={<SaveOutlined />} onClick={() => save(record.key)} />
            <Button icon={<CloseOutlined />} onClick={cancel} />
          </Space>
        ) : (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => edit(record)} disabled={editingKey !== ''} />
            <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record)}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  // ================= MERGEDColums Truyền inputType xuống Cell=================
  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'trangThai' ? 'boolean' : col.dataIndex === 'ngaythang' ? 'date' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  //Khai báo biến chọn dòng dữ liệu
  // ================= SELECT-ROW =================
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys);
    },
    getCheckboxProps: (record) => ({
      disabled: editingKey !== '' && record.key !== editingKey
    })
  };

  // ================= DELETE-SELECT =================
  const handleDeleteMultiple = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một dòng');
      return;
    }

    try {
      const rowsToDelete = dataSource.filter((item) => selectedRowKeys.includes(item.key));

      // 👉 LẤY DANH SÁCH ID (chỉ những dòng đã lưu DB)
      const ids = rowsToDelete.filter((item) => item.id).map((item) => item.id);
      // 👉 GỌI API 1 LẦN DUY NHẤT
      if (ids.length > 0) {
        await deleteMultiple(ids);
      }

      setSelectedRowKeys([]);
      message.success(`Đã xóa ${rowsToDelete.length} dòng`);
    } catch (err) {
      console.error(err);
      message.error('Xóa nhiều dòng thất bại');
    } finally {
      console.log('Lỗi kiểu dữ liệu');
    }
  };
  // ================= SEARCH =================
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;
    return dataSource.filter((item) => Object.values(item).join(' ').toLowerCase().includes(searchText.toLowerCase()));
  }, [dataSource, searchText]);

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    // Map dữ liệu theo cột và tiêu đề tiếng Việt
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Tên thiết bị': item.tenThietBi,
      'Loại thiết bị': item.loaiThietBi,
      'Ghi chú': item.ghiChu
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Tên thiết bị', 'Loại thiết bị', 'Ghi chú']
    });

    // Set độ rộng cột
    worksheet['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 25 }, { wch: 15 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Nhatkymayxuc');

    XLSX.writeFile(workbook, 'Nhat-ky-may-xuc.xlsx');
  };
  return (
    <Form form={form} component={false}>
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
        rowSelection={rowSelection}
        components={{ body: { cell: EditableCell } }}
        bordered
        dataSource={filteredData}
        columns={mergedColumns}
        rowKey="key"
        loading={loading}
        pagination={{ pageSize: 6 }}
      />
    </Form>
  );
}

export default NhatkyMayxucTable;
