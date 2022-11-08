import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Col, Row, Form, Button } from 'react-bootstrap';
import * as Api from '../../api';
import { useTheme } from '../stores/themeProvider';
import '../../../src/styles/index.css';
function RegisterForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const ThemeMode = useTheme();
  const theme = ThemeMode[0];
  const validateEmail = (email) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 4;
  const isPasswordSame = password === confirmPassword;
  const isNameValid = name.length >= 2;

  const isFormValid =
    isEmailValid && isPasswordValid && isPasswordSame && isNameValid;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await Api.post('user/register', {
        email,
        password,
        name,
      });

      navigate('/login');
      alert('회원 가입에 성공하셨습니다.');
    } catch (err) {
      alert('회원 가입에 실패하셨습니다.');
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
            <Form.Group controlId="registerEmail">
              <Form.Label>이메일 주소</Form.Label>
              <Form.Control
                type="email"
                autoComplete="off"
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
            <Form.Group controlId="registerPassword" className="mt-3">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength="20"
              />
              {!isPasswordValid && (
                <Form.Text className="text-success">
                  비밀번호는 4글자 이상으로 설정해 주세요.
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="registerConfirmPassword" className="mt-3">
              <Form.Label>비밀번호 재확인</Form.Label>
              <Form.Control
                type="password"
                autoComplete="off"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength="20"
              />
              {!isPasswordSame && (
                <Form.Text className="text-success">
                  비밀번호가 일치하지 않습니다.
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="registerName" className="mt-3">
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength="30"
              />
              {!isNameValid && (
                <Form.Text className="text-success">
                  이름은 2글자 이상으로 설정해 주세요.
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group as={Row} className="mt-3 text-center">
              <Col sm={{ span: 20 }}>
                <Button variant="primary" type="submit" disabled={!isFormValid}>
                  회원 가입
                </Button>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mt-3 text-center">
              <Col sm={{ span: 20 }}>
                <Button variant="light" onClick={() => navigate('/login')}>
                  로그인 하기
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterForm;
