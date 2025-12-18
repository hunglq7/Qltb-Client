import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Page500() {
  const navigate = useNavigate();

  return (
    <Result
      status="500"
      title="500"
      subTitle="Mất kết nối máy chủ."
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Về trang chủ
        </Button>
      }
    />
  );
}
