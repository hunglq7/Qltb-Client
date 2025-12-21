import { Select, Input, Form, Space, Button, Flex } from 'antd';
import { DeleteOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
function ThongSoMayCaoForm({ form, mayCaoList, handleSubmit, onCancel }) {
  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item name="mayCaoId" label="Máy cào" rules={[{ required: true, message: 'Vui lòng chọn máy cào' }]}>
        <Select placeholder="Chọn máy cào">
          {mayCaoList.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.tenThietBi}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="noiDung" label="Nội dung" rules={[{ required: true, message: 'Không được để trống' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="donViTinh" label="Đơn vị tính" rules={[{ required: true, message: 'Không được để trống' }]}>
        <Input />
      </Form.Item>

      <Form.Item name="thongSo" label="Thông số" rules={[{ required: true, message: 'Không được để trống' }]}>
        <Input />
      </Form.Item>
      {/* Nút Lưu / Hủy */}
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

export default ThongSoMayCaoForm;
