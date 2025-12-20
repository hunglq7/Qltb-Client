import React from 'react';
import { Link } from 'react-router-dom';
import { ToolOutlined, TableOutlined, ProfileOutlined } from '@ant-design/icons';
import { Card, Col, Badge, Popover } from 'antd';

const { Meta } = Card;
export default function ThietbiCard({ image, title, desc, sl, urlCapnhat, urlDanhmuc, urlThongso }) {
  const actions = [
    <Link to={urlDanhmuc}>
      <Popover title="Danh mục" content="Cập nhật danh mục">
        <ProfileOutlined key="heart" style={{ color: '#ff6b6b' }} />
      </Popover>
    </Link>,
    <Link to={urlThongso}>
      <Popover title="Thông số" content="Cập nhật thông số">
        <ToolOutlined key="share" style={{ color: '#0099FF' }} />
      </Popover>
    </Link>,
    <Link to={urlCapnhat}>
      <Popover title="Thiết bị" content="Cập nhật chi tiết thiết bị">
        <TableOutlined key="edit" style={{ color: '#45b7d1' }} />
      </Popover>
    </Link>
  ];

  const sharedCardProps = {
    // classNames,
    actions
  };

  return (
    <>
      <Col span={4} className="my-3">
        {/* <Card hoverable style={{ width: 200, height: 320 }} cover={<img draggable={false} alt="example" src={image} />}>
          <Meta title={title} description={desc} />
          <div className="d-flex flex justify-content-between align-content-center">
            <Link to={url}>
              <Button color="primary" variant="solid">
                Cập nhật
              </Button>
            </Link>
            <p>{sl}</p>
          </div>
        </Card> */}

        <Card
          className="hCard"
          hoverable
          style={{ width: 250, height: 400 }}
          cover={<img className="p-2" style={{ height: 250, width: 250 }} draggable={false} alt="image" src={image} />}
          {...sharedCardProps}
          variant="borderless"
        >
          <Meta title={title} />
          <div className="mt-2 d-flex justify-content-between">
            <Meta description={desc} />
            <Badge count={sl ? sl : 0} />
          </div>
        </Card>
      </Col>
    </>
  );
}
