import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { Select, Input, Form, DatePicker, Space, Button, Switch, Row, Col, Grid } from 'antd';
const { useBreakpoint } = Grid;
const AptomatKhoidogtuForm = ({ handleSubmit, form, aptomatkhoidongtuList = [], donViList = [], onCancel, open, editingRecord }) => {
  const screens = useBreakpoint();
  const formItemLayout = {
    labelCol: { span: 8 }, // độ rộng label (cố định)
    wrapperCol: { span: 16 } // input còn lại
  };
  const danhsachSwitch = [
    { name: 'kheHoPhongNo', label: 'Khe hở phòng nổ' },
    { name: 'napMoNhanh', label: 'Nắp mở nhanh' },
    { name: 'tayDao', label: 'Tay dao' },
    { name: 'noiDat', label: 'Nối đất (<2 ôm)' }
  ];
  return (
    <Form form={form} onFinish={handleSubmit} layout={screens.xs ? 'vertical' : 'horizontal'} {...formItemLayout}>
      <div style={{ padding: '24px 24px' }}>
        {/* ===== Thông tin chung ===== */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="aptomatKhoidongtuId" label="Thiết bị" rules={[{ required: true, message: 'Vui lòng chọn thiết bị' }]}>
              <Select autoFocus={!editingRecord && open} placeholder="Chọn thiết bị">
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

        {/* ===== Ngày ===== */}
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="ngayKiemDinh" label="Kiểm định" rules={[{ required: true, message: 'Vui lòng chọn năm kiểm định' }]}>
              <DatePicker style={{ width: '100%' }} picker="year" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="namSanXuat" label="Năm sản xuất" rules={[{ required: true, message: 'Vui lòng chọn năm sản xuất' }]}>
              <DatePicker style={{ width: '100%' }} picker="year" />
            </Form.Item>
          </Col>
        </Row>

        {/* ===== Thông số ===== */}
        <Row gutter={16}>
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

        <Row gutter={16}>
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

        <Row gutter={16}>
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

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="capPhongNo" label="Cấp phòng nổ">
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item name="tinhTrangThietBi" label="Tình trạng TB">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* ===== Switch (gọn đẹp) ===== */}
        <Form.Item wrapperCol={{ span: 24 }} style={{ marginBottom: 16 }}>
          <Row gutter={16} xs={{ marginBottom: 16 }}>
            {danhsachSwitch.map((item) => (
              <Col xs={24} sm={12} md={6} key={item.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{item.label}</span>
                  <Form.Item
                    name={item.name}
                    valuePropName="checked"
                    noStyle // 👈 QUAN TRỌNG
                  >
                    <Switch checkedChildren="Đạt" unCheckedChildren="Không đạt" style={{ minWidth: 80 }} />
                  </Form.Item>
                </div>
              </Col>
            ))}
          </Row>
        </Form.Item>
        {/* ===== Khác ===== */}
        <Form.Item name="viTriLapDat" label="Vị trí lắp đặt" rules={[{ required: true, message: 'Vui lòng nhập vị trí lắp đặt' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="ghiChu" label="Ghi chú">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="duPhong" label="Tình trạng" valuePropName="checked">
          <Switch checkedChildren="Đang dùng" unCheckedChildren="Dự phòng" />
        </Form.Item>

        {/* ===== Button ===== */}
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Lưu
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  onCancel?.();
                }}
                icon={<CloseOutlined />}
                danger
              >
                Hủy
              </Button>
            </Space>
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default AptomatKhoidogtuForm;
