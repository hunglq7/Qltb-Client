// project-imoports
import AuthLoginForm from 'sections/auth/AuthLogin';
import { Row, Col } from 'antd';
// ===========================|| AUTH - LOGIN V1 ||=========================== //

export default function LoginPage() {
  return (
    // <Row>
    //   <Col span={12}>
    //     <AuthLoginForm link="/register" />
    //   </Col>
    //   <Col span={12}>
    //     <div className="backgoud-img" style={{ width: 500, height: 500 }}>
    //       <h2>Home</h2>
    //     </div>
    //   </Col>
    // </Row>

    <div className="auth-main backgoud-img bg-body-tertiary min-vh-100 d-flex flex-row  align-items-center">
      <div className="auth-wrapper v1 ">
        {/* <div className=" d-flex flex-column align-items-center justify-content-center ">
          <div style={{ color: 'green', fontSize: 20 }}>CÔNG TY CP THAN MÔNG DƯƠNG</div>
          <div style={{ color: 'orange', fontSize: 20 }}>PHẦN MỀM QUẢN LÝ THIẾT BỊ</div>
        </div> */}

        <div className="auth-form">
          <div className="position-relative  ">
            <div className="auth-bg">
              <span className="r"></span>
              <span className="r s"></span>
              <span className="r s"></span>
              <span className="r"></span>
            </div>
            <AuthLoginForm link="/register" />
          </div>
        </div>
      </div>
    </div>
  );
}
