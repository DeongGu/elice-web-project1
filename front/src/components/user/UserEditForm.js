import React, { useState } from 'react';
import { Button, Form, Card, Col, Row } from 'react-bootstrap';
import * as Api from '../../api';
import styles from '../../styles/anime.css';
import '../../../src/styles/index.css';
import { useTheme } from '../stores/themeProvider';

function UserEditForm({ user, setIsEditing, setUser }) {
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [description, setDescription] = useState(user?.description);
  const [isEmpty, setIsEmpty] = useState(true);
  const ThemeMode = useTheme();
  const theme = ThemeMode[0];
  let formData = new FormData();
  const backendPortNumber = '5001';
  const serverUrl =
    'http://' + window.location.hostname + ':' + backendPortNumber + '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name === '' || description === '') {
      setIsEmpty(false);
      return;
    } else {
      setIsEmpty(true);
    }

    const res = await Api.put(`users/${user.id}`, {
      name,
      email,
      description,
    });

    const updatedUser = res.data;

    setUser(updatedUser);

    let value = '';

    for (value of formData.values()) {
    }

    if (value.length !== 0) {
      await fetch(serverUrl + `user/images/profile`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('userToken')}`,
        },
      });
    }

    setIsEditing(false);
  };

  const onImgChange = async (e) => {
    let file = e.target.files[0];
    formData.append('file', file);
  };

  return (
    <Card className="mb-2" id={theme === 'light' ? 'light' : 'dark'}>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {!isEmpty && (
            <div className="text-danger text-center" style={{ styles }}>
              <span id="anime">빈 값이 있습니다.</span>
            </div>
          )}
          <Form.Group controlId="useEditName" className="mb-3">
            <Form.Control
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength="10"
            />
          </Form.Group>
          <Form.Group controlId="userEditEmail" className="mb-3">
            <Form.Control
              type="email"
              placeholder="이메일"
              value={email}
              disabled={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="userEditDescription" className="mb-3">
            <Form.Control
              type="text"
              placeholder="정보, 인사말"
              value={description}
              maxLength="100"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="userEditProfile">
            <Form.Control
              type="file"
              placeholder="선택된 파일 없음"
              id="formFile"
              maxLength="100"
              onChange={onImgChange}
            />
          </Form.Group>
          <Form.Group as={Row} className="mt-3 text-center">
            <Col sm={{ span: 20 }}>
              <Button variant="primary" type="submit" className="me-3">
                확인
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                취소
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default UserEditForm;
