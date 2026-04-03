import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import MainCard from '/src/components/MainCard';
import * as XLSX from 'xlsx';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
import { useDanhmucaptomatkhoidongtuStore } from '/src/stores/aptomatkhoidongtu/danhmucaptomatkhoidongtuStore';

const Danhmucaptomatkhoidongtu = () => {
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const tableRef = useRef(null);
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [localData, setLocalData] = useState([]);
  const {
    dataDanhmucaptomatkhoidongtu,
    loading,
    fetchDanhmucaptomatkhoidongtu,
    createDanhmucaptomatkhoidongtu,
    updateDanhmucaptomatkhoidongtu,
    deleteDanhmucaptomatkhoidongtu,
    deleteDanhmucaptomatkhoidongtus
  } = useDanhmucaptomatkhoidongtuStore();

  // ================= EDIT ABLECELL =================
  const EditableCell = ({ editing, dataIndex, children, required, inputType, ...restProps }) => {
    // Tìm column config để lấy rules
    const columnConfig = columns.find((col) => col.dataIndex === dataIndex);
    const rules = columnConfig?.rules || [];

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item name={dataIndex} style={{ margin: 0 }} rules={rules}>
            <Input ref={dataIndex === 'tenThietBi' ? inputRef : null} />
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  // ================= LOAD DATA =================
  useEffect(() => {
    fetchDanhmucaptomatkhoidongtu();
  }, []);

  /* ================= Data ================= */
  const dataSource = useMemo(() => {
    return [
      ...localData,
      ...dataDanhmucaptomatkhoidongtu.map((item) => ({
        ...item,
        key: item.id
      }))
    ];
  }, [dataDanhmucaptomatkhoidongtu, localData]);

  // ================= EDIT =================
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      ...record
    });
    setEditingKey(record.key);
  };

  // ================= CANCEL =================
  const cancel = () => {
    setLocalData([]);
    setEditingKey('');
  };

  //====================== Actions SAVE =========================
  const save = async (key) => {
    try {
      // 1. Lấy dữ liệu từ form
      const values = await form.validateFields();

      // 2. Tìm record hiện tại
      const record = dataSource.find((item) => item.key === key);
      if (!record) {
        message.error('Không tìm thấy bản ghi');
        return;
      }

      // 3. Tạo payload với mapping đúng field names
      const payload = {
        id: record.id ?? 0,
        tenThietBi: values.tenThietBi,
        loaiThietBi: values.loaiThietBi,
        ghiChu: values.ghiChu
      };

      // 4. Kiểm tra thêm mới hay cập nhật
      const isNew = String(key).startsWith('new_');

      const apiCall = isNew ? createDanhmucaptomatkhoidongtu : updateDanhmucaptomatkhoidongtu;

      // 5. Gọi API
      await apiCall(payload);

      // 7. Thoát edit và refresh data
      setEditingKey('');
      setLocalData([]);
      await fetchDanhmucaptomatkhoidongtu();
    } catch (error) {
      console.error('Save failed:', error);
      message.error('Lỗi khi lưu: ' + (error.response?.data?.message || error.message));
    }
  };

  //======================DELETE==================================
  const handleDelete = async (record) => {
    try {
      const isNew = String(record.key).startsWith('new_');

      if (isNew) {
        // Xóa local đúng 1 dòng
        setLocalData((prev) => prev.filter((item) => item.key !== record.key));
      } else {
        // Xóa DB
        await deleteDanhmucaptomatkhoidongtu(record.id);
        await fetchDanhmucaptomatkhoidongtu();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };
  /* ================= Delete Multiple ================= */
  const handleDeleteMultiple = async () => {
    if (!selectedRowKeys.length) return;
    Modal.confirm({
      title: `Xóa ${selectedRowKeys.length} bản ghi đã chọn?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteDanhmucaptomatkhoidongtus(selectedRowKeys);
          await fetchDanhmucaptomatkhoidongtu();
          setSelectedRowKeys([]);
        } catch (error) {
          console.error('Delete multiple failed:', error);
        }
      }
    });
  };
  //=======================ADD===================================
  const handleOpenAdd = () => {
    if (editingKey) {
      return message.warning('Hoàn thành dòng đang sửa');
    }

    const newKey = `new_${Date.now()}`;

    const newRow = {
      key: newKey,
      tenThietBi: '',
      loaiThietBi: '',
      ghiChu: ''
    };
    setLocalData((prev) => [newRow, ...prev]);
    form.setFieldsValue(newRow);
    setEditingKey(newKey);
    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    // Scroll lên trên
    setTimeout(() => {
      tableRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  };

  // ====================== Tìm kiếm ==========================
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;
    const keyword = searchText.toLowerCase();
    return dataSource.filter((item) => Object.values(item).some((value) => String(value).toLowerCase().includes(keyword)));
  }, [dataSource, searchText]);

  /* ================= Columns ================= */
  const columns = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'tenThietBi',
      width: '30%',
      editable: true,
      rules: [{ required: true, message: 'Vui lòng nhập tên thiết bị' }]
    },
    {
      title: 'Loại thiết bị',
      dataIndex: 'loaiThietBi',
      width: '30%',
      editable: true,
      rules: [{ required: true, message: 'Vui lòng nhập loại thiết bị' }]
    },
    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
      width: '30%',
      editable: true
    },
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
            editing: isEditing(record),
            required: col.rules?.some((r) => r.required)
          })
        }
      : col
  );

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    const exportData = dataSource.map(({ id, key, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danhmucaptomatkhoidongtu');
    XLSX.writeFile(workbook, 'Danhmucaptomatkhoidongtu.xlsx');
  };
  return (
    <MainCard title="Danh mục aptomat khôi động từ">
      <Row gutter={8} style={{ marginBottom: 12 }}>
        <SearchBar onSearch={setSearchText} />
        <ActionBar
          handleOpenAdd={handleOpenAdd}
          onDeleteMultiple={handleDeleteMultiple}
          selectedRowKeys={selectedRowKeys}
          disabledDelete={!selectedRowKeys.length}
          handleExportExcel={handleExportExcel}
        />
      </Row>
      <Form form={form} component={false}>
        <Table
          ref={tableRef}
          components={{ body: { cell: EditableCell } }}
          bordered
          dataSource={filteredData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ pageSize: 5 }}
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys)
          }}
        />
      </Form>
    </MainCard>
  );
};

export default Danhmucaptomatkhoidongtu;
