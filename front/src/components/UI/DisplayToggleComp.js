import React from 'react';
import '../../../src/styles/index.css';
import { useContext } from 'react';
import { UserStateContext } from '../../App';
import { Button } from 'react-bootstrap';

const DisplayToggleComp = (props) => {
  const userState = useContext(UserStateContext);
  const existingId = userState?.user?.id;
  const loggedInId = props.portfolioOwnerId;

  const displayToggler = (e) => {
    e.preventDefault();
    const targetElement = document.querySelectorAll('.toggleTarget');

    if (existingId === loggedInId) {
      if (props.isEditable === false) {
        targetElement.forEach((ele) => {
          ele.classList.remove('display-none');
        });
        props.setIsEditable(true);
      }

      if (props.isEditable === true) {
        targetElement.forEach((ele) => {
          ele.classList.add('display-none');
        });
        props.setIsEditable(false);
      }
    }
  };
  return (
    <Button
      style={{ border: 'none' }}
      onClick={displayToggler}
      variant="outline-info"
      size="sm"
    >
      {props.isEditable ? '🕶️ 감상 모드' : '✏️ 편집 모드'}
    </Button>
  );
};

export default DisplayToggleComp;
