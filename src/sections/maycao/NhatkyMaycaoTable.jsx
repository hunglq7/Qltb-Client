import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row, Tag, Switch, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { nhatkymaycaoService } from '../../services/maycao/nhatkymaycaoService';
import SearchBar from '../../components/SearchBar';
import ActionBar from '../../components/ActionBar';
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

function NhatkyMaycaoTable({ nhatkymaycao }) {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const id = nhatkymaycao?.id ?? nhatkymaycao?.mayCaoId ?? null;

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await nhatkymaycaoService.getNhatkyById(id);
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
      ...record,
      ngayThang: record.ngayThang ? dayjs(record.ngayThang) : null
    });
    setEditingKey(record.key);
  };
  const cancel = () => setEditingKey('');

  // ================= SAVE =================
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const record = data.find((item) => item.key === key);
      if (!record) {
        message.error('Không tìm thấy dòng dữ liệu');
        return;
      }
      const payload = {
        ...record,
        ...row,
        tongHopMayCaoId: record.tongHopMayCaoId ?? id,
        ngayThang: row.ngayThang
          ? row.ngayThang.toISOString() // ✅ nên gửi ISO
          : null
      };
      if (!payload.tongHopMayCaoId) {
        message.error('Thiếu thông tin tổng hợp máy cào');
        return;
      }
      if (String(key).startsWith('new_')) {
        // ➕ THÊM MỚI
        const { id, key, ...createPayload } = payload;
        console.log('createPayload', createPayload);
        await nhatkymaycaoService.addNhatkymaycao(createPayload);
        message.success('Thêm mới thành công');
      } else {
        // ✏️ CẬP NHẬT

        await nhatkymaycaoService.updateNhatkymaycao(payload);
        message.success('Cập nhật thành công');
      }

      setEditingKey('');
      fetchData();
    } catch (err) {
      message.error('Lỗi dữ liệu');
    }
  };
  // ================= DELETE =================
  const handleDelete = async (record) => {
    try {
      setLoading(true);

      if ((record.key + '').startsWith('new_')) {
        setData((prev) => prev.filter((i) => i.key !== record.key));
      } else {
        await nhatkymaycaoService.deleteNhatkymaycao(record.id);
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
      tongHopMayCaoId: id,
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

  const columns = [
    {
      title: 'Ngày tháng',
      dataIndex: 'ngayThang',
      key: 'ngayThang',
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
        inputType: col.dataIndex === 'trangThai' ? 'boolean' : col.dataIndex === 'ngayThang' ? 'date' : 'text',
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
      setLoading(true);

      const rowsToDelete = data.filter((item) => selectedRowKeys.includes(item.key));

      // 👉 LẤY DANH SÁCH ID (chỉ những dòng đã lưu DB)
      const ids = rowsToDelete.filter((item) => item.id).map((item) => item.id);
      console.log(ids);
      // 👉 GỌI API 1 LẦN DUY NHẤT
      if (ids.length > 0) {
        await nhatkymaycaoService.deleteNhatkyMaycaos(ids);
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

export default NhatkyMaycaoTable;
