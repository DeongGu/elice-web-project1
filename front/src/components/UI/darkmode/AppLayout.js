import React, { useContext } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../stores/themeProvider';
import { FlexContainer } from '../../../styles/styles';
import ThemeToggle from './ThemeToggle';
import { UserStateContext } from '../../../App';

const AppLayout = ({ children }) => {
  const [ThemeMode, toggleTheme] = useTheme();
  const userState = useContext(UserStateContext);
  const isLogin = !!userState.user;
  return (
    <WrapContainer>
      {isLogin && (
        <ThemeToggle toggle={toggleTheme} mode={ThemeMode}>
          DarkMode
        </ThemeToggle>
      )}
      <FlexContainer>{children}</FlexContainer>
    </WrapContainer>
  );
};

export default AppLayout;

const WrapContainer = styled.main`
  min-height: 100%;
  position: relative;
`;
