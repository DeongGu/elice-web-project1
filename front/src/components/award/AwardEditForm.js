import { Col, Row, Form, Button, FloatingLabel } from 'react-bootstrap';
import { useState, useContext } from 'react';
import { UserStateContext } from '../../App';
import * as Api from '../../api';
import anime from '../../styles/anime.css';
import ErrorModalContext from '../stores/ErrorModalContext';

const AwardEditForm = (props) => {
  const userState = useContext(UserStateContext);
  const errorModalContext = useContext(ErrorModalContext);
  const id = userState.user.id;

  const [award, setAward] = useState(props.arr[props.idx][1]);
  const [details, setDetails] = useState(props.arr[props.idx][2]);
  const [isMessageNecessary, setIsMessageNecessary] = useState(false);

  let isClicked = false;
  let isEmpty = false;

  const submitEditForm = async (e) => {
    e.preventDefault();
    isClicked = true;
    isEmpty = award === '' || details === '' ? true : false;
    setIsMessageNecessary(isClicked && isEmpty);
    isClicked = false;

    if (isEmpty) {
      isEmpty = false;
      return;
    }

    const awardID = props.eleID;
    const awardObj = {
      title: award,
      description: details,
    };

    try {
      await Api.patch('award', awardID, awardObj);
    } catch (err) {
      errorModalContext.setModalText(
        `${err.message} // 수상 이력 데이터를 수정하는 과정에서 문제가 발생했습니다.`
      );
    }

    getData();
    setAward('');
    setDetails('');
    props.setIsEditing(false);
  };

  const getData = async () => {
    try {
      const getRes = await Api.get('awards', id);
      const datas = getRes.data;
      let dataArr = [];
      dataArr = datas.map((ele) => [ele.id, ele.title, ele.description]);
      props.setArr(dataArr);
    } catch (err) {
      errorModalContext.setModalText(
        `${err.message} // 데이터를 불러오는 과정에서 문제가 발생했습니다.`
      );
    }
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
          label="수상 내역"
          className="mt-3 mb-3"
          style={{ color: 'black' }}
        >
          <Form.Control
            type="text"
            autoComplete="on"
            value={award}
            onChange={(e) => setAward(e.target.value)}
            maxLength="20"
          />
        </FloatingLabel>
      </Form.Group>

      <Form.Group>
        <FloatingLabel
          label="상세 내역"
          className="mt-3 mb-3"
          style={{ color: 'black' }}
        >
          <Form.Control
            type="text"
            autoComplete="on"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            maxLength="200"
          />
        </FloatingLabel>
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

export default AwardEditForm;
