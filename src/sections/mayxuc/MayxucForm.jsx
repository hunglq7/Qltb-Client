import React from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { Select, Input, Form, DatePicker, Flex, Space, Button, InputNumber, Switch } from 'antd';
const { TextArea } = Input;

function MayxucForm({ handleSubmit, form, mayXucList = [], donViList = [], onCancel, loaiThietBiList = [] }) {
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
      <Form.Item name="maQuanLy" label="Mã quản lý" rules={[{ required: true, message: 'Không được để trống' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="mayXucId" label="Máy xúc" rules={[{ required: true, message: 'Vui lòng chọn máy xúc' }]}>
        <Select placeholder="Chọn máy xúc">
          {mayXucList.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.tenThietBi}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="loaiThietBi" label="Loại thiết bị" rules={[{ required: true, message: 'Không được để trống' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="phongBanId" label="Đơn vị" rules={[{ required: true, message: 'Vui lòng chọn đơn vị' }]}>
        <Select placeholder="Chọn đơn vị">
          {donViList.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.tenPhong}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="loaiThietBiId" label="Loại thiết bị" rules={[{ required: true, message: 'Vui lòng chọn loại thiết bị' }]}>
        <Select placeholder="Chọn loại thiết bị">
          {loaiThietBiList.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.tenLoai}
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

      <Form.Item name="tinhTrang" label="Tình trạng thiết bị" rules={[{ required: true, message: 'Không được để trống' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="soLuong" label="Số lượng" rules={[{ required: true, message: 'Không được để trống' }]}>
        <InputNumber min={1} max={10} defaultValue={1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="duPhong" label="Dự phòng" rules={[{ required: true, message: 'Không được để trống' }]}>
        <Switch />
      </Form.Item>
      <Form.Item name="ghiChu" label="Ghi chú">
        <TextArea />
      </Form.Item>
      <Form.Item>
        <Flex justify="start">
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
        </Flex>
      </Form.Item>
    </Form>
  );
}

export default MayxucForm;
