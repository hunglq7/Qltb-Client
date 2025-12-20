// react-bootstrap

import { Col, Row } from 'antd';
import { myData } from '../../../utils/data';
//ThietbiCard
import ThietbiCard from '../../../components/cards/ThietbiCard';

export default function DefaultPage() {
  const Data = myData;
  //Dùng vòng lặp để gán tổng vào myData
  for (let i = 0; i < myData.length; i++) {
    switch (Data[i].name) {
      case 'bomnuoc':
        Data[i].sl = null;
        break;
      case 'toidien':
        Data[i].sl = null;
        break;
      case 'maycao':
        Data[i].sl = 15;
        Data[i].urlDanhmuc = '/maycao/danhmucmaycao';
        break;
      case 'bangtai':
        Data[i].sl = null;
        break;
      default:
        Data[i].sl = null;
    }
  }

  return (
    <div className="container-fluid">
      <Row xs={{ cols: 1, gutter: 2 }} md={{ cols: 3, gutter: 4 }} lg={{ cols: 6, gutter: 4 }}>
        {Data.map((item) => (
          <ThietbiCard key={item.title} {...item} />
        ))}
      </Row>
    </div>
  );
}
