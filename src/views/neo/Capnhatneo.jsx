import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row, Modal, InputNumber, Select, DatePicker, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useTonghopneoStore } from '../../stores/neo/tonghopneoStors';
import { useDonviStore } from '../../stores/donvi/donviStore';
import { useDanhmucneoStore } from '../../stores/neo/danhmucneoStore';
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
    inputNode = <Select style={{ width: '100%' }} options={options} placeholder="Chọn danh mục" showSearch optionLabelProp="label" />;

  // ✅ CHỈ BẮT BUỘC CÁC FIELD QUAN TRỌNG
  const requiredFields = ['donViId', 'neoId'];
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
const Capnhatneo = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [localData, setLocalData] = useState([]);
  const { dataDonvi, fetchDonvi } = useDonviStore();
  const { dataDanhmucneo, fetchDanhmucneo } = useDanhmucneoStore();
  const { dataTonghopneo, loading, fetchTonghopneo, createTonghopneo, updateTonghopneo, deleteTonghopneo, deleteTonghopneos } =
    useTonghopneoStore();
  // ================= LOAD DATA =================
  useEffect(() => {
    fetchTonghopneo();
    fetchDonvi();
    fetchDanhmucneo();
  }, []);

  /* ================= Data ================= */
  const dataSource = useMemo(() => {
    const apiData = dataTonghopneo.map((item, index) => ({
      ...item,
      key: `api_${index}`
    }));
    return [...localData, ...apiData];
  }, [dataTonghopneo, localData]);

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
      dataDanhmucneo?.map((dv) => ({
        label: dv.tenThietBi,
        value: Number(dv.id) // 🔥 CỰC KỲ QUAN TRỌNG
      })) || []
    );
  }, [dataDanhmucneo]);

  //=======================ADD===================================
  const handleOpenAdd = () => {
    if (editingKey) return message.warning('Hoàn thành dòng đang sửa');
    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      donViId: null,
      neoId: null,
      donViTinh: '',
      viTriLapDat: '',
      soLuong: 0,
      ngayLap: dayjs(new Date()),
      tinhTrangKyThuat: '',
      loaiThietBi: '',
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
      await deleteTonghopneo(record.id);
      fetchTonghopneo();
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
          // Lấy các record được chọn
          const selectedRecords = dataSource.filter((record) => selectedRowKeys.includes(record.key));
          // Chỉ lấy ID của bản ghi không phải new_ (đã lưu)
          const validIds = selectedRecords.filter((record) => !String(record.key).startsWith('new_')).map((record) => record.id);
          if (!validIds.length) {
            message.warning('Không có bản ghi hợp lệ');
            return;
          }
          await deleteTonghopneos(validIds);
          setSelectedRowKeys([]);
          fetchTonghopneo();
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
        id: record.id || 0,
        donViId: Number(row.donViId),
        neoId: Number(row.neoId),
        donViTinh: row.donViTinh,
        viTriLapDat: row.viTriLapDat,
        soLuong: Number(row.soLuong),
        tinhTrangKyThuat: row.tinhTrangKyThuat,
        ngayLap: row.ngayLap ? dayjs(row.ngayLap).format('YYYY-MM-DD') : null,
        duPhong: row.duPhong || true,
        ghiChu: row.ghiChu
      };

      if (String(key).startsWith('new_')) {
        await createTonghopneo(payload);
      } else {
        await updateTonghopneo(payload);
      }
      fetchTonghopneo();
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
      render: (_, record) => record.tenDonVi || record.TenDonVi || ''
    },
    {
      title: 'Thiết bị',
      dataIndex: 'neoId',
      editable: true,
      inputType: 'select',
      options: danhmucOptions,
      render: (_, record) => record.tenThietBi || record.TenThietBi || ''
    },
    { title: 'Đơn vị tính', dataIndex: 'donViTinh', editable: true, render: (value) => value || '' },
    { title: 'Vị trí lắp đặt', dataIndex: 'viTriLapDat', editable: true, render: (value) => value || '' },
    { title: 'Tình trạng kỹ thuật', dataIndex: 'tinhTrangKyThuat', editable: true, render: (value) => value || '' },
    { title: 'Số lượng', dataIndex: 'soLuong', editable: true, inputType: 'number', render: (value) => (isNaN(value) ? 0 : value) },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'ngayLap',
      editable: true,
      inputType: 'date',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '')
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
    //   {
    //   title: 'Dự phòng',
    //   dataIndex: 'duPhong',
    //   key: 'duPhong',
    //   render: (value) => <Tag color={value ? 'green' : 'red'}>{value ? 'Đang dùng' : 'Dự phòng'}</Tag>
    // },
    { title: 'Ghi chú', dataIndex: 'ghiChu', editable: true, render: (value) => value || '' },
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
    // Map dữ liệu theo cột và tiêu đề tiếng Việt
    const exportData = filteredData.map((item, index) => ({
      STT: index + 1,
      'Đơn vị': item.tenDonVi || item.TenDonVi || '',
      'Thiết bị': dataDanhmuckhoanbalang?.find((d) => d.khoanBalangId === item.khoanBalangId)?.tenThietBi || '',
      'Vị trí lắp đặt': item.viTriLapDat || '',
      'Ngày lắp đặt': item.ngayLap ? dayjs(item.ngayLap).format('DD/MM/YYYY') : '',
      'Tình trạng kỹ thuật': item.tinhTrangKyThuat || '',
      'Đơn vị tính': item.donViTinh || '',
      'Số lượng': item.soLuong || 0,
      'Ghi chú': item.ghiChu || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Đơn vị', 'Thiết bị', 'Vị trí lắp đặt', 'Ngày lắp đặt', 'Tình trạng kỹ thuật', 'Loại thiết bị', 'Số lượng', 'Ghi chú']
    });

    // Set độ rộng cột
    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 10 },
      { wch: 10 },
      { wch: 20 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Capnhatneo');
    XLSX.writeFile(workbook, 'Cap-nhat-neo-bom-phun-be-tong.xlsx');
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
          rowKey="key"
        />
      </Form>
    </MainCard>
  );
};
export default Capnhatneo;
