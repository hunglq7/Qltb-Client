import { Space, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
function SearchBar({ onSearch }) {
  return (
    <Space style={{ marginBottom: 16 }}>
      <Input
        prefix={<SearchOutlined />}
        style={{ width: 700 }}
        placeholder="Tìm kiếm..."
        allowClear
        onChange={(e) => onSearch(e.target.value)}
      />
    </Space>
  );
}

export default SearchBar;
