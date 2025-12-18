import { Space, Input, Button } from 'antd';
import { useState } from 'react';
function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  return (
    <Space style={{ marginBottom: 16 }}>
      <Input placeholder="Tìm theo nội dung" value={keyword} onChange={(e) => setKeyword(e.target.value)} allowClear />
      <Button type="primary" onClick={() => onSearch(keyword)}>
        Tìm kiếm
      </Button>
    </Space>
  );
}

export default SearchBar;
