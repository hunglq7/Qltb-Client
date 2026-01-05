import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useDanhmucbomnuocStore } from '../../stores/bomnuoc/danhmucbomnuocStore';
import MainCard from '/src/components/MainCard';
import * as XLSX from 'xlsx';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
// ================= EDIT ABLECELL =================
const EditableCell = ({ editing, dataIndex, children, ...restProps }) => {
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
const Danhmucbomnuoc = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [localData, setLocalData] = useState([]);
  const {
    dataDanhmucbomnuoc,
    loading,
    fetchDanhmucbomnuoc,
    createDanhmucbomnuoc,
    updateDanhmucbomnuoc,
    deleteDanhmucbomnuoc,
    deleteMultiple
  } = useDanhmucbomnuocStore();
  // ================= LOAD DATA =================
  useEffect(() => {
    fetchDanhmucbomnuoc();
  }, []);

  /* ================= Data ================= */
  const dataSource = useMemo(() => {
    return [
      ...localData,
      ...dataDanhmucbomnuoc.map((item) => ({
        ...item,
        key: item.id
      }))
    ];
  }, [dataDanhmucbomnuoc, localData]);

  // ================= EDIT =================
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      tenThietBi: record.tenThietBi,
      loaiThietBi: record.loaiThietBi
    });
    setEditingKey(record.key);
  };

  // ================= CANCEL =================
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
        loaiThietBi: row.loaiThietBi
      };

      if (String(key).startsWith('new_')) {
        await createDanhmucbomnuoc(payload);
        message.success('Thêm mới thành công');
      } else {
        await updateDanhmucbomnuoc(payload);
        message.success('Cập nhật thành công');
      }

      fetchDanhmucbomnuoc();
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
      await deleteDanhmucbomnuoc(record.id);
      fetchDanhmucbomnuoc();
    }
  };

  //=======================ADD===================================
  const handleOpenAdd = () => {
    if (editingKey) return message.warning('Hoàn thành dòng đang sửa');

    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      tenThietBi: '',
      loaiThietBi: ''
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
      [item.tenThietBi, item.loaiThietBi].filter(Boolean).some((val) => String(val).toLowerCase().includes(keyword))
    );
  }, [dataSource, searchText]);
  /* ================= Columns ================= */
  const columns = [
    { title: 'Tên thiết bị', dataIndex: 'tenThietBi', editable: true },
    { title: 'Loại thiết bị', dataIndex: 'loaiThietBi', editable: true },
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
        fetchDanhmucbomnuoc();
      }
    });
  };

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    // Map dữ liệu theo cột và tiêu đề tiếng Việt
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Tên thiết bị': item.tenThietBi,
      'Loại thiết bị': item.loaiThietBi
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Tên thiết bị', 'Loại thiết bị']
    });

    // Set độ rộng cột
    worksheet['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 25 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danhmucbomnuoc');
    XLSX.writeFile(workbook, 'Danh_muc_bom-nuoc.xlsx');
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
};

export default Danhmucbomnuoc;
