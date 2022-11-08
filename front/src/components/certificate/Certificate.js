import { Card, Button } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { UserStateContext } from '../../App';
import { useLocation } from 'react-router';
import CertificateCard from './CertificateCard';
import CertificateForm from './CertificateForm';
import { useTheme } from '../stores/themeProvider';
import '../../../src/styles/index.css';
import * as Api from '../../api';
import ErrorModalContext from '../stores/ErrorModalContext';

const Certificate = ({ isEditable, portfolioOwnerId }) => {
  const userState = useContext(UserStateContext);
  const errorModalContext = useContext(ErrorModalContext);
  const id = userState?.user?.id;
  let { state } = useLocation();
  const ThemeMode = useTheme();
  const theme = ThemeMode[0];

  if (state === null || typeof state === 'object') {
    state = id;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [arr, setArr] = useState([]);
  useEffect(() => {
    getData();
  }, [portfolioOwnerId]);

  async function getData() {
    try {
      const getRes = await Api.get(
        'certificates',
        portfolioOwnerId ? portfolioOwnerId : id
      );
      const certificateData = getRes.data;
      let dataArr = [];

      dataArr = certificateData.map((certificate) => {
        return [
          certificate.id,
          certificate.title,
          certificate.content,
          certificate.day.slice(0, 10),
        ];
      });
      setArr(dataArr);
    } catch (err) {
      errorModalContext.setModalText(
        `${err.message} // 자격증 데이터를 불러오는 과정에서 문제가 발생했습니다.`
      );
    }
  }

  return (
    <Card className="mb-2 ms-3 mr-5" id={theme === 'light' ? 'light' : 'dark'}>
      <Card.Body>
        <Card.Title>자격증</Card.Title>
        {arr.map((certificate, idx) => {
          return (
            <CertificateCard
              key={certificate}
              arr={arr}
              idx={idx}
              setArr={setArr}
              isEditable={isEditable}
            ></CertificateCard>
          );
        })}
        {isEditable && id === state && (
          <div className="mt-3 text-center mb-4 row">
            <div className="col-sm-20">
              <Button
                className="btn btn-primary toggleTarget"
                onClick={() => setIsEditing(true)}
              >
                +
              </Button>
            </div>
          </div>
        )}
        {isEditing && id === state && (
          <CertificateForm
            arr={arr}
            setArr={setArr}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          ></CertificateForm>
        )}
      </Card.Body>
    </Card>
  );
};

export default Certificate;
