import { Button, Input, Row, Col, Popconfirm } from 'antd';
import { PlusOutlined, DownloadOutlined, DeleteFilled } from '@ant-design/icons';
function MaycaoToolbar({ onSearch, handleOpenAdd, handleDeleteMultiple, handleExportExcel, selectedRowKeys }) {
  return (
    <>
      <Row gutter={8} style={{ marginBottom: 12 }}>
        <Col flex="auto">
          <Input placeholder="Tìm kiếm..." allowClear onChange={(e) => onSearch(e.target.value)} />
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenAdd}>
            Thêm mới
          </Button>
        </Col>
        <Col>
          <Popconfirm
            title={`Bạn có chắc muốn xóa ${selectedRowKeys.length} bản ghi đã chọn?`}
            onConfirm={handleDeleteMultiple}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteFilled />} disabled={selectedRowKeys.length === 0}>
              Xóa đã chọn
            </Button>
          </Popconfirm>
        </Col>
        <Col>
          <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
            Xuất Excel
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default MaycaoToolbar;
