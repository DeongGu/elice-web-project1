import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { UserStateContext, DispatchContext } from '../App';
import { useTheme } from '../components/stores/themeProvider';
import '../styles/index.css';
import mediaQuery_header from '../styles/mediaQuery_header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const userState = useContext(UserStateContext);
  const dispatch = useContext(DispatchContext);
  const isLogin = !!userState.user;
  const ThemeMode = useTheme();
  const theme = ThemeMode[0];

  const logout = () => {
    sessionStorage.removeItem('userToken');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <Nav
      activeKey={location.pathname}
      className="elice"
      style={{ border: '0px' }}
    >
      <Nav.Item
        className="me-auto marginBottom"
        style={{ mediaQuery_header }}
        id="newline"
      >
        <Nav.Link disabled>
          <span id={theme === 'light' ? 'blight' : 'bdark'}>
            안녕하세요, 포트폴리오 공유 서비스입니다.
          </span>
        </Nav.Link>
      </Nav.Item>
      <div style={{ mediaQuery_header }} id="newline">
        <Nav.Item>
          <Nav.Link
            id={theme === 'light' ? 'blight' : 'bdark'}
            onClick={() => navigate('/')}
          >
            나의 페이지
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            id={theme === 'light' ? 'blight' : 'bdark'}
            onClick={() => navigate('/network')}
          >
            네트워크
          </Nav.Link>
        </Nav.Item>
        {isLogin && (
          <Nav.Item>
            <Nav.Link
              id={theme === 'light' ? 'blight' : 'bdark'}
              onClick={logout}
            >
              로그아웃
            </Nav.Link>
          </Nav.Item>
        )}
      </div>
    </Nav>
  );
}

export default Header;
