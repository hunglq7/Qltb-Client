import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row, Switch, DatePicker, Tag, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import MainCard from '/src/components/MainCard';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
import { useDanhmuctoidienStore } from '../../stores/toidien/damuctoidienStore';

/* ================= Editable Cell ================= */
const EditableCell = ({ editing, dataIndex, inputType, children, ...restProps }) => {
  let inputNode = <Input />;

  if (inputType === 'boolean') inputNode = <Switch />;
  if (inputType === 'year') inputNode = <DatePicker picker="year" />;

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

/* ================= Component ================= */
function Danhmuctoidien() {
  const { dataDanhmuc, loading, fetchDanhmuctoidien, createDanhmuctoidien, updateDanhmuctoidien, deleteDanhmuctoidien, deleteMultiple } =
    useDanhmuctoidienStore();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [localData, setLocalData] = useState([]);

  useEffect(() => {
    fetchDanhmuctoidien();
  }, []);

  /* ================= Data ================= */
  const dataSource = useMemo(() => {
    return [
      ...localData,
      ...dataDanhmuc.map((item) => ({
        ...item,
        key: item.id
      }))
    ];
  }, [dataDanhmuc, localData]);

  const isEditing = (record) => record.key === editingKey;

  /* ================= Actions EDIT ================= */
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      namSanXuat: record.namSanXuat ? dayjs().year(record.namSanXuat) : null
    });
    setEditingKey(record.key);
  };
  //=====================  Actions CANCEL ==========================
  const cancel = () => {
    setLocalData([]);
    setEditingKey('');
  };

  //====================== Actions SAVE =========================
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const record = dataSource.find((x) => x.key === key);
      const payload = {
        id: record.id || 0,
        tenThietBi: row.tenThietBi,
        loaiThietBi: row.loaiThietBi,
        namSanXuat: row.namSanXuat
          ? row.namSanXuat.format('YYYY') // ⭐ Chuyển dữ liệu ngày tháng về string để truyền về backen có dữ liệu kiểu string
          : '',
        hangSanXuat: row.hangSanXuat,
        tinhTrang: row.tinhTrang,
        ghiChu: row.ghiChu
      };

      if (String(key).startsWith('new_')) {
        await createDanhmuctoidien(payload);
        message.success('Thêm mới thành công');
      } else {
        await updateDanhmuctoidien(payload);
        message.success('Cập nhật thành công');
      }

      fetchDanhmuctoidien();
      setEditingKey('');
      setLocalData([]);
    } catch {
      message.error('Lỗi lưu dữ liệu');
    }
  };
  //======================DELETE==================================
  const handleDelete = async (record) => {
    if (String(record.key).startsWith('new_')) {
      setLocalData([]);
    } else {
      await deleteDanhmuctoidien(record.id);
      fetchDanhmuctoidien();
    }
  };
  //=======================ADD===================================
  const handleOpenAdd = () => {
    if (editingKey) return message.warning('Hoàn thành dòng đang sửa');

    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      tenThietBi: '',
      loaiThietBi: '',
      namSanXuat: null,
      hangSanXuat: '',
      tinhTrang: false,
      ghiChu: ''
    };

    setLocalData([newRow]);
    form.setFieldsValue(newRow);
    setEditingKey(key);
  };
  // ====================== Tìm kiếm ==========================
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;
    const keyword = searchText.toLowerCase();
    return dataSource.filter((item) =>
      [item.tenThietBi, item.loaiThietBi, item.hangSanXuat, item.namSanXuat, item.ghiChu]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(keyword))
    );
  }, [dataSource, searchText]);

  /* ================= Columns ================= */
  const columns = [
    { title: 'Tên thiết bị', dataIndex: 'tenThietBi', editable: true },
    { title: 'Loại thiết bị', dataIndex: 'loaiThietBi', editable: true },
    { title: 'Năm SX', dataIndex: 'namSanXuat', editable: true, inputType: 'year' },
    { title: 'Hãng SX', dataIndex: 'hangSanXuat', editable: true },
    {
      title: 'Tình trạng',
      dataIndex: 'tinhTrang',
      editable: true,
      inputType: 'boolean',
      render: (v) => <Tag color={v ? 'green' : 'red'}>{v ? 'Đang dùng' : 'Dự phòng'}</Tag>
    },
    { title: 'Ghi chú', dataIndex: 'ghiChu', editable: true },
    {
      title: 'Hành động',
      render: (_, record) => {
        const editing = isEditing(record);
        return editing ? (
          <Space>
            <Button icon={<SaveOutlined />} type="primary" onClick={() => save(record.key)} />
            <Button icon={<CloseOutlined />} onClick={cancel} />
          </Space>
        ) : (
          <Space>
            <Button icon={<EditOutlined />} disabled={editingKey} onClick={() => edit(record)} />
            <Popconfirm title="Xóa bản ghi?" onConfirm={() => handleDelete(record)}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  const mergedColumns = columns.map((col) =>
    col.editable
      ? {
          ...col,
          onCell: (record) => ({
            record,
            inputType: col.inputType,
            dataIndex: col.dataIndex,
            editing: isEditing(record)
          })
        }
      : col
  );

  /* ================= Delete Multiple ================= */

  const handleDeleteMultiple = () => {
    Modal.confirm({
      title: `Xóa ${selectedRowKeys.length} bản ghi?`,
      onOk: async () => {
        // Chỉ lấy những ID là kiểu số (đã tồn tại trong DB)
        const validIds = selectedRowKeys.filter((key) => typeof key === 'number' && !isNaN(key));

        if (validIds.length === 0) {
          message.warning('Không có bản ghi hợp lệ để xóa trên server');
          return;
        }
        await deleteMultiple(validIds);
        setSelectedRowKeys([]);
        fetchDanhmuctoidien();
      }
    });
  };

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    // Map dữ liệu theo cột và tiêu đề tiếng Việt
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Tên thiết bị': item.tenThietBi,
      'Loại thiết bị': item.loaiThietBi,
      'Năm sản xuất': item.namSanXuat,
      'Hãng sản xuất': item.hangSanXuat,
      'Tình trạng': item.tinhTrang ? 'Đang sử dụng' : 'Không sử dụng',
      'Ghi chú': item.ghiChu
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Tên thiết bị', 'Loại thiết bị', 'Năm sản xuất', 'Hãng sản xuất', 'Tình trạng', 'Ghi chú']
    });

    // Set độ rộng cột
    worksheet['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 25 }, { wch: 5 }, { wch: 15 }, { wch: 10 }, { wch: 15 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danhmuctoidien');
    XLSX.writeFile(workbook, 'Danh_muc_toi_dien.xlsx');
  };
  return (
    <MainCard>
      <Form form={form} component={false}>
        <Row gutter={8} style={{ marginBottom: 12 }}>
          <SearchBar onSearch={setSearchText} />
          <ActionBar
            handleOpenAdd={handleOpenAdd}
            onDeleteMultiple={handleDeleteMultiple}
            disabledDelete={!selectedRowKeys.length}
            handleExportExcel={handleExportExcel}
          />
        </Row>

        <Table
          bordered
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            getCheckboxProps: (record) => ({
              disabled: String(record.key).startsWith('new_')
            })
          }}
          components={{ body: { cell: EditableCell } }}
          dataSource={filteredData}
          columns={mergedColumns}
          selectedRowKeys={selectedRowKeys}
          disabledDelete={selectedRowKeys.length === 0}
          pagination={{ pageSize: 6 }}
          rowKey={(record) => record.id ?? record.key}
        />
      </Form>
    </MainCard>
  );
}

export default Danhmuctoidien;
