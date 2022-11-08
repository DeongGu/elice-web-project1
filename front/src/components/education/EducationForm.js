import React, { useState, useContext } from 'react';
import { Button, Form, Col, Row, FloatingLabel } from 'react-bootstrap';
import '../../../src/styles/index.css';
import { UserStateContext } from '../../App';
import * as Api from '../../api';
import styles from '../../styles/anime.css';
import ErrorModalContext from '../stores/ErrorModalContext';

const EducationForm = ({ onConfirm, onCancel, education, byEditbtn }) => {
  const [targetEducation, setTargetEducation] = useState({
    ...education,
  });
  const userState = useContext(UserStateContext);
  const errorModalContext = useContext(ErrorModalContext);

  const id = userState?.user?.id;

  const [isEmpty, setIsEmpty] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTargetEducation({
      ...targetEducation,
      [name]: value,
    });
  };

  const editedValues = {
    ...targetEducation,
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (targetEducation.school === '' || targetEducation.major === '') {
      setIsEmpty(false);
      return;
    } else {
      setIsEmpty(true);
    }

    try {
      if (!byEditbtn) {
        onConfirm({ ...targetEducation });
        await Api.post('education', {
          ...targetEducation,
          id,
        }).then((res) => {
          onConfirm(res.data);
        });
      } else {
        await Api.patch(`education`, education.id, editedValues).then((res) =>
          onConfirm(res.data)
        );
      }
    } catch (err) {
      errorModalContext.setModalText(
        `${err.message} // 학력 데이터를 등록하는 과정에서 문제가 발생했습니다.`
      );
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Form className="toggleTarget">
      {!isEmpty && (
        <div className="text-danger text-center" style={{ styles }}>
          <span id="anime">빈 값이 있습니다.</span>
        </div>
      )}
      <Form.Group>
        <FloatingLabel
          label="학교 이름"
          className="mt-3 mb-3"
          style={{ color: 'black' }}
        >
          <Form.Control
            name="school"
            type="text"
            id="school"
            value={targetEducation.school}
            onChange={handleChange}
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
            type="text"
            name="major"
            id="school"
            value={targetEducation.major}
            onChange={handleChange}
            maxLength="200"
          />
        </FloatingLabel>
      </Form.Group>

      <div className="mb-3 mt-3">
        <div className="form-check form-check-inline">
          <input
            name="position"
            type="radio"
            id="radio-add-1"
            className="form-check-input"
            value="재학중"
            checked={targetEducation.position === '재학중'}
            onChange={handleChange}
          ></input>
          <label title="" htmlFor="radio-add-1" className="form-check-label">
            재학중
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            name="position"
            type="radio"
            id="radio-add-2"
            className="form-check-input"
            value="학사졸업"
            checked={targetEducation.position === '학사졸업'}
            onChange={handleChange}
          ></input>
          <label title="" htmlFor="radio-add-2" className="form-check-label">
            학사졸업
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            name="position"
            type="radio"
            id="radio-add-3"
            className="form-check-input"
            value="석사졸업"
            checked={targetEducation.position === '석사졸업'}
            onChange={handleChange}
          ></input>
          <label title="" htmlFor="radio-add-3" className="form-check-label">
            석사졸업
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            name="position"
            type="radio"
            id="radio-add-4"
            className="form-check-input"
            value="박사졸업"
            checked={targetEducation.position === '박사졸업'}
            onChange={handleChange}
          ></input>
          <label title="" htmlFor="radio-add-4" className="form-check-label">
            박사졸업
          </label>
        </div>
      </div>
      <Form.Group as={Row} className="mt-3 text-center">
        <Col sm={{ span: 20 }}>
          <Button
            className="me-3 btn btn-primary"
            type="submit"
            onClick={handleConfirm}
          >
            확인
          </Button>
          <Button className="btn btn-secondary" onClick={handleCancel}>
            취소
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};
export default EducationForm;
