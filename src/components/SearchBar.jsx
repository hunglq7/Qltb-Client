import { Input, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
function SearchBar({ onSearch }) {
  return (
    <Col flex="auto">
      <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm..." allowClear onChange={(e) => onSearch(e.target.value)} />
    </Col>
  );
}

export default SearchBar;
