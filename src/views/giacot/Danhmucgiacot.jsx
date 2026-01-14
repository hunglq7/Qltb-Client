import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row, Modal, InputNumber } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useDanhmucgiacotStore } from '../../stores/giacot/danhmucgiacotStore';
import MainCard from '/src/components/MainCard';
import * as XLSX from 'xlsx';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
// ================= EDIT ABLECELL =================

const EditableCell = ({ editing, dataIndex, inputType, children, ...restProps }) => {
  let inputNode = <Input />;

  if (inputType === 'boolean') inputNode = <Switch />;
  if (inputType === 'year') inputNode = <DatePicker picker="year" />;
  if (inputType === 'number') inputNode = <InputNumber />;

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
const Danhmucgiacot = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [localData, setLocalData] = useState([]);
  const {
    dataDanhmucgiacot,
    loading,
    fetchDanhmucgiacot,
    createDanhmucgiacot,
    updateDanhmucgiacot,
    deleteDanhmucgiacot,
    deleteMultipleDanhmucgiacot
  } = useDanhmucgiacotStore();

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchDanhmucgiacot();
  }, []);
  /* ================= Data ================= */
  const dataSource = useMemo(() => {
    return [
      ...localData,
      ...dataDanhmucgiacot.map((item) => ({
        ...item,
        key: item.loaiThietBiId
      }))
    ];
  }, [dataDanhmucgiacot, localData]);

  //=======================ADD===================================
  const handleOpenAdd = () => {
    if (editingKey) return message.warning('Hoàn thành dòng đang sửa');
    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      maLoai: '',
      tenLoai: '',
      moTa: ''
    };
    setLocalData([newRow]);
    form.setFieldsValue(newRow);
    setEditingKey(key);
  };

  // ================= EDIT =================
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      maLoai: record.maLoai,
      tenLoai: record.tenLoai,
      moTa: record.moTa
    });
    setEditingKey(record.key);
  };
  // ================= CANCEL =================

  const cancel = () => {
    setLocalData([]);
    setEditingKey('');
  };

  //======================DELETE==================================
  const handleDelete = async (record) => {
    if (String(record.key).startsWith('new_')) {
      setLocalData([]);
    } else {
      await deleteDanhmucgiacot(record.loaiThietBiId);
      fetchDanhmucgiacot();
    }
  };

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
          await deleteMultipleDanhmucgiacot(validIds);
          setSelectedRowKeys([]);
          fetchDanhmucgiacot();
        } catch (error) {
          message.error('Xóa nhiều thất bại');
        }
      }
    });
  };
  //====================== Actions SAVE =========================
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const record = dataSource.find((x) => x.key === key);
      const payload = {
        loaiThietBiId: record.loaiThietBiId || 0,
        maLoai: row.maLoai,
        tenLoai: row.tenLoai,
        moTa: row.moTa
      };

      if (String(key).startsWith('new_')) {
        await createDanhmucgiacot(payload);
        message.success('Thêm mới thành công');
      } else {
        await updateDanhmucgiacot(payload);
        message.success('Cập nhật thành công');
      }
      fetchDanhmucgiacot();
      setEditingKey('');
      setLocalData([]);
    } catch {
      message.error('Lỗi lưu dữ liệu');
    }
  };

  // ====================== Tìm kiếm ==========================
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;
    const keyword = searchText.toLowerCase();
    return dataSource.filter((item) =>
      [item.maLoai, item.tenLoai, item.chieuCao, item.moTa].filter(Boolean).some((val) => String(val).toLowerCase().includes(keyword))
    );
  }, [dataSource, searchText]);

  /* ================= Columns ================= */
  const columns = [
    { title: 'Mã thiết bị', dataIndex: 'maLoai', editable: true },
    { title: 'Tên thiết bị', dataIndex: 'tenLoai', editable: true },
    { title: 'Mô tả', dataIndex: 'moTa', editable: true },
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
      'Tên thiết bị': item.tenThietBi,
      'Loại thiết bị': item.loaiThietBi
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Tên thiết bị', 'Loại thiết bị']
    });

    // Set độ rộng cột
    worksheet['!cols'] = [{ wch: 5 }, { wch: 25 }, { wch: 25 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danhmucquatgio');
    XLSX.writeFile(workbook, 'Danh_muc_quat-gio.xlsx');
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

export default Danhmucgiacot;
