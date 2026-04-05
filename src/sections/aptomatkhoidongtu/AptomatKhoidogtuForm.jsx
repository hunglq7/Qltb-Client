import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Select, Input, Form, DatePicker, Space, Button, Switch, Row, Col } from 'antd';
import { memo, useRef, useEffect } from 'react';
const { TextArea } = Input;

const AptomatKhoidogtuForm = ({ handleSubmit, form, aptomatkhoidongtuList = [], donViList = [], onCancel, open, editingRecord }) => {
  const selectRef = useRef(null);

  useEffect(() => {
    if (open && !editingRecord && selectRef.current) {
      selectRef.current.focus();
    }
  }, [open, editingRecord]);

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
      <div style={{ padding: '2.4rem 0' }}>
        <Row>
          <Col xs={24} sm={12}>
            <Form.Item name="aptomatKhoidongtuId" label="Thiết bị" rules={[{ required: true, message: 'Vui lòng chọn thiết bị' }]}>
              <Select placeholder="Chọn thiết bị" ref={selectRef}>
                {aptomatkhoidongtuList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.tenThietBi}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="donViId" label="Đơn vị" rules={[{ required: true, message: 'Vui lòng chọn đơn vị' }]}>
              <Select placeholder="Chọn đơn vị">
                {donViList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.tenPhong}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={24} sm={12}>
            <Form.Item name="ngayKiemDinh" label="Kiểm định " rules={[{ required: true, message: 'Vui lòng chọn ngày kiểm định' }]}>
              <DatePicker style={{ width: '100%' }} format="YYYY" placeholder="Chọn năm" picker="year" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="namSanXuat" label="Năm sản xuất" rules={[{ required: true, message: 'Không được để trống' }]}>
              <DatePicker style={{ width: '100%' }} format="YYYY" placeholder="Chọn năm" picker="year" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={12}>
            <Form.Item name="dienApSuDung" label="Điện áp sử dụng">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="idm" label="I (đm)">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={24} sm={12}>
            <Form.Item name="dienApDieuKhien" label="Điện áp điều khiển">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="cheDoLamViec" label="Chế độ làm việc">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={12}>
            <Form.Item name="thongGio" label="Thông gió">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="bitCoCap" label="Bịt có cáp">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={12}>
            <Form.Item name="capPhongNo" label="Cấp phòng nổ">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="tinhTrangThietBi" label="Tình trạng thiết bị">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={12}>
            <Form.Item name="kheHoPhongNo" label="Khe hở phòng nổ " valuePropName="checked">
              <Switch checkedChildren="Đạt" unCheckedChildren="Không đạt" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="napMoNhanh" label="Nap mở nhanh " valuePropName="checked">
              <Switch checkedChildren="Đạt" unCheckedChildren="Không đạt" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={12}>
            <Form.Item name="tayDao" label="Tay dao" valuePropName="checked">
              <Switch checkedChildren="Đạt" unCheckedChildren="Không đạt" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="noiDat" label="Nối đất(<2 ôm)" valuePropName="checked">
              <Switch checkedChildren="Đạt" unCheckedChildren="Không đạt" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={24} sm={12}></Col>
          <Col xs={24} sm={12}></Col>
        </Row>
        <Form.Item name="viTriLapDat" label="Vị trí lắp đặt" rules={[{ required: true, message: 'Không được để trống' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="duPhong" label="Tình trạng" valuePropName="checked">
          <Switch checkedChildren="Đang dùng" unCheckedChildren="Dự phòng" />
        </Form.Item>
        <Form.Item name="ghiChu" label="Ghi chú">
          <Input />
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
              icon={<CloseOutlined />}
              danger
            >
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </div>
    </Form>
  );
};

export default AptomatKhoidogtuForm;
