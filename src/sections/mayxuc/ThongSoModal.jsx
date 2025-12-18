import { useEffect } from 'react';
import { Modal, Form, Select, Input } from 'antd';
function ThongSoModal({ open, onCancel, onSubmit, initialValues, mayXucList }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      form.setFieldsValue(initialValues || {});
    }
  }, [open, initialValues]);
  return (
    <Modal open={open} title={initialValues?.id ? 'Cập nhật' : 'Thêm mới'} onCancel={onCancel} onOk={() => form.submit()}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item label="Máy xúc" name="mayXucId" rules={[{ required: true, message: 'Không được để trống' }]}>
          <Select placeholder="Chọn máy xúc">
            {mayXucList.map((m) => (
              <Select.Option key={m.id} value={m.id}>
                {m.tenThietBi}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Nội dung" name="noiDung" rules={[{ required: true, message: 'Không được để trống' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Đơn vị tính" name="donViTinh" rules={[{ required: true, message: 'Không được để trống' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Thông số" name="thongSo" rules={[{ required: true, message: 'Không được để trống' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ThongSoModal;
