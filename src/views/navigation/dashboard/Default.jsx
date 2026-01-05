// react-bootstrap
import { useEffect } from 'react';
import { Col, Row } from 'antd';
import { myData } from '../../../utils/data';
//ThietbiCard
import ThietbiCard from '../../../components/cards/ThietbiCard';
import { useTonghoptoidienStore } from '../../../stores/toidien/tonghoptoidienStore';
import { useTonghopmayxucStore } from '../../../stores/mayxuc/tonghopmayxucStore';
import { useTonghopmaycaoStore } from '../../../stores/maycao/tonghopmaycaoStore';
export default function DefaultPage() {
  const { dataTonghop, fetchTonghoptoidien } = useTonghoptoidienStore();
  const { dataTonghopMayxuc, fetchTonghopmayxuc } = useTonghopmayxucStore();
  const { dataTonghopMaycao, fetchTonghopMaycao } = useTonghopmaycaoStore();
  const TongToidien = dataTonghop.length;
  const TongMayxuc = dataTonghopMayxuc.length;
  const TongMaycao = dataTonghopMaycao.length;
  useEffect(() => {
    fetchTonghoptoidien();
    fetchTonghopmayxuc();
    fetchTonghopMaycao();
  }, []);
  const Data = myData;
  //Dùng vòng lặp để gán tổng vào myData
  for (let i = 0; i < myData.length; i++) {
    switch (Data[i].name) {
      case 'bomnuoc':
        Data[i].sl = null;
        break;
      case 'toidien':
        Data[i].sl = TongToidien;
        break;
      case 'maycao':
        Data[i].sl = TongMaycao;
        break;
      case 'mayxuc':
        Data[i].sl = TongMayxuc;
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
