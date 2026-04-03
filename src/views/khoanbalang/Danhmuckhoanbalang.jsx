import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useDanhmuckhoanbalangStore } from '../../stores/khoanbalang/danhmuckhoanbalangStore';
import MainCard from '/src/components/MainCard';
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
const Danhmuckhoanbalang = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [localData, setLocalData] = useState([]);
  const {
    dataDanhmuckhoanbalang,
    loading,
    fetchDanhmuckhoanbalang,
    createDanhmuckhoanbalang,
    updateDanhmuckhoanbalang,
    deleteDanhmuckhoanbalang,
    deleteDanhmuckhoanbalangs
  } = useDanhmuckhoanbalangStore();

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchDanhmuckhoanbalang();
  }, []);

  /* ================= Data ================= */
  const dataSource = useMemo(() => {
    return [
      ...localData,
      ...dataDanhmuckhoanbalang.map((item) => ({
        ...item,
        key: item.id
      }))
    ];
  }, [dataDanhmuckhoanbalang, localData]);

  // ================= EDIT =================
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      tenThietBi: record.tenThietBi,
      ghiChu: record.ghiChu
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
        ghiChu: row.ghiChu
      };

      if (String(key).startsWith('new_')) {
        await createDanhmuckhoanbalang(payload);
      } else {
        await updateDanhmuckhoanbalang(payload);
      }

      fetchDanhmuckhoanbalang();
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
      await deleteDanhmuckhoanbalang(record.id);
      fetchDanhmuckhoanbalang();
    }
  };

  //=======================ADD===================================
  const handleOpenAdd = () => {
    if (editingKey) return message.warning('Hoàn thành dòng đang sửa');
    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      tenThietBi: '',
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
      [item.tenThietBi, item.ghiChu].filter(Boolean).some((val) => String(val).toLowerCase().includes(keyword))
    );
  }, [dataSource, searchText]);

  /* ================= Columns ================= */
  const columns = [
    { title: 'Tên thiết bị', dataIndex: 'tenThietBi', editable: true },
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
    if (!selectedRowKeys.length) return;

    Modal.confirm({
      title: `Xóa ${selectedRowKeys.length} bản ghi đã chọn?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // chỉ lấy ID số (bỏ new_xxx)
          const validIds = selectedRowKeys.filter((id) => typeof id === 'number');

          if (!validIds.length) {
            message.warning('Không có bản ghi hợp lệ');
            return;
          }

          await deleteDanhmuckhoanbalangs(validIds);
          setSelectedRowKeys([]);
          fetchDanhmuckhoanbalang();
        } catch (error) {
          message.error('Xóa nhiều thất bại');
        }
      }
    });
  };

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    // Map dữ liệu theo cột và tiêu đề tiếng Việt
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Tên thiết bị': item.tenThietBi,
      'Ghi chú': item.ghiChu
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Tên thiết bị', 'Ghi chú']
    });

    // Set độ rộng cột
    worksheet['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 25 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danhmuckhoanbalang');
    XLSX.writeFile(workbook, 'Danh_muc_khoan-ba-lang.xlsx');
  };
  return (
    <MainCard>
      <Form form={form} component={false}>
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
};

export default Danhmuckhoanbalang;
