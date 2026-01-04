import { Input, Col, Select, DatePicker, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
function SearchBar({ onSearch, setFilters, fetchData, filters, pagination }) {
  const { RangePicker } = DatePicker;
  return (
    <Col flex="auto">
      {onSearch && <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm..." allowClear onChange={(e) => onSearch(e.target.value)} />}

      <Space style={{ marginBottom: 16 }}>
        {setFilters && <Input placeholder="Tìm kiếm..." onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} />}

        {setFilters && (
          <Select allowClear placeholder="Trạng thái" style={{ width: 120 }} onChange={(v) => setFilters({ ...filters, duPhong: v })}>
            <Select.Option value={true}>Đang dùng</Select.Option>
            <Select.Option value={false}>Dự phòng</Select.Option>
          </Select>
        )}

        {setFilters && (
          <RangePicker
            format="DD/MM/YYYY"
            onChange={(dates) => {
              setFilters({
                ...filters,
                tuNgay: dates ? dayjs(dates[0]).format('YYYY-MM-DD') : null,
                denNgay: dates ? dayjs(dates[1]).format('YYYY-MM-DD') : null
              });
            }}
          />
        )}

        {fetchData && (
          <Button icon={<SearchOutlined />} color="cyan" variant="outlined" onClick={() => fetchData(1, pagination.pageSize)}>
            Tìm kiếm
          </Button>
        )}
      </Space>
    </Col>
  );
}

export default SearchBar;
