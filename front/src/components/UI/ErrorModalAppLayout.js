import React, { useContext } from 'react';
import { UserStateContext } from '../../App';
import ErrorModal from './ErrorModal';
import ErrorModalContext from '../stores/ErrorModalContext';

const AppLayout = ({ children }) => {
  const errorModalContext = useContext(ErrorModalContext);
  const userState = useContext(UserStateContext);
  const isLogin = !!userState.user;

  return (
    <React.Fragment>
      {isLogin && errorModalContext.modalText && <ErrorModal />}
      {children}
    </React.Fragment>
  );
};

export default AppLayout;
