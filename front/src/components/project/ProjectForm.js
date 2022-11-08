import React, { useState, useContext } from 'react';
import * as Api from '../../api';

import ErrorModalContext from '../stores/ErrorModalContext';
import { Form, Col, Button, FloatingLabel } from 'react-bootstrap';
import styles from '../../styles/anime.css';

const ProjectForm = (props) => {
  const errorModalContext = useContext(ErrorModalContext);
  const [dataValues, setDataValues] = useState({});
  const [isEmpty, setIsEmpty] = useState(false);
  const DATA_ENDPOINT = 'project';

  const setProjectValues = (e) => {
    const { name, value } = e.target;
    setDataValues({ ...dataValues, [name]: value });
  };

  const checkProjectValues = (projectValues) => {
    const startDay = projectValues.startDay?.split('-').join('');
    const endDay = projectValues.endDay?.split('-').join('');

    if (
      !projectValues.startDay ||
      !projectValues.endDay ||
      !projectValues.title ||
      !projectValues.content
    ) {
      setIsEmpty(true);
      return;
    }

    if (startDay - endDay > 0) {
      alert('시작 날짜와 종료 날짜를 제대로 적어주세요.');
      return false;
    }

    if (startDay > 99991231 || endDay > 99991231) {
      alert('연도는 네자리를 넘을 수 없습니다.');
      return false;
    }

    return true;
  };

  const callPost = async () => {
    if (!checkProjectValues(dataValues)) {
      return;
    }

    try {
      await Api.post(DATA_ENDPOINT, dataValues);
      await props.callFetch();
    } catch (err) {
      errorModalContext.setModalText(
        `${err.message} // 프로젝트 데이터를 전송하는 과정에 문제가 발생했습니다.`
      );
    } finally {
      setDataValues({
        title: '',
        content: '',
        startDay: '',
        endDay: '',
      });
    }
  };

  return (
    <Form className="toggleTarget">
      <Form.Group>
        {isEmpty && (
          <div className="text-danger text-center" style={{ styles }}>
            <span id="anime">빈 값이 있습니다.</span>
          </div>
        )}
        <FloatingLabel
          label="프로젝트 제목"
          className="mt-3 mb-3"
          style={{ color: 'black' }}
        >
          <Form.Control
            name="title"
            type="text"
            placeholder="프로젝트 제목"
            onChange={setProjectValues}
            maxLength="20"
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mt-3">
        <FloatingLabel
          label="상세 내역"
          className="mb-3"
          style={{ color: 'black' }}
        >
          <Form.Control
            name="content"
            type="text"
            placeholder="상세 내역"
            onChange={setProjectValues}
            maxLength="400"
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mt-3 row">
        <Col className="col-auto">
          <Form.Control
            type="date"
            name="startDay"
            onChange={setProjectValues}
          />
        </Col>
        <Col className="col-auto">
          <Form.Control type="date" name="endDay" onChange={setProjectValues} />
        </Col>
      </Form.Group>
      <Form.Group className={`mt-3 text-center mb-3`}>
        <Col>
          <Button variant="primary" className="me-3" onClick={callPost}>
            확인
          </Button>
          <Button variant="secondary" onClick={() => props.setIsAdding(false)}>
            취소
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};

export default ProjectForm;
