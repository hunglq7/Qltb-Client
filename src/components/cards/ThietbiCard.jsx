import React from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Flex, Col, Badge } from 'antd';
import { createStyles } from 'antd-style';

const { Meta } = Card;
export default function ThietbiCard({ image, title, desc, sl, url }) {
  //   const { classNames } = useStyles();
  const stylesCard = {
    root: {
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      borderRadius: 8
    },
    title: {
      fontSize: 16,
      fontWeight: 500
    }
  };

  const actions = [
    <HeartOutlined key="heart" style={{ color: '#ff6b6b' }} />,
    <ShareAltOutlined key="share" style={{ color: '#4ecdc4' }} />,
    <EditOutlined key="edit" style={{ color: '#45b7d1' }} />
  ];
  const useStyles = createStyles(({ token }) => ({
    root: {
      width: 300,
      backgroundColor: token.colorBgContainer,
      borderRadius: token.borderRadius,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: `1px solid ${token.colorBorderSecondary}`
    },
    header: {
      borderBottom: 'none',
      paddingBottom: 8
    },
    body: {
      paddingTop: 0
    }
  }));
  const sharedCardProps = {
    // classNames,
    actions
  };

  const sharedCardMetaProps = {
    avatar: <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />,
    description: 'This is the description'
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
          cover={<img style={{ height: 250, width: 250 }} draggable={false} alt="example" src={image} />}
          {...sharedCardProps}
          title={<Badge color="danger">15</Badge>}
          extra={
            <Link to={url}>
              <Button type="link">Cập nhật</Button>
            </Link>
          }
          variant="borderless"
        ></Card>
      </Col>
    </>
  );
}
