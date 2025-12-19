import { Button, Col, Popconfirm } from 'antd';

import { PlusOutlined, DownloadOutlined, DeleteFilled } from '@ant-design/icons';

export default function ActionBar({ handleOpenAdd, onDeleteMultiple, selectedRowKeys = [], handleExportExcel }) {
  return (
    <>
      <Col>
        <Button icon={<PlusOutlined />} type="primary" onClick={handleOpenAdd}>
          Thêm mới
        </Button>
      </Col>

      <Col>
        <Popconfirm
          title={`Bạn có chắc muốn xóa ${selectedRowKeys.length} bản ghi đã chọn?`}
          onConfirm={onDeleteMultiple}
          okText="Có"
          cancelText="Không"
          disabled={selectedRowKeys.length === 0}
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
    </>
  );
}
