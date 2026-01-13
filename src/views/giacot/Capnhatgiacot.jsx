import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row, Modal, InputNumber, Select, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useCapnhatgiacotStore } from '../../stores/giacot/capnhatgiacotStore';
import { useDonviStore } from '../../stores/donvi/donviStore';
import { useDanhmucgiacotStore } from '../../stores/giacot/danhmucgiacotStore';
import MainCard from '/src/components/MainCard';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
// ================= EDIT ABLECELL =================

const EditableCell = ({ editing, dataIndex, inputType, options = [], children, ...restProps }) => {
  let inputNode = <Input />;

  if (inputType === 'number') inputNode = <InputNumber style={{ width: '200' }} />;
  if (inputType === 'date') inputNode = <DatePicker style={{ width: '100%' }} />;
  if (inputType === 'select')
    inputNode = <Select style={{ width: '100%' }} options={options} placeholder="Chọn đơn vị" showSearch optionLabelProp="label" />;

  // ✅ CHỈ BẮT BUỘC CÁC FIELD QUAN TRỌNG
  const requiredFields = ['donViId', 'loaiThietBiId'];
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={requiredFields.includes(dataIndex) ? [{ required: true, message: 'Không được bỏ trống' }] : []}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const Capnhatgiacot = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [localData, setLocalData] = useState([]);
  const { dataDonvi, fetchDonvi } = useDonviStore();
  const { dataDanhmucgiacot, fetchDanhmucgiacot } = useDanhmucgiacotStore();
  const {
    dataCapnhatgiacot,
    loading,
    fetchCapnhatgiacot,
    createCapnhatgiacot,
    updateCapnhatgiacot,
    deleteCapnhatgiacot,
    deleteMultipleCapnhatgiacot
  } = useCapnhatgiacotStore();

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchDonvi();
    fetchDanhmucgiacot();
    fetchCapnhatgiacot();
  }, []);

  /* ================= Data ================= */
  const dataSource = useMemo(() => {
    return [
      ...localData,
      ...dataCapnhatgiacot.map((item) => ({
        ...item,
        key: item.capNhatId
      }))
    ];
  }, [dataCapnhatgiacot, localData]);

  const donViOptions = useMemo(() => {
    return (
      dataDonvi?.map((dv) => ({
        label: dv.tenPhong,
        value: Number(dv.id) // 🔥 CỰC KỲ QUAN TRỌNG
      })) || []
    );
  }, [dataDonvi]);

  const danhmucOptions = useMemo(() => {
    return (
      dataDanhmucgiacot?.map((dv) => ({
        label: dv.tenLoai,
        value: Number(dv.loaiThietBiId) // 🔥 CỰC KỲ QUAN TRỌNG
      })) || []
    );
  }, [dataDanhmucgiacot]);

  //=======================ADD===================================
  const handleOpenAdd = () => {
    if (editingKey) return message.warning('Hoàn thành dòng đang sửa');
    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      donViId: null,
      loaiThietBiId: null,
      soLuongDangQuanLy: 0,
      soLuongHuyDong: 0,
      soLuongHong: 0,
      soLuongDuPhong: 0,
      ngayCapNhat: dayjs(new Date()),
      ghiChu: ''
    };
    setLocalData([newRow]);
    form.setFieldsValue(newRow);
    setEditingKey(key);
  };

  // ================= EDIT =================
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      ngayCapNhat: record.ngayCapNhat ? dayjs(record.ngayCapNhat) : null
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
      await deleteCapnhatgiacot(record.capNhatId);
      fetchCapnhatgiacot();
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
          await deleteMultipleCapnhatgiacot(validIds);
          setSelectedRowKeys([]);
          fetchCapnhatgiacot();
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
        capNhatId: record.capNhatId || 0,
        donViId: Number(row.donViId),
        loaiThietBiId: Number(row.loaiThietBiId),
        viTriSuDung: row.viTriSuDung,
        soLuongDangQuanLy: row.soLuongDangQuanLy,
        soLuongHuyDong: row.soLuongHuyDong,
        soLuongHong: row.soLuongHong,
        soLuongDuPhong: row.soLuongDuPhong,
        ngayCapNhat: row.ngayCapNhat ? dayjs(row.ngayCapNhat).format('YYYY-MM-DD') : null,
        ghiChu: row.ghiChu
      };

      if (String(key).startsWith('new_')) {
        await createCapnhatgiacot(payload);
        message.success('Thêm mới thành công');
      } else {
        await updateCapnhatgiacot(payload);
        message.success('Cập nhật thành công');
      }

      fetchCapnhatgiacot();
      setEditingKey('');
      setLocalData([]);
    } catch (error) {
      console.error(error);
      message.error('Lỗi lưu dữ liệu');
    }
  };
  // ================= SEARCH =================
  const filteredData = useMemo(() => {
    if (!searchText) return dataSource;

    return dataSource.filter((item) =>
      Object.values(item)
        .filter((v) => v !== null && v !== undefined)
        .join(' ')
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [dataSource, searchText]);

  /* ================= Columns ================= */
  const columns = [
    {
      title: 'Đơn vị',
      dataIndex: 'donViId',
      editable: true,
      inputType: 'select',
      options: donViOptions,
      render: (_, record) => record.tenDonVi || record.TenDonVi
    },
    {
      title: 'Thiết bị',
      dataIndex: 'loaiThietBiId',
      editable: true,
      inputType: 'select',
      options: danhmucOptions,
      render: (value) => dataDanhmucgiacot?.find((d) => d.loaiThietBiId === value)?.tenLoai || ''
    },
    { title: 'Vị trí sử dụng', dataIndex: 'viTriSuDung', editable: true },
    { title: 'SL quản lý', dataIndex: 'soLuongDangQuanLy', editable: true, inputType: 'number' },
    { title: 'SL huy động', dataIndex: 'soLuongHuyDong', editable: true, inputType: 'number' },
    { title: 'SL hỏng', dataIndex: 'soLuongHong', editable: true, inputType: 'number' },
    { title: 'SL dự phòng', dataIndex: 'soLuongDuPhong', editable: true, inputType: 'number' },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'ngayCapNhat',
      editable: true,
      inputType: 'date',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '')
    },
    { title: 'Ghi chú', dataIndex: 'ghiChu ', editable: true },
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
            options: col.options,
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
          pagination={{ pageSize: 6 }}
          rowKey={(record) => record.id ?? record.key}
        />
      </Form>
    </MainCard>
  );
};

export default Capnhatgiacot;
