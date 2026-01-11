import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row, Tag, Switch, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useNhatkyquatgioStore } from '../../stores/quatgio/nhatkyquatgioStore';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
import dayjs from 'dayjs';
// ================= Editable Cell =================
const EditableCell = ({ editing, dataIndex, inputType, children, ...restProps }) => {
  let inputNode;

  if (inputType === 'boolean') inputNode = <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />;
  else if (inputType === 'date') inputNode = <DatePicker format="DD/MM/YYYY" />;
  else inputNode = <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          valuePropName={inputType === 'boolean' ? 'checked' : 'value'}
          style={{ margin: 0 }}
          rules={dataIndex === 'ngaythang' ? [{ required: true, message: 'Chọn ngày' }] : []}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const NhatkyquatgioTable = ({ tonghopquatgio }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);
  const [localData, setLocalData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const tonghopquatgioId = tonghopquatgio?.id;
  const {
    dataNhatkyquatgio,
    loading,
    getNhatkyquatgioById,
    createNhatkyquatgio,
    updateNhatkyquatgio,
    deleteNhatkyquatgio,
    deleteMultiple
  } = useNhatkyquatgioStore();

  // ================= LOAD DATA =================
  useEffect(() => {
    if (tonghopquatgioId) getNhatkyquatgioById(tonghopquatgioId);
  }, [tonghopquatgioId]);

  // ================= DATA SOURCE =================
  const dataSource = useMemo(() => {
    return [
      ...localData,
      ...dataNhatkyquatgio.map((x) => ({
        ...x,
        key: x.id
      }))
    ];
  }, [localData, dataNhatkyquatgio]);
  const isEditing = (record) => record.key === editingKey;

  // ================= ADD =================
  const handleAdd = () => {
    if (editingKey) return message.warning('Đang sửa một dòng');

    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      id: null,
      tonghopquatgioId: tonghopquatgioId,
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
  // ================= EDIT =================
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      // Chuyển đổi: nếu là "Đang dùng" thì Switch là true, ngược lại false
      trangThai: record.trangThai === 'Đang dùng',
      ngaythang: record.ngaythang ? dayjs(record.ngaythang) : null
    });
    setEditingKey(record.key);
  };

  // ================= CANCEL =================
  const cancel = () => {
    setLocalData([]);
    setEditingKey(null);
    form.resetFields();
  };
  // ================= SAVE =================
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const record = dataSource.find((x) => x.key === key);

      if (!record) return;

      const payload = {
        id: record.id,
        tonghopquatgioId: tonghopquatgioId,
        ngaythang: row.ngaythang ? dayjs(row.ngaythang).format('YYYY-MM-DD') : null,
        donVi: row.donVi,
        viTri: row.viTri,
        // Logic: Nếu Switch bật (true) -> "Đang dùng", tắt (false) -> "Dự phòng"
        trangThai: row.trangThai ? 'Đang dùng' : 'Dự phòng',
        ghiChu: row.ghiChu
      };
      const { id, ...createPayload } = payload;
      if (String(key).startsWith('new_')) {
        await createNhatkyquatgio(createPayload);
        message.success('Thêm mới thành công');
      } else {
        await updateNhatkyquatgio(id, payload);
        message.success('Cập nhật thành công');
      }
      getNhatkyquatgioById(tonghopquatgioId);
      cancel();
    } catch (err) {
      console.error(err);
      message.error('Lưu dữ liệu thất bại (400)');
    }
  };
  // ================= DELETE =================
  const handleDelete = async (record) => {
    if (String(record.key).startsWith('new_')) {
      cancel();
      return;
    }

    await deleteNhatkyquatgio(record.id);
    message.success('Đã xóa');
    getNhatkyquatgioById(tonghopquatgioId);
  };

  // ================= DELETE MULTIPLE =================
  const handleDeleteMultiple = async () => {
    if (selectedRowKeys.length === 0) return message.warning('Chọn ít nhất 1 dòng');

    await deleteMultiple(selectedRowKeys);
    setSelectedRowKeys([]);
    message.success('Đã xóa nhiều dòng');
    getNhatkyquatgioById(tonghopquatgioId);
  };
  // ================= SEARCH =================
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;
    return dataSource.filter((item) => Object.values(item).join(' ').toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText, dataSource]);

  // ================= COLUMNS =================
  const columns = [
    {
      title: 'Ngày tháng',
      dataIndex: 'ngaythang',
      editable: true,
      inputType: 'date',
      render: (v) => (v ? dayjs(v).format('DD/MM/YYYY') : '-')
    },
    { title: 'Đơn vị', dataIndex: 'donVi', editable: true },
    { title: 'Vị trí', dataIndex: 'viTri', editable: true },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai', // Đổi duPhong thành trangThai cho khớp backend
      editable: true,
      inputType: 'boolean',
      key: 'trangThai',
      render: (value) => <Tag color={value === 'Đang dùng' ? 'green' : 'red'}>{value === 'Đang dùng' ? 'Đang dùng' : 'Dự phòng'}</Tag>
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
            <Button icon={<EditOutlined />} disabled={editingKey !== null} onClick={() => edit(record)} />
            <Popconfirm title="Xóa dòng này?" onConfirm={() => handleDelete(record)}>
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
            inputType: col.inputType,
            dataIndex: col.dataIndex,
            editing: isEditing(record)
          })
        }
  );

  return (
    <Form form={form} component={false}>
      <Row gutter={8} style={{ marginBottom: 12 }}>
        <SearchBar onSearch={setSearchText} />
        <ActionBar
          handleOpenAdd={handleAdd}
          onDeleteMultiple={handleDeleteMultiple}
          disabledDelete={!selectedRowKeys.length}
          selectedRowKeys={selectedRowKeys}
        />
      </Row>

      <Table
        components={{ body: { cell: EditableCell } }}
        rowKey="key"
        bordered
        loading={loading}
        dataSource={filteredData}
        columns={mergedColumns}
        pagination={{ pageSize: 6 }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          getCheckboxProps: (r) => ({
            disabled: editingKey && r.key !== editingKey
          })
        }}
      />
    </Form>
  );
};

export default NhatkyquatgioTable;
