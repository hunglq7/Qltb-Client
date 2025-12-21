import React from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { Select, Input, Form, DatePicker, Flex, Space, Button } from 'antd';
const { TextArea } = Input;
function MaycaoForm({ handleSubmit, form, mayCaoList = [], donViList = [], onCancel }) {
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
      <Form.Item name="chieuDaiMay" label="Chiều dài máy" rules={[{ required: true, message: 'Không được để trống' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="soLuongCauMang" label="SL cầu máng" rules={[{ required: true, message: 'Không được để trống' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="soLuongxich" label="SL xích" rules={[{ required: true, message: 'Không được để trống' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="tinhTrangThietBi" label="Tình trạng TB" rules={[{ required: true, message: 'Không được để trống' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="soLuong" label="Số lượng" rules={[{ required: true, message: 'Không được để trống' }]}>
        <Input />
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

export default MaycaoForm;
