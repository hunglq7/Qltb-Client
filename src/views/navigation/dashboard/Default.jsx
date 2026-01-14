// react-bootstrap
import { useEffect } from 'react';
import { Col, Row } from 'antd';
import { myData } from '../../../utils/data';
//ThietbiCard
import ThietbiCard from '../../../components/cards/ThietbiCard';
import { useTonghoptoidienStore } from '../../../stores/toidien/tonghoptoidienStore';
import { useTonghopmayxucStore } from '../../../stores/mayxuc/tonghopmayxucStore';
import { useTonghopmaycaoStore } from '../../../stores/maycao/tonghopmaycaoStore';
import BomnuocChart from '../../../sections/charts/apex-charts/BomnuocChart';
import MaycaoChart from '../../../sections/charts/apex-charts/MaycaoChart';
import MayxucChart from '../../../sections/charts/apex-charts/MayxucChart';
import ToidienChart from '../../../sections/charts/apex-charts/ToidienChart';
import QuatgioChart from '../../../sections/charts/apex-charts/QuatgioChart';
import GiacotChart from '../../../sections/charts/apex-charts/GiacotChart';
import MainCard from '../../../components/MainCard';
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
    <Row>
      <Col sm={24}>
        <MainCard title="Biểu đồ thiết bị Máy cào">
          <MaycaoChart />
        </MainCard>
      </Col>
      <Col sm={24}>
        <MainCard title="Biểu đồ thiết bị Máy xúc">
          <MayxucChart />
        </MainCard>
      </Col>
      <Col sm={24}>
        <MainCard title="Biểu đồ thiết bị Tời điện">
          <ToidienChart />
        </MainCard>
      </Col>
      <Col sm={24}>
        <MainCard title="Biểu đồ thiết bị bơm nước">
          <BomnuocChart />
        </MainCard>
      </Col>
      <Col sm={24}>
        <MainCard title="Biểu đồ thiết bị quạt gió">
          <QuatgioChart />
        </MainCard>
      </Col>
      <Col sm={24}>
        <MainCard title="Biểu đồ giá cột">
          <GiacotChart />
        </MainCard>
      </Col>
    </Row>
    // <div className="container-fluid">
    //   <Row xs={{ cols: 1, gutter: 2 }} md={{ cols: 3, gutter: 4 }} lg={{ cols: 6, gutter: 4 }}>
    //     {Data.map((item) => (
    //       <ThietbiCard key={item.title} {...item} />
    //     ))}
    //   </Row>
    // </div>
  );
}
