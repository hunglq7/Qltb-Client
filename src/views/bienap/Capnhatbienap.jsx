import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row, Modal, InputNumber, Select, DatePicker, Checkbox, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useTonghopbienapStore } from '/src/stores/bienap/tonghopbienapStore';
import { useDonviStore } from '/src/stores/donvi/donviStore'; // Assuming this store exists
import { useDanhmucBienapStore } from '/src/stores/bienap/bienapStore';
import MainCard from '/src/components/MainCard';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import SearchBar from '/src/components/SearchBar';
import ActionBar from '/src/components/ActionBar';
// ================= EDITABLE CELL =================
const EditableCell = ({ editing, dataIndex, inputType, options = [], children, ...restProps }) => {
  let inputNode = <Input />;

  if (inputType === 'number') inputNode = <InputNumber style={{ width: 64 }} />;
  if (inputType === 'date') inputNode = <DatePicker style={{ width: '100%' }} showTime />;
  if (inputType === 'select')
    inputNode = <Select style={{ width: 128 }} options={options} placeholder="Chọn" showSearch optionLabelProp="label" />;
  if (inputType === 'boolean')
    inputNode = (
      <Select
        style={{ width: '100%' }}
        options={[
          { label: 'Có', value: true },
          { label: 'Không', value: false }
        ]}
      />
    );

  // Required fields
  const requiredFields = ['bienapId', 'phongbanId', 'ngayLap'];
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

const Capnhatbienap = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [localData, setLocalData] = useState([]);
  const { dataDonvi, fetchDonvi } = useDonviStore();
  const { dataDanhmucBienap, fetchDanhmucBienap } = useDanhmucBienapStore();
  const {
    dataTonghopbienap,
    loading,
    fetchTonghopbienap,
    updateTonghopbienap,
    createTonghopbienap,
    deleteTonghopbienap,
    deleteMultipleTonghopbienap
  } = useTonghopbienapStore();
  // ================= LOAD DATA =================
  useEffect(() => {
    fetchDonvi();
    fetchDanhmucBienap();
    fetchTonghopbienap();
  }, []);
  /* ================= Data ================= */
  const dataSource = useMemo(() => {
    const baseData = dataTonghopbienap.map((item) => ({
      ...item,
      key: item.id
    }));
    return [...localData, ...baseData];
  }, [dataTonghopbienap, localData]);

  const donviOptions = useMemo(() => {
    return (
      dataDonvi?.map((pb) => ({
        label: pb.tenPhong,
        value: Number(pb.id)
      })) || []
    );
  }, [dataDonvi]);

  const danhmucBienapOptions = useMemo(() => {
    return (
      dataDanhmucBienap?.map((dm) => ({
        label: dm.tenThietBi,
        value: Number(dm.id)
      })) || []
    );
  }, [dataDanhmucBienap]);

  //=======================ADD===================================
  const handleOpenAdd = () => {
    if (editingKey) return message.warning('Hoàn thành dòng đang sửa');
    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      bienapId: null,
      phongbanId: null,
      viTriLapDat: '',
      ngayLap: dayjs(new Date()),
      duPhong: true,
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
      ngayLap: record.ngayLap ? dayjs(record.ngayLap) : null
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
      await deleteTonghopbienap(record.id);
      fetchTonghopbienap(); // Refresh data after deletion
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
          const validIds = selectedRowKeys.filter((id) => typeof id === 'number');
          if (!validIds.length) {
            message.warning('Không có bản ghi hợp lệ');
            return;
          }
          await deleteMultipleTonghopbienap(validIds);
          fetchTonghopbienap();
          setSelectedRowKeys([]);
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
        // Backend dùng Id (viết hoa) cho class TonghopBienap
        Id: record.id || record.Id || 0,
        BienapId: Number(row.bienapId),
        PhongbanId: Number(row.phongbanId),
        ViTriLapDat: row.viTriLapDat || '',
        NgayLap: row.ngayLap ? dayjs(row.ngayLap).format('YYYY-MM-DD') : null,
        DuPhong: !!row.duPhong,
        GhiChu: row.ghiChu || ''
      };

      if (String(key).startsWith('new_')) {
        delete payload.Id; // Xóa Id nếu là thêm mới để DB tự generate
        await createTonghopbienap(payload);
      } else {
        await updateTonghopbienap(payload);
      }
      setEditingKey('');
      setLocalData([]);
      fetchTonghopbienap(); // Load lại dữ liệu để đồng bộ tên thiết bị/phòng ban
    } catch (error) {
      console.error('Save error:', error);
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
      title: 'Tên thiết bị',
      dataIndex: 'bienapId',
      editable: true,
      inputType: 'select',
      options: danhmucBienapOptions,
      render: (value) => dataDanhmucBienap?.find((d) => d.id === value)?.tenThietBi || ''
    },
    {
      title: 'Tên phòng',
      dataIndex: 'phongbanId',
      editable: true,
      inputType: 'select',
      options: donviOptions,
      render: (value) => dataDonvi?.find((p) => p.id === value)?.tenPhong || ''
    },
    { title: 'Vị trí lắp đặt', dataIndex: 'viTriLapDat', editable: true },
    {
      title: 'Ngày lắp',
      dataIndex: 'ngayLap',
      editable: true,
      inputType: 'date',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : null)
    },
    {
      title: 'Dự phòng',
      dataIndex: 'duPhong',
      editable: true,
      inputType: 'select',
      options: [
        { label: 'Đang dùng', value: true },
        { label: 'Dự phòng', value: false }
      ],
      render: (value) => <Tag color={value ? 'green' : 'red'}>{value ? 'Đang dùng' : 'Dự phòng'}</Tag>
    },
    { title: 'Ghi chú', dataIndex: 'ghiChu', editable: true },
    {
      title: 'Hành động',
      render: (_, record) => {
        const editing = isEditing(record);
        return editing ? (
          <Space>
            <Button icon={<SaveOutlined />} type="primary" onClick={() => save(record.key)} />
            <Button danger icon={<CloseOutlined />} onClick={cancel} />
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
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Tên thiết bị': dataDanhmucBienap?.find((d) => d.id === item.bienapId)?.tenThietBi || '',
      'Tên phòng': dataDonvi?.find((p) => p.id === item.phongbanId)?.tenPhong || '',
      'Vị trí lắp đặt': item.viTriLapDat,
      'Ngày lắp': item.ngayLap ? dayjs(item.ngayLap).format('DD/MM/YYYY') : '',
      'Dự phòng': item.duPhong ? 'Có' : 'Không',
      'Ghi chú': item.ghiChu
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Tên thiết bị', 'Tên phòng', 'Vị trí lắp đặt', 'Ngày lắp', 'Số lượng', 'Tình trạng thiết bị', 'Dự phòng', 'Ghi chú']
    });

    worksheet['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 20 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tonghopbienap');
    XLSX.writeFile(workbook, 'Tong-hop-bienap.xlsx');
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
          pagination={{ pageSize: 10 }}
          rowKey={(record) => record.Id || record.id || record.key}
        />
      </Form>
    </MainCard>
  );
};

export default Capnhatbienap;
