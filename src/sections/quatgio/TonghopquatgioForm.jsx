import React from 'react';
import { memo } from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { Select, Input, Form, DatePicker, Space, Button, Switch } from 'antd';
const { TextArea } = Input;
const TonghopquatgioForm = ({ handleSubmit, form, quatGioList = [], donViList = [], onCancel }) => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 }
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} {...formItemLayout} initialValues={{ remember: true }}>
      <Form.Item name="maQuanLy" label="Mã quản lý">
        <Input />
      </Form.Item>
      <Form.Item name="quatGioId" label="Thiết bị" rules={[{ required: true, message: 'Vui lòng chọn thiết bị' }]}>
        <Select placeholder="Chọn tời điện">
          {quatGioList.map((item) => (
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
      <Form.Item name="soLuong" label="Số lượng" rules={[{ required: true, message: 'Không được để trống' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="tinhTrangThietBi" label="Tình trạng thiết bị">
        <Input />
      </Form.Item>
      <Form.Item name="duPhong" label="Tình trạng">
        <Switch checkedChildren="Đang dùng" unCheckedChildren="Dự phòng" />
      </Form.Item>

      <Form.Item name="ghiChu" label="Ghi chú">
        <TextArea />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 6 }}>
        <Space>
          <Button
            type="primary"
            htmlType="submit" // 👈 gọi handleSubmit
            icon={<SaveOutlined />}
          >
            Lưu
          </Button>

          <Button
            onClick={() => {
              form.resetFields(); // optional
              onCancel?.(); // 👈 đóng form
            }}
          >
            Hủy
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default memo(TonghopquatgioForm);
