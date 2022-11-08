import { Card, Row, Button, Col } from 'react-bootstrap';
import React, { useState, useContext, useEffect } from 'react';
import { UserStateContext } from '../../App';
import LikeButton from '../UI/LikeButton';
import { useNavigate } from 'react-router-dom';
import * as Api from '../../api';
import { useTheme } from '../stores/themeProvider';
import '../../../src/styles/index.css';
import DisplayToggleComp from '../UI/DisplayToggleComp';

function UserCard({
  user,
  setIsEditing,
  isEditable,
  isNetwork,
  portfolioOwnerId,
  setIsEditable,
}) {
  const [photo, setPhoto] = useState([]);
  const navigate = useNavigate();
  const userState = useContext(UserStateContext);
  const ThemeMode = useTheme();
  const theme = ThemeMode[0];
  const id = userState?.user?.id;

  useEffect(() => {
    Api.get(`${user?.id ? user?.id : id}/images/profile`).then((res) => {
      setPhoto(res.data);
    });
  }, [user?.id ? user?.id : id]);

  function recentlyView() {
    navigate(`/users/${user.id}`);
  }

  return (
    <Card
      className="mb-2 ms-3 mr-5"
      style={{ width: '18rem' }}
      id={theme === 'light' ? 'light' : 'dark'}
    >
      <Card.Body>
        <Row className="justify-content-md-center">
          <Card.Img
            style={{ width: '10rem', height: '8rem' }}
            className="mb-3"
            src={photo}
            alt="사용자 프로필 사진"
          />
        </Row>
        <Card.Title>
          <Row>
            <Col>{user?.name}</Col>
            <Col md="auto">
              {' '}
              {userState?.user?.id === portfolioOwnerId && (
                <DisplayToggleComp
                  isEditable={isEditable}
                  setIsEditable={setIsEditable}
                  portfolioOwnerId={portfolioOwnerId}
                />
              )}
            </Col>
          </Row>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{user?.email}</Card.Subtitle>
        <Card.Text className={!isNetwork ? '' : 'text-truncate'}>
          {user?.description}
        </Card.Text>
        <Row className="mt-4">
          {isNetwork && (
            <Col sm>
              <Card.Link className="mt-3" href="#" onClick={recentlyView}>
                포트폴리오
              </Card.Link>
            </Col>
          )}
          <Col>
            {isEditable && id === user.id && (
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                프로필 편집
              </Button>
            )}
          </Col>
          <Col md="auto">
            <LikeButton user={user} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default UserCard;
