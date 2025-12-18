import { Modal, Select, Input, Form } from 'antd';

function ThongSoMayCaoModal({ open, onCancel, onSubmit, form, editingRecord, mayCaoList }) {
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
      <Form form={form} layout="vertical">
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
      </Form>
    </Modal>
  );
}

export default ThongSoMayCaoModal;
