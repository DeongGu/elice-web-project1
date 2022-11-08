import styled from 'styled-components';
import React, { useContext } from 'react';
import { UserStateContext } from '../../../App';
import '../../../../src/styles/index.css';
import { useTheme } from '../../stores/themeProvider';
function ThemeToggle({ toggle, mode }) {
  const ThemeMode = useTheme();
  const theme = ThemeMode[0];
  const userState = useContext(UserStateContext);
  let id = null;

  if (id) {
    id = userState.user.id;
  }

  return (
    <ToggleWrapper
      onClick={toggle}
      mode={mode}
      id={theme === 'light' ? 'light' : 'dark'}
    >
      {mode === 'dark' ? '🌚' : '🌝'}
    </ToggleWrapper>
  );
}
export default ThemeToggle;
const ToggleWrapper = styled.button`
  position: fixed;
  z-index: 9;
  bottom: 4%;
  right: 4%;

  background-color: ${(props) => props.theme.bgColor};
  border: ${(props) => props.theme.borderColor};
  font-size: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 96px;
  height: 48px;
  border-radius: 30px;
  box-shadow: ${(props) =>
    props.mode === 'dark'
      ? '0px 5px 10px rgba(40, 40, 40, 1), 0px 2px 4px rgba(40, 40, 40, 1)'
      : '0 5px 10px rgba(100, 100, 100, 0.15), 0 2px 4px rgba(100, 100, 100, 0.15)'};
`;
