import React from 'react';
import { Modal, Select, Input, Form, DatePicker } from 'antd';
function MaycaoModel({ open, onCancel, onSubmit, form, editingRecord, mayCaoList, donViList }) {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 }
    }
  };

  return (
    <Modal
      title={editingRecord ? 'Cập nhật thông số' : 'Thêm mới thông số'}
      open={open}
      onOk={onSubmit}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
      zIndex={1500}
      closable={true}
    >
      <Form form={form} onFinish={onSubmit} {...formItemLayout} initialValues={{ remember: true }}>
        <Form.Item name="mayCaoId" label="Máy cào" rules={[{ required: true, message: 'Vui lòng chọn máy cào' }]}>
          <Select placeholder="Chọn máy cào">
            {mayCaoList.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.tenThietBi}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="donViId" label="Đơn vị" rules={[{ required: true, message: 'Vui lòng chọn đơn vị' }]}>
          <Select placeholder="Chọn đơn vị">
            {donViList.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.tenPhong}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="ngayLap" label="Ngày lắp " rules={[{ required: true, message: 'Vui lòng chọn ngày lắp đặt' }]}>
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày" />
        </Form.Item>
        <Form.Item name="viTriLapDat" label="Vị trí lắp đặt" rules={[{ required: true, message: 'Không được để trống' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="tinhTrangThietBi" label="Tình trạng TB" rules={[{ required: true, message: 'Không được để trống' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="soLuong" label="Số lượng" rules={[{ required: true, message: 'Không được để trống' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MaycaoModel;
