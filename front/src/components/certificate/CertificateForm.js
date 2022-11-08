import { Col, Row, Form, Button, FloatingLabel } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { UserStateContext } from '../../App';
import * as Api from '../../api';
import styles from '../../styles/anime.css';
import ErrorModalContext from '../stores/ErrorModalContext';

const CertificateForm = (props) => {
  const userState = useContext(UserStateContext);
  const errorModalContext = useContext(ErrorModalContext);

  const [certificate, setCertificate] = useState('');
  const [details, setDetails] = useState('');
  const [day, setDay] = useState('');
  const [isEmpty, setIsEmpty] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const arr = day.split('-');
    if (arr[0].length > 4) {
      alert('연도는 네자리를 넘을 수 없습니다.');
      return;
    }
    if (certificate === '' || details === '' || day === '') {
      setIsEmpty(false);
      return;
    }

    setIsEmpty(true);

    const certificateObj = {
      title: certificate,
      content: details,
      day: day,
    };

    try {
      await Api.post('certificate', certificateObj);

      const getRes = await Api.get('certificates', userState.user.id);
      const datas = getRes.data;
      let dataArr = [];

      dataArr = datas.map((ele) => {
        return [ele.id, ele.title, ele.content, ele.day.slice(0, 10)];
      });
      props.setArr(dataArr);
    } catch (err) {
      errorModalContext.setModalText(
        `${err.message} // 자격증 데이터를 등록하는 과정에서 문제가 발생했습니다.`
      );
    }

    setCertificate('');
    setDetails('');
    setDay('');
  };

  return (
    <Form onSubmit={handleSubmit} className="toggleTarget">
      <Form.Group controlId="certificateID">
        {!isEmpty && (
          <div className="text-danger text-center" style={{ styles }}>
            <span id="anime">빈 값이 있습니다.</span>
          </div>
        )}
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
      <Form.Group controlId="detailsID" className="mt-3">
        <FloatingLabel
          label="상세 내역"
          className="mb-3"
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
      <Form.Group controlId="dayID" className="mt-3">
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
            onSubmit={handleSubmit}
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

export default CertificateForm;
