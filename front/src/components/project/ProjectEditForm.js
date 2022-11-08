import React, { useState, useContext } from 'react';
import * as Api from '../../api';

import ErrorModalContext from '../stores/ErrorModalContext';
import { Form, Col, FloatingLabel, Button } from 'react-bootstrap';

const ProjectEditForm = (props) => {
  const errorModalContext = useContext(ErrorModalContext);
  const [dataValues, setDataValues] = useState({});
  const DATA_ENDPOINT = 'project';

  const setProjectValues = (e) => {
    const { name, value } = e.target;
    setDataValues({ ...dataValues, [name]: value });
  };

  const checkProjectValues = (projectValues) => {
    const originalIsNotValid =
      !projectValues.startDay &&
      !projectValues.endDay &&
      !projectValues.title &&
      !projectValues.content;

    if (originalIsNotValid) {
      deleteIdFromIdList();
      return false;
    }

    const startDay = projectValues.startDay
      ? projectValues.startDay.split('-').join('')
      : props.project.startDay.split('T')[0].split('-').join('');

    const endDay = projectValues.endDay
      ? projectValues.endDay.split('-').join('')
      : props.project.endDay.split('T')[0].split('-').join('');

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

  const confirmEdit = async (projectId) => {
    const editedValues = {
      ...dataValues,
    };

    if (!checkProjectValues(editedValues)) {
      return;
    }

    props.setEditIdList(props.editIdList.filter((id) => id !== projectId));

    try {
      await Api.patch(DATA_ENDPOINT, projectId, editedValues);
      await props.callFetch();
    } catch (err) {
      errorModalContext.setModalText(
        `${err.message} // 프로젝트 데이터를 수정하는 과정에서 문제가 발생했습니다.`
      );
    }
  };

  const deleteIdFromIdList = () => {
    props.setEditIdList(
      props.editIdList.filter((id) => id !== props.project.id)
    );
  };

  return (
    <Form className="toggleTarget">
      <Form.Group>
        <FloatingLabel
          label="프로젝트 이름"
          className="mt-3 mb-3"
          style={{ color: 'black' }}
        >
          <Form.Control
            name="title"
            type="text"
            onChange={setProjectValues}
            defaultValue={props.project.title}
            maxLength="20"
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mt-3">
        <FloatingLabel
          label="상세 내역"
          className="mb-3 "
          style={{ color: 'black' }}
        >
          <Form.Control
            name="content"
            type="text"
            onChange={setProjectValues}
            defaultValue={props.project.content}
            maxLength="400"
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mt-3 row">
        <Col className="col-auto">
          <Form.Control
            name="startDay"
            type="date"
            onChange={setProjectValues}
            defaultValue={props.project.startDay.split('T')[0]}
          />
        </Col>
        <Col className="col-auto">
          <Form.Control
            name="endDay"
            type="date"
            onChange={setProjectValues}
            defaultValue={props.project.endDay.split('T')[0]}
          />
        </Col>
      </Form.Group>
      <Form.Group className={`mt-3 text-center mb-3`}>
        <Col>
          <Button
            variant="primary"
            className="me-3"
            onClick={() => confirmEdit(props.project.id)}
          >
            확인
          </Button>
          <Button variant="secondary" onClick={deleteIdFromIdList}>
            취소
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};

export default ProjectEditForm;
