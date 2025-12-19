import React from 'react';

import { Card } from 'antd';

const { Meta } = Card;
export default function ThietbiCard() {
  return (
    <>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img draggable={false} alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
      >
        <Meta title="Europe Street beat" description="www.instagram.com" />
      </Card>
    </>
  );
}
