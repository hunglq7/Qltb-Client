import PropTypes from 'prop-types';
import { useState } from 'react';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import { useNavigate } from 'react-router-dom';
// third-party
import { useForm } from 'react-hook-form';

// project-imports
import MainCard from 'components/MainCard';
import { emailSchema, passwordSchema } from 'utils/validationSchema';

// assets
import DarkLogo from 'assets/images/logo-dark.svg';

// antd
import { message } from 'antd';

// service
import { authService } from '../../services/auth/authService';

export default function AuthLoginForm({ className, link }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await authService.loginWithUserCredentials(data.email, data.password);
      // Ví dụ: lưu token
      if (res?.resultObj) {
        localStorage.setItem('accessToken', res.resultObj);
      }

      message.success('Đăng nhập thành công');
      reset();

      // TODO: điều hướng sau đăng nhập
      navigate('/');
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Đăng nhập thất bại';

      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainCard className="mb-0 w-100 ">
      <div className="text-center">
        <Image src={DarkLogo} alt="logo" />
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Login</h4>

        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            placeholder="Email Address"
            {...register('email', emailSchema)}
            isInvalid={!!errors.email}
            className={className && 'bg-transparent border-white text-white border-opacity-25'}
          />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-3">
          <InputGroup>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              {...register('password', passwordSchema)}
              isInvalid={!!errors.password}
              className={className && 'bg-transparent border-white text-white border-opacity-25'}
            />
            <Button variant="outline-secondary" onClick={togglePasswordVisibility} tabIndex={-1}>
              {showPassword ? <i className="ti ti-eye" /> : <i className="ti ti-eye-off" />}
            </Button>
          </InputGroup>
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        {/* Remember & Forgot */}
        <Stack direction="horizontal" className="justify-content-between align-items-center">
          <Form.Check type="checkbox" label="Remember me?" defaultChecked className={`input-primary ${className || 'text-muted'}`} />
          <a href="#!" className={`text-secondary f-w-400 ${className}`}>
            Forgot Password?
          </a>
        </Stack>

        {/* Submit */}
        <div className="text-center mt-4">
          <Button type="submit" className="shadow px-sm-4" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>

        {/* Register */}
        <Stack direction="horizontal" className="justify-content-between align-items-end mt-4">
          <h6 className={`f-w-500 mb-0 ${className}`}>Don't have an Account?</h6>
          <a href={link} className="link-primary">
            Create Account
          </a>
        </Stack>
      </Form>
    </MainCard>
  );
}

AuthLoginForm.propTypes = {
  className: PropTypes.string,
  link: PropTypes.string
};
