import { Card } from 'react-bootstrap';
import React, { useState, useContext, useEffect } from 'react';
import EducationForm from './EducationForm';
import EducationCard from './EducationCard';
import { UserStateContext } from '../../App';
import * as Api from '../../api';
import { useTheme } from '../stores/themeProvider';
import '../../../src/styles/index.css';

const Education = ({ isEditable, portfolioOwnerId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const ThemeMode = useTheme();
  const theme = ThemeMode[0];
  const toggleAddEducationForm = () => {
    setIsAdding(!isAdding);
  };
  const [educations, setEducations] = useState([]);
  const userState = useContext(UserStateContext);
  let educationid = '';

  if (userState?.user) {
    educationid = userState.user.id ? userState.user.id : null;
  }

  const confirmAddEducation = (targetEducation) => {
    const resultEducations = [...educations, targetEducation];
    setEducations([...resultEducations]);
    setIsAdding(false);
    setIsAdding(true);
  };

  const cancelAddEducation = () => {
    setIsAdding(false);
  };

  useEffect(() => {
    Api.get(
      'educations',
      portfolioOwnerId ? portfolioOwnerId : educationid
    ).then((res) => setEducations(res.data));
  }, [portfolioOwnerId]);

  return (
    <Card className="mb-2 ms-3 mr-5 " id={theme == 'light' ? 'light' : 'dark'}>
      <Card.Body>
        <Card.Title>학력</Card.Title>
        <EducationCard
          educations={educations}
          setEducations={setEducations}
          isEditable={isEditable}
        />
        {isEditable
          ? educationid === portfolioOwnerId && (
              <div className="mt-3 text-center mb-4 row">
                <div className="col-sm-20">
                  <button
                    className="btn btn-primary toggleTarget btn btn-primary"
                    onClick={toggleAddEducationForm}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          : null}
        <div>
          {isAdding
            ? educationid === portfolioOwnerId && (
                <EducationForm
                  onConfirm={confirmAddEducation}
                  onCancel={cancelAddEducation}
                  education={{
                    id: null,
                    school: '',
                    major: '',
                    position: '재학중',
                  }}
                />
              )
            : null}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Education;
