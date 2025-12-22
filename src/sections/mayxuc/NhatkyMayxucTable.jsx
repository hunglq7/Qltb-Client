import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row, Tag, Switch, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { nhatkymayxucService } from '../../services/mayxuc/nhatkymayxucService';
import SearchBar from '../../components/SearchBar';
import ActionBar from '../../components/ActionBar';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';

/* ================= EditableCell ================= */
const EditableCell = ({ editing, dataIndex, inputType, record, children, ...restProps }) => {
  let inputNode;
  switch (inputType) {
    case 'boolean':
      inputNode = <Switch />;
      break;
    case 'date':
      inputNode = <DatePicker format="DD/MM/YYYY" />;
      break;
    default:
      inputNode = <Input />;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} valuePropName={inputType === 'boolean' ? 'checked' : 'value'} style={{ margin: 0 }}>
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
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');

  const id = thongsomayxuc?.tonghopmayxucId ?? null;

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await nhatkymayxucService.getNhatkyById(id);
      const mapped = res.data.map((item) => ({
        ...item,
        key: item.id
      }));
      setData(mapped);
    } catch (err) {
      message.error('Không tải được dữ liệu nhật ký máy xúc');
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      ngayThang: record.ngayThang ? dayjs(record.ngayThang) : null
    });
    setEditingKey(record.key);
  };

  const cancel = () => setEditingKey('');

  /* ================= SAVE ================= */
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const record = data.find((item) => item.key === key);
      if (!record) return;

      const payload = {
        ...record,
        ...row,
        tonghopmayxucId: id,
        ngayThang: row.ngayThang ? row.ngayThang.toISOString() : null
      };

      if (String(key).startsWith('new_')) {
        const { id, key, ...createPayload } = payload;
        console.log('createPayload', createPayload);
        await nhatkymayxucService.addNhatkymayxuc(createPayload);
        message.success('Thêm mới thành công');
      } else {
        await nhatkymayxucService.updateNhatkymayxuc(payload);
        message.success('Cập nhật thành công');
      }

      setEditingKey('');
      fetchData();
    } catch (err) {
      message.error('Lỗi lưu dữ liệu');
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      if (String(record.key).startsWith('new_')) {
        setData((prev) => prev.filter((i) => i.key !== record.key));
      } else {
        await nhatkymayxucService.deleteNhatkymayxuc(record.id);
        setData((prev) => prev.filter((i) => i.key !== record.key));
      }
      message.success('Đã xóa');
    } catch {
      message.error('Xóa thất bại');
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD NEW ================= */
  const handleOpenAdd = () => {
    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      id: null,
      tonghopmayxucId: id,
      ngayThang: dayjs(),
      donVi: '',
      viTri: '',
      trangThai: true,
      ghiChu: ''
    };
    setData((prev) => [newRow, ...prev]);
    form.setFieldsValue(newRow);
    setEditingKey(key);
  };

  /* ================= COLUMNS ================= */
  const columns = [
    {
      title: 'Ngày tháng',
      dataIndex: 'ngayThang',
      editable: true,
      width: 140,
      fixed: 'left',
      render: (v) => (v && dayjs(v).isValid() ? dayjs(v).format('DD/MM/YYYY') : '-')
    },
    { title: 'Đơn vị', dataIndex: 'donVi', editable: true },
    { title: 'Vị trí', dataIndex: 'viTri', editable: true },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      editable: true,
      render: (v) => <Tag color={v ? 'green' : 'red'}>{v ? 'Đang dùng' : 'Dự phòng'}</Tag>
    },
    { title: 'Ghi chú', dataIndex: 'ghiChu', editable: true },
    {
      title: 'Hành động',
      render: (_, record) =>
        isEditing(record) ? (
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
        )
    }
  ];

  const mergedColumns = columns.map((col) =>
    !col.editable
      ? col
      : {
          ...col,
          onCell: (record) => ({
            record,
            inputType: col.dataIndex === 'trangThai' ? 'boolean' : col.dataIndex === 'ngayThang' ? 'date' : 'text',
            dataIndex: col.dataIndex,
            editing: isEditing(record)
          })
        }
  );

  /* ================= DELETE MULTIPLE ================= */
  const handleDeleteMultiple = async () => {
    if (!selectedRowKeys.length) {
      message.warning('Chọn ít nhất một dòng');
      return;
    }

    try {
      setLoading(true);
      const rows = data.filter((i) => selectedRowKeys.includes(i.key));
      const ids = rows.filter((i) => i.id).map((i) => ({ id: i.id }));

      if (ids.length) {
        await nhatkymayxucService.deleteNhatkyMayxucs(ids);
      }

      setData((prev) => prev.filter((i) => !selectedRowKeys.includes(i.key)));
      setSelectedRowKeys([]);
      message.success(`Đã xóa ${rows.length} dòng`);
    } catch {
      message.error('Xóa nhiều dòng thất bại');
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */
  const filteredData = useMemo(() => {
    if (!searchText) return data;
    return data.filter((item) => Object.values(item).join(' ').toLowerCase().includes(searchText.toLowerCase()));
  }, [data, searchText]);

  /* ================= EXPORT EXCEL ================= */
  const handleExportExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Ngày tháng': item.ngayThang ? dayjs(item.ngayThang).format('DD/MM/YYYY') : '',
      'Đơn vị': item.donVi,
      'Vị trí': item.viTri,
      'Trạng thái': item.trangThai ? 'Đang dùng' : 'Dự phòng',
      'Ghi chú': item.ghiChu
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'NhatkyMayxuc');
    XLSX.writeFile(wb, 'Nhat_ky_may_xuc.xlsx');
  };

  return (
    <Form form={form} component={false}>
      <Row gutter={8} style={{ marginBottom: 12 }}>
        <SearchBar onSearch={setSearchText} />
        <ActionBar
          handleOpenAdd={handleOpenAdd}
          onDeleteMultiple={handleDeleteMultiple}
          disabledDelete={!selectedRowKeys.length}
          selectedRowKeys={selectedRowKeys}
          handleExportExcel={handleExportExcel}
        />
      </Row>

      <Table
        bordered
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        components={{ body: { cell: EditableCell } }}
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
