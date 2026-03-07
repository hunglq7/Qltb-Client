import React, { useEffect, useState, useMemo } from 'react';
import { Table, Form, Input, Button, Space, Popconfirm, message, Row, Modal, InputNumber, Select, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useTonghopKhoanBalangStore } from '../../stores/khoanbalang/TonghopKhoanBalangStore';
import { useDonviStore } from '../../stores/donvi/donviStore';
import { useDanhmuckhoanbalangStore } from '../../stores/khoanbalang/danhmuckhoanbalangStore';
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
  const requiredFields = ['donViId', 'khoanBalangId'];
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
const Capnhatkhoanbalang = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [localData, setLocalData] = useState([]);
  const { dataDonvi, fetchDonvi } = useDonviStore();
  const { dataDanhmuckhoanbalang, fetchDanhmuckhoanbalang } = useDanhmuckhoanbalangStore();
  const {
    dataTonghopKhoanBalang,
    loading,
    fetchTonghopKhoanBalang,
    createTonghopKhoanBalang,
    updateTonghopKhoanBalang,
    deleteTonghopKhoanBalang,
    deleteTonghopKhoanBalangs
  } = useTonghopKhoanBalangStore();

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchDonvi();
    fetchDanhmuckhoanbalang();
    fetchTonghopKhoanBalang();
  }, []);

  /* ================= Data ================= */
  const dataSource = useMemo(() => {
    const apiData = dataTonghopKhoanBalang.map((item, index) => ({
      ...item,
      key: `api_${index}`
    }));
    return [...localData, ...apiData];
  }, [dataTonghopKhoanBalang, localData]);

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
      dataDanhmuckhoanbalang?.map((dv) => ({
        label: dv.tenThietBi,
        value: Number(dv.id) // 🔥 CỰC KỲ QUAN TRỌNG
      })) || []
    );
  }, [dataDanhmuckhoanbalang]);
  //=======================ADD===================================
  const handleOpenAdd = () => {
    if (editingKey) return message.warning('Hoàn thành dòng đang sửa');
    const key = `new_${Date.now()}`;
    const newRow = {
      key,
      donViId: null,
      khoanBalangId: null,
      viTriLapDat: '',
      soLuong: 0,
      ngayLap: dayjs(new Date()),
      tinhTrangKyThuat: '',
      loaiThietBi: '',
      duPhong: false,
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
      await deleteTonghopKhoanBalang(record.id);
      fetchTonghopKhoanBalang();
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
          await deleteTonghopKhoanBalangs(validIds);
          setSelectedRowKeys([]);
          fetchTonghopKhoanBalang();
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
        khoanBalangId: Number(row.khoanBalangId),
        viTriLapDat: row.viTriLapDat,
        soLuong: Number(row.soLuong),
        tinhTrangKyThuat: row.tinhTrangKyThuat,
        ngayLap: row.ngayLap ? dayjs(row.ngayLap).format('YYYY-MM-DD') : null,
        loaiThietBi: row.loaiThietBi,
        duPhong: row.duPhong || false,
        ghiChu: row.ghiChu
      };

      if (String(key).startsWith('new_')) {
        await createTonghopKhoanBalang(payload);
      } else {
        await updateTonghopKhoanBalang(payload);
      }

      fetchTonghopKhoanBalang();
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
      dataIndex: 'khoanBalangId',
      editable: true,
      inputType: 'select',
      options: danhmucOptions,
      render: (value) => dataDanhmuckhoanbalang?.find((d) => d.khoanBalangId === value)?.tenThietBi || ''
    },
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
      title: 'Loại thiết bị',
      dataIndex: 'loaiThietBi',
      editable: true,
      inputType: 'select',
      options: [
        { label: 'Khoan', value: 'Khoan' },
        { label: 'Ba lăng', value: 'Ba lăng' }
      ],
      render: (value) => value || ''
    },
    {
      title: 'Dự phòng',
      dataIndex: 'duPhong',
      editable: true,
      inputType: 'select',
      options: [
        { label: 'Có', value: true },
        { label: 'Không', value: false }
      ],
      render: (value) => (value ? 'Có' : 'Không')
    },
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
      'Số lượng': item.soLuong || 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData, {
      header: ['STT', 'Đơn vị', 'Thiết bị', 'Vị trí lắp đặt', 'Ngày lắp đặt', 'Số lượng']
    });

    // Set độ rộng cột
    worksheet['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 10 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CapnhatKhoanBaLang');
    XLSX.writeFile(workbook, 'Cap-nhat-khoan-ba-lang.xlsx');
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

export default Capnhatkhoanbalang;
