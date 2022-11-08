import React, { useState, useContext, useEffect, useRef } from 'react';
import * as Api from '../../api';

import { Button, Overlay, Tooltip } from 'react-bootstrap';
import ErrorModalContext from '../stores/ErrorModalContext';
import { UserStateContext } from '../../App';

const LikeButton = (props) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isShowingTooltip, setIsShowingTooltip] = useState(false);
  const [count, setCount] = useState(0);
  const [tooltipText, setToolTipText] = useState('');
  const [checkedButton, setCheckedButton] = useState(false);

  const context = useContext(ErrorModalContext);
  const userState = useContext(UserStateContext);

  let tempCount = props.user?.likes.length ? props.user.likes.length : null;
  let checkUserLikes = props.user?.likes.includes(userState.user?.id);

  const target = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowingTooltip(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isShowingTooltip]);

  const updateLikes = async () => {
    if (!count) {
      setCount(tempCount);
    }

    if (props.user.likes.includes(userState.user.id)) {
      setCount(tempCount - 1);
      setToolTipText('-');
    }

    if (props.user.likes.includes(userState.user.id) && isClicked) {
      setCount(tempCount);
      setToolTipText('+');
    }

    if (!props.user.likes.includes(userState.user.id)) {
      setCount(tempCount + 1);
      setToolTipText('+');
    }

    if (!props.user.likes.includes(userState.user.id) && isClicked) {
      setCount(tempCount);
      setToolTipText('-');
    }

    setIsClicked(!isClicked);
    setIsShowingTooltip(true);
    setCheckedButton(!checkedButton);

    try {
      await Api.patch(props.user.id, 'likes');
    } catch (err) {
      context.setModalText('좋아요 요청을 실패했습니다.');
    }
  };

  return (
    <React.Fragment>
      <Button
        ref={target}
        variant="outline-info"
        size="sm"
        onClick={updateLikes}
        style={{
          backgroundColor:
            (checkUserLikes && !checkedButton) ||
            (!checkUserLikes && checkedButton)
              ? '#0dcaf0'
              : 'transparent',
          color:
            (checkUserLikes && !checkedButton) ||
            (!checkUserLikes && checkedButton)
              ? 'black'
              : '#0dcaf0',
        }}
      >
        {count || (!isClicked && tempCount)} 👍
      </Button>
      <Overlay
        target={target.current}
        show={isShowingTooltip}
        placement="right"
      >
        {(props) => (
          <Tooltip className="lightblue-tooltip" {...props}>
            {tooltipText}1!
          </Tooltip>
        )}
      </Overlay>
    </React.Fragment>
  );
};

export default LikeButton;
