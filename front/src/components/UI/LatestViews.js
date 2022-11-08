import React, { useContext, useEffect, useState } from 'react';
import { UserStateContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import '../../../src/styles/index.css';
import { useTheme } from '../stores/themeProvider';

const LatestViews = () => {
  const navigate = useNavigate();
  const ThemeMode = useTheme();
  const theme = ThemeMode[0];
  const userState = useContext(UserStateContext);
  const [recentList, setRecentList] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const origins = JSON.parse(
        localStorage.getItem(userState?.user?.id) ?? '[]'
      );
      setRecentList(origins);
    }, 90);
  }, []);

  return (
    <div
      className={
        theme === 'light' ? 'sideBox hide light ' : 'sideBox hide dark '
      }
    >
      <span className="mb-4" style={{ fontWeight: 'bold' }}>
        최근 본 포트폴리오
      </span>
      <ul
        className="mt-2"
        style={{
          listStyleType: 'circle',
          textAlign: 'left',
          display: 'inline-block',
        }}
      >
        {recentList.length > 0 &&
          recentList.map((obj, index) => {
            return (
              <li
                key={obj.id}
                onClick={() => {
                  navigate(`/users/${obj.id}`, { state: obj.id });
                }}
                className="cursor_test"
              >
                {obj.name}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default LatestViews;
