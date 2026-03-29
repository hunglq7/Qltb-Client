// project-imoports
import AuthLoginForm from 'sections/auth/AuthLogin';
import { Row, Col } from 'antd';
// ===========================|| AUTH - LOGIN V1 ||=========================== //

export default function LoginPage() {
  return (
    <>
      <div className="auth-main backgoud-img bg-body-tertiary min-vh-100 d-flex flex-row  align-items-center">
        <div className="auth-bg-top">
          <img src="/assets/images/logo-tmd.svg" alt="Logo" className="auth-top-logo" />
          <div className="auth-bg-blue">CÔNG TY CP THAN MÔNG DƯƠNG - VINACOMIN</div>
          <div className="auth-bg-green">PHẦN MỀM QUẢN LÝ THIẾT BỊ</div>
        </div>
        <div className="auth-wrapper v1 ">
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
    </>
  );
}
