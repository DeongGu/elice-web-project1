import AwardEditForm from './AwardEditForm';
import { Button, Overlay, Tooltip, Col } from 'react-bootstrap';
import * as Api from '../../api';
import { useState, useContext, useRef, useEffect } from 'react';
import { UserStateContext } from '../../App';
import displayToggleCss from '../../styles/displayToggle.css';
import '../../styles/tooltip.css';
import '../../styles/index.css';
import { useLocation } from 'react-router';
import ErrorModalContext from '../stores/ErrorModalContext';

const AwardCard = (props) => {
  const userState = useContext(UserStateContext);
  const errorModalContext = useContext(ErrorModalContext);
  const id = userState?.user?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [eleID, setEleID] = useState(false);

  const arr = props.arr;
  const setArr = props.setArr;
  const idx = props.idx;

  const [isConfirm, setConfirm] = useState(false);
  const target = useRef(null);

  let { state } = useLocation();

  if (state === null || typeof state === 'object') {
    state = id;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfirm(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isConfirm]);

  const openEditForm = (e) => {
    setEleID(e.target.parentNode.parentNode.id);
    setIsEditing(true);
  };

  const confirmDelete = async (e) => {
    try {
      const eleID = e.target.parentNode.parentNode.id;

      await Api.delete('award', eleID);

      const getRes = await Api.get('awards', id);
      const datas = getRes.data;
      let dataArr = [];

      dataArr = datas.map((ele) => [ele.id, ele.title, ele.description]);
      props.setArr(dataArr);
    } catch (err) {
      errorModalContext.setModalText(
        `${err.message} // 수상 이력 데이터를 삭제하는 과정에서 문제가 발생했습니다.`
      );
    }
  };

  const checkDelete = async (e) => {
    if (isConfirm) {
      await confirmDelete(e);
    }
    setConfirm(true);
  };

  return (
    <>
      {isEditing && id === state ? (
        <AwardEditForm
          eleID={eleID}
          arr={arr}
          idx={idx}
          setArr={setArr}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      ) : (
        <div className="mb-4">
          <div className="align-items-center row" id={arr[idx][0]}>
            <Col id="widthx" style={{ width: '584px' }}>
              <span> {arr[idx][1]}</span> <br />
              <span className="text-muted"> {arr[idx][2]}</span>
            </Col>
            {props.isEditable && id === state && (
              <Col className="col-lg-1">
                <Button
                  css={{ displayToggleCss }}
                  variant="outline-info"
                  onClick={openEditForm}
                  className="me-1 mb-1 mr-3 toggleTarget"
                  size="sm"
                >
                  편집
                </Button>
                <Button
                  css={{ displayToggleCss }}
                  variant="outline-danger"
                  onClick={checkDelete}
                  ref={target}
                  className="me-1 mb-1 mr-3 toggleTarget"
                  size="sm"
                >
                  삭제
                </Button>
                <Overlay
                  target={target.current}
                  show={isConfirm}
                  placement="left"
                >
                  {
                    <Tooltip className="red-tooltip">
                      정말 삭제하시겠습니까?
                    </Tooltip>
                  }
                </Overlay>
              </Col>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AwardCard;
