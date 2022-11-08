import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Col, Row, Form, Button } from 'react-bootstrap';

import * as Api from '../../api';
import { DispatchContext } from '../../App';
import { useTheme } from '../stores/themeProvider';
import '../../../src/styles/index.css';

import styles from '../../styles/login-animation.css';

function LoginForm({ isEditable }) {
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);
  const ThemeMode = useTheme();
  const theme = ThemeMode[0];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEmpty(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isEmpty]);

  const validateEmail = (email) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await Api.post('user/login', {
        email,
        password,
      });
      const user = res.data;
      const jwtToken = user.token;

      sessionStorage.setItem('userToken', jwtToken);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: user,
      });

      navigate('/', { state: { email } });
    } catch (err) {
      setIsEmpty(true);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col lg={8}>
          <Form
            onSubmit={handleSubmit}
            style={{ border: '0px' }}
            id={theme === 'light' ? 'blight' : 'bdark'}
          >
            <Form.Group controlId="loginEmail">
              <Form.Label>이메일 주소</Form.Label>
              <Form.Control
                type="email"
                autoComplete="on"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength="20"
              />
              {!isEmailValid && (
                <Form.Text className="text-success">
                  이메일 형식이 올바르지 않습니다.
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="loginPassword" className="mt-3">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                autoComplete="on"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength="20"
              />
              {!isPasswordValid && (
                <Form.Text className="text-success">
                  비밀번호는 4글자 이상입니다.
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group as={Row} className="mt-3 text-center">
              <Col sm={{ span: 20 }}>
                <Button variant="primary" type="submit" disabled={!isFormValid}>
                  로그인
                </Button>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-3 text-center">
              <Col sm={{ span: 20 }}>
                <Button variant="light" onClick={() => navigate('/register')}>
                  회원 가입하기
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className="mt-5">
        {isEmpty && (
          <div className="text-danger text-center" style={{ styles }}>
            <span
              className="text-danger text-center"
              id="anime"
              style={{ styles }}
            >
              로그인에 실패했습니다.
            </span>
          </div>
        )}
      </Row>
    </Container>
  );
}

export default LoginForm;
