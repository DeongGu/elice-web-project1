import React, { useContext, useState, useRef, useEffect } from 'react';
import * as Api from '../../api';

import ErrorModalContext from '../stores/ErrorModalContext';
import { Col, Button, Overlay, Tooltip } from 'react-bootstrap';
import '../../styles/tooltip.css';

const ProjectCard = (props) => {
  const errorModalContext = useContext(ErrorModalContext);
  const [isConfirm, setConfirm] = useState(false);
  const target = useRef(null);
  const DATA_ENDPOINT = 'project';

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfirm(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isConfirm]);

  const checkDelete = async (id) => {
    if (isConfirm) {
      await confirmDelete(id);
    }

    setConfirm(true);
  };

  const confirmDelete = async (id) => {
    try {
      await Api.delete(DATA_ENDPOINT, id);
      await props.callFetch();
    } catch (err) {
      errorModalContext.setModalText(
        `${err.message} // 프로젝트 데이터를 삭제하는 과정에서 문제가 발생했습니다.`
      );
    }
  };

  const getEditIdList = (id) => {
    props.setEditIdList((prevState) =>
      props.editIdList.includes(id) ? prevState : [...prevState, id]
    );
  };

  return (
    <div className="mb-4">
      <div className="align-items-center row">
        <Col id="widthx" style={{ width: '584px' }}>
          {props.project.title} <br />
          <span className="text-muted">{props.project.content}</span> <br />
          <span className="text-muted">{`${
            props.project.startDay.split('T')[0]
          } ~ ${props.project.endDay.split('T')[0]}`}</span>
        </Col>
        {props.isEditable && (
          <Col className="col-lg-1">
            <Button
              variant="outline-info toggleTarget"
              size="sm"
              className="me-1 mb-1 mr-3"
              onClick={() => {
                getEditIdList(props.project.id);
              }}
            >
              편집
            </Button>
            <Button
              variant="outline-danger toggleTarget"
              size="sm"
              className="mr-3 btn-sm"
              ref={target}
              onClick={() => checkDelete(props.project.id)}
            >
              삭제
            </Button>
            <Overlay target={target.current} show={isConfirm} placement="left">
              {(props) => (
                <Tooltip className="red-tooltip" {...props}>
                  정말 삭제하시겠습니까?
                </Tooltip>
              )}
            </Overlay>
          </Col>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
