import { Col, Row, Form, Button, FloatingLabel } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { UserStateContext } from '../../App';
import * as Api from '../../api';
import anime from '../../styles/anime.css';
import { useLocation } from 'react-router';
import ErrorModalContext from '../stores/ErrorModalContext';

const CertificateEditForm = (props) => {
  const userState = useContext(UserStateContext);
  const errorModalContext = useContext(ErrorModalContext);
  const id = userState?.user?.id;

  const [certificate, setCertificate] = useState(props.arr[props.idx][1]);
  const [details, setDetails] = useState(props.arr[props.idx][2]);
  const [day, setDay] = useState(props.arr[props.idx][3]);
  const [isMessageNecessary, setIsMessageNecessary] = useState(false);
  const { state } = useLocation();

  let isClicked = false;
  let isEmpty = false;

  const submitEditForm = async (e) => {
    e.preventDefault();

    const arr = day.split('-');
    if (arr[0].length > 4) {
      alert('연도는 네자리를 넘을 수 없습니다.');
      return;
    }

    isClicked = true;
    isEmpty = certificate === '' || details === '' || day === '' ? true : false;
    setIsMessageNecessary(isClicked && isEmpty);
    isClicked = false;

    if (isEmpty) {
      isEmpty = false;
      return;
    }

    const certID = props.eleID;
    const obj = {
      title: certificate,
      content: details,
      day: day,
    };

    try {
      await Api.patch('certificate', certID, obj);
    } catch (err) {
      errorModalContext.setModalText(
        `${err.message} // 자격증 데이터를 수정하는 과정에서 문제가 발생했습니다.`
      );
    }

    getData();
    setCertificate('');
    setDetails('');
    setDay('');
    props.setIsEditing(false);
  };

  const getData = async () => {
    const getRes = await Api.get('certificates', userState.user.id);
    const datas = getRes.data;
    let dataArr = [];

    dataArr = datas.map((ele) => {
      return [ele.id, ele.title, ele.content, ele.day.slice(0, 10)];
    });
    props.setArr(dataArr);
  };

  return (
    <Form onSubmit={submitEditForm} className="toggleTarget">
      {isMessageNecessary && (
        <div className="text-danger text-center" style={{ anime }}>
          <span id="anime">빈 값이 있습니다.</span>
        </div>
      )}
      <Form.Group>
        <FloatingLabel
          label="자격증 제목"
          className="mt-3 mb-3"
          style={{ color: 'black' }}
        >
          <Form.Control
            type="text"
            autoComplete="on"
            value={certificate}
            placeholder="자격증 제목"
            onChange={(e) => setCertificate(e.target.value)}
            maxLength="20"
          />
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="mt-3">
        <FloatingLabel
          label="상세 내역"
          className="mt-3 mb-3"
          style={{ color: 'black' }}
        >
          <Form.Control
            type="text"
            autoComplete="on"
            value={details}
            placeholder="상세 내역"
            onChange={(e) => setDetails(e.target.value)}
            maxLength="200"
          />
        </FloatingLabel>
      </Form.Group>

      <Form.Group className="mt-3">
        <Form.Control
          type="date"
          autoComplete="on"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        />
      </Form.Group>

      <Form.Group as={Row} className="mt-3 text-center">
        <Col sm={{ span: 20 }}>
          <Button
            className="me-3 btn btn-primary"
            type="submit"
            onSubmit={submitEditForm}
          >
            확인
          </Button>
          <Button
            variant="btn btn-secondary"
            onClick={() => props.setIsEditing(false)}
          >
            취소
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};

export default CertificateEditForm;
