import React from 'react';
import { Button } from 'antd';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
const { Meta } = Card;
export default function ThietbiCard({ image, title, desc, sl, url }) {
  return (
    <>
      <Card hoverable style={{ width: 240 }} cover={<img draggable={false} alt="example" src={image} />}>
        <Meta title={title} description={desc} />
        <div className="d-flex flex justify-content-between">
          <Link to={url}>
            <Button color="primary" variant="solid">
              Cập nhật
            </Button>
          </Link>
          <p>{sl}</p>
        </div>
      </Card>
    </>
  );
}
