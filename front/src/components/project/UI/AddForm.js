import React, { useState, useContext } from 'react';
import * as Api from '../../../api';

import AuthContext from '../stores/AuthContext';
import CheckButton from './CheckButton';
import { Form, Col, FloatingLabel } from 'react-bootstrap';

const AddForm = (props) => {
  const context = useContext(AuthContext);
  const [dataValues, setDataValues] = useState({});

  const setProjectValues = (e) => {
    const { name, value } = e.target;
    setDataValues({ ...dataValues, [name]: value });
  };

  const checkProjectValues = (projectValues) => {
    const startDay = projectValues.startDay.split('-').join('');
    const endDay = projectValues.endDay.split('-').join('');

    if (startDay - endDay > 0) {
      return false;
    }

    return true;
  };

  const callPost = async () => {
    if (!checkProjectValues(dataValues)) {
      return;
    }

    try {
      await Api.post(props.DATA_ENDPOINT, dataValues);
      await props.callFetch();
      context.setIsAdding(false);
    } catch (err) {}
  };

  const setIsAddingFalse = () => {
    context.setIsAdding(false);
  };

  return (
    <Form>
      <Form.Group>
        <FloatingLabel label="프로젝트 제목" className="mt-3 mb-3">
          <Form.Control
            name="title"
            type="text"
            placeholder="프로젝트 제목"
            onChange={setProjectValues}
          />
        </FloatingLabel>
      </Form.Group>
      <Form.Group className="mt-3">
        <FloatingLabel label="상세 내역" className="mb-3">
          <Form.Control
            name="content"
            type="text"
            placeholder="상세 내역"
            onChange={setProjectValues}
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
      <CheckButton
        className={'mt-3 text-center'}
        submitHandler={callPost}
        cancelHandler={setIsAddingFalse}
      />
    </Form>
  );
};

export default AddForm;