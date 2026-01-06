import { Form, Select, Input } from 'antd';
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

const ThongsoForm = ({ form, onSubmit, selectDataList, selectLable, selectName }) => {
  return (
    <Form form={form} onFinish={onSubmit} {...formItemLayout} initialValues={{ remember: true }}>
      <Form.Item label={selectLable} name={selectName} rules={[{ required: true, message: 'Thiết bị phải chọn' }]}>
        <Select placeholder="Chọn thiết bị">
          {selectDataList.map((m) => (
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
  );
};

export default ThongsoForm;
