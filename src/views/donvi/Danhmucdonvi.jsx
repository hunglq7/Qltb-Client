import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row, Modal, Tag, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useDonviStore } from '/src/stores/donvi/donviStore';
import MainCard from '/src/components/MainCard';
import * as XLSX from 'xlsx';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
/* ================= Editable Cell ================= */
const EditableCell = ({ editing, dataIndex, inputType, children, ...restProps }) => {
  let inputNode = <Input />;
  if (inputType === 'boolean') inputNode = <Switch />;
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

const Danhmucdonvi = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [localData, setLocalData] = useState([]);
  const { dataDonvi, loading, fetchDonvi, createDonvi, updateDonvi, deleteDonvi, deleteMultiple } = useDonviStore();

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchDonvi();
  }, []);

  /* ================= Data ================= */
  const dataSource = useMemo(() => {
    return [
      ...localData,
      ...dataDonvi.map((item) => ({
        ...item,
        key: item.id
      }))
    ];
  }, [dataDonvi, localData]);

  //=======================ADD===================================
  const handleOpenAdd = () => {
    if (editingKey) return message.warning('Hoàn thành dòng đang sửa');
    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      tenPhong: '',
      tinhTrang: true
    };
    setLocalData([newRow]);
    form.setFieldsValue(newRow);
    setEditingKey(key);
  };

  // ================= EDIT =================
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record
    });
    setEditingKey(record.key);
  };

  //======================DELETE ONE==================================
  const handleDelete = async (record) => {
    if (String(record.key).startsWith('new_')) {
      setLocalData([]);
    } else {
      await deleteDonvi(record.id);
      fetchDonvi();
    }
  };

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
        fetchDonvi();
      }
    });
  };

  //====================== Actions SAVE =========================
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const record = dataSource.find((x) => x.key === key);
      const payload = {
        id: record.id || 0,
        tenPhong: row.tenPhong,
        tinhTrang: row.tinhTrang
      };

      if (String(key).startsWith('new_')) {
        await createDonvi(payload);
        message.success('Thêm mới thành công');
      } else {
        await updateDonvi(payload);
        message.success('Cập nhật thành công');
      }
      fetchDonvi();
      setEditingKey('');
      setLocalData([]);
    } catch {
      message.error('Lỗi lưu dữ liệu');
    }
  };

  //=====================  Actions CANCEL ==========================
  const cancel = () => {
    setLocalData([]);
    setEditingKey('');
  };

  // ================= SEARCH =================
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;
    return dataSource.filter((item) => Object.values(item).join(' ').toLowerCase().includes(searchText.toLowerCase()));
  }, [dataSource, searchText]);

  /* ================= Columns ================= */
  const columns = [
    { title: 'Đơn vị', dataIndex: 'tenPhong', editable: true },
    {
      title: 'Tình trạng',
      dataIndex: 'tinhTrang',
      editable: true,
      inputType: 'boolean',
      render: (v) => <Tag color={v ? 'green' : 'red'}>{v ? 'Hoạt  động' : 'Ngừng hoạt động'}</Tag>
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
            editing: isEditing(record)
          })
        }
      : col
  );
  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    // Map dữ liệu theo cột và tiêu đề tiếng Việt
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Đơn vị': item.tenPhong,
      'Tình trạng': item.tinhTrang ? 'Hoạt động' : 'Ngừng hoạt động'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Đơn vị', 'Tình trạng']
    });

    // Set độ rộng cột
    worksheet['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 25 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danhmucdonvi');
    XLSX.writeFile(workbook, 'Danh_muc_don-vi.xlsx');
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
          pagination={{ pageSize: 10 }}
          rowKey={(record) => record.id ?? record.key}
        />
      </Form>
    </MainCard>
  );
};

export default Danhmucdonvi;
