import { useEffect } from 'react';
import { Modal, Form, Select, Input } from 'antd';
function ThongSoModal({ open, form, onCancel, onSubmit, initialValues, mayXucList }) {
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

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues || {});
    }
  }, [open, initialValues]);
  return (
    <Modal zIndex={1500} open={open} title={initialValues?.id ? 'Cập nhật' : 'Thêm mới'} onCancel={onCancel} onOk={() => form.submit()}>
      <Form form={form} onFinish={onSubmit} {...formItemLayout} initialValues={{ remember: true }}>
        <Form.Item label="Máy xúc" name="mayXucId" rules={[{ required: true, message: 'Thiết bị phải chọn' }]}>
          <Select placeholder="Chọn máy xúc">
            {mayXucList.map((m) => (
              <Select.Option key={m.id} value={m.id}>
                {m.tenThietBi}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Nội dung" name="noiDung" rules={[{ required: true, message: 'Nội dung không được để trống' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Đơn vị tính" name="donViTinh" rules={[{ required: true, message: 'Đơn vị không được để trống' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Thông số" name="thongSo" rules={[{ required: true, message: 'Thông số không được để trống' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ThongSoModal;
