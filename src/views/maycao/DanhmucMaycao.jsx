import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { danhmucmaycaoService } from '../../services/maycao/danhmucmaycaoService';
import * as XLSX from 'xlsx';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';

// ================= EDIT ABLECELL =================
const EditableCell = ({ editing, dataIndex, children, inputType, ...restProps }) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default function DanhmucMaycao() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await danhmucmaycaoService.getDanhmucmaycaos();
      const mapped = res.data.map((item) => ({
        ...item,
        key: item.id
      }));
      setData(mapped);
    } catch (err) {
      message.error('Không tải được dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT =================
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      tenThietBi: record.tenThietBi,
      loaiThietBi: record.loaiThietBi,
      ghiChu: record.ghiChu
    });
    setEditingKey(record.key);
  };

  // ================= CANCEL =================
  const cancel = () => {
    if ((editingKey + '').startsWith('new_')) {
      setData((prev) => prev.filter((i) => i.key !== editingKey));
    }
    setEditingKey('');
  };

  // ================= SAVE =================
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const record = data.find((i) => i.key === key);

      const payload = {
        id: record.id ?? 0,
        tenThietBi: row.tenThietBi,
        loaiThietBi: row.loaiThietBi,
        ghiChu: row.ghiChu
      };

      setLoading(true);

      if ((key + '').startsWith('new_')) {
        await danhmucmaycaoService.addDanhmucmaycao(payload);
        message.success('Thêm thành công');
        fetchData();
      } else {
        await danhmucmaycaoService.updateDanhmucmaycao(payload);
        message.success('Cập nhật thành công');
        setData((prev) => prev.map((item) => (item.key === key ? { ...item, ...payload } : item)));
      }

      setEditingKey('');
    } catch (err) {
      message.error('Lưu thất bại');
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (record) => {
    try {
      setLoading(true);

      if ((record.key + '').startsWith('new_')) {
        setData((prev) => prev.filter((i) => i.key !== record.key));
      } else {
        await danhmucmaycaoService.deleteDanhmucmaycao(record.id);
        setData((prev) => prev.filter((i) => i.key !== record.key));
      }

      message.success('Đã xóa');
    } catch (err) {
      message.error('Xóa thất bại');
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD-NEW=================

  const handleOpenAdd = () => {
    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      id: null,
      tenThietBi: '',
      loaiThietBi: '',
      ghiChu: ''
    };
    setData((prev) => [newRow, ...prev]);
    form.setFieldsValue(newRow);
    setEditingKey(key);
  };

  const columns = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'tenThietBi',
      editable: true
    },
    {
      title: 'Loại thiết bị',
      dataIndex: 'loaiThietBi',
      editable: true
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      editable: true
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

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
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
      setLoading(true);

      const rowsToDelete = data.filter((item) => selectedRowKeys.includes(item.key));

      // 👉 LẤY DANH SÁCH ID (chỉ những dòng đã lưu DB)
      const ids = rowsToDelete.filter((item) => item.id).map((item) => item.id);
      console.log(ids);
      // 👉 GỌI API 1 LẦN DUY NHẤT
      if (ids.length > 0) {
        await danhmucmaycaoService.deleteDanhmucmaycaos(ids);
      }

      // 👉 CẬP NHẬT UI
      setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.key)));

      setSelectedRowKeys([]);
      message.success(`Đã xóa ${rowsToDelete.length} dòng`);
    } catch (err) {
      console.error(err);
      message.error('Xóa nhiều dòng thất bại');
    } finally {
      setLoading(false);
    }
  };

  // ================= SEARCH =================
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    return data.filter((item) => Object.values(item).join(' ').toLowerCase().includes(searchText.toLowerCase()));
  }, [data, searchText]);

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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danhmucmaycao');
    XLSX.writeFile(workbook, 'Danh_muc_may_cao.xlsx');
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
