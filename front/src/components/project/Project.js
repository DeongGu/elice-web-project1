import React, { useState, useEffect, useContext } from 'react';
import * as Api from '../../api';

import ErrorModalContext from '../stores/ErrorModalContext';

import ProjectCard from './ProjectCard';
import ProjectForm from './ProjectForm';
import ProjectEditForm from './ProjectEditForm';

import { Card, Button } from 'react-bootstrap';
import { useTheme } from '../stores/themeProvider';
import '../../../src/styles/index.css';

const Project = ({ portfolioOwnerId, isEditable }) => {
  const errorModalContext = useContext(ErrorModalContext);

  const USER_ENDPOINT = 'users';
  const DATA_ENDPOINT = 'projects';

  const ThemeMode = useTheme();
  const theme = ThemeMode[0];

  const [projectData, setProjectData] = useState([]);
  const [editIdList, setEditIdList] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const getUserInfo = async (userEndpoint, portfolioOwnerId) => {
    try {
      const getUser = await Api.get(userEndpoint, portfolioOwnerId);
      const userInfo = { ...getUser.data };

      if (!userInfo.id) {
        throw new Error('프로젝트 유저 데이터에 문제가 발생했습니다.');
      }

      return userInfo;
    } catch (err) {
      errorModalContext.setModalText(
        `${err.message} // 프로젝트 유저 데이터를 불러오는 과정에서 문제가 발생했습니다.`
      );
    }
  };

  const getFetchedData = async (dataEndpoint, userId) => {
    try {
      const getData = await Api.get(dataEndpoint, userId);
      const fetchedData = [...getData.data];

      return fetchedData;
    } catch (err) {
      errorModalContext.setModalText(
        `${err.message} // 프로젝트 데이터를 불러오는 과정에서 문제가 발생했습니다.`
      );

      if (err.message.includes('iterable')) {
        errorModalContext.setModalText(
          `${err.message} // 프로젝트 데이터에 문제가 발생했습니다.`
        );
      }

      const fetchedData = [];
      return fetchedData;
    }
  };

  const callFetch = async () => {
    const userInfo = await getUserInfo(USER_ENDPOINT, portfolioOwnerId);
    const fetchedData = await getFetchedData(DATA_ENDPOINT, userInfo.id);

    setProjectData(fetchedData);
  };

  useEffect(() => {
    callFetch();
  }, [portfolioOwnerId]);

  return (
    <React.Fragment>
      <Card
        className="mb-2 ms-3 mr-5"
        id={theme === 'light' ? 'light' : 'dark'}
      >
        <Card.Body>
          <Card.Title>프로젝트</Card.Title>
          {projectData.map((project) =>
            editIdList.includes(project.id) ? (
              <ProjectEditForm
                key={project.id}
                project={project}
                callFetch={callFetch}
                editIdList={editIdList}
                setEditIdList={setEditIdList}
              />
            ) : (
              <ProjectCard
                key={project.id}
                project={project}
                callFetch={callFetch}
                isEditable={isEditable}
                editIdList={editIdList}
                setEditIdList={setEditIdList}
              />
            )
          )}
          {isEditable && (
            <div className="mt-3 text-center mb-4 row">
              <div className="col-sm-20">
                <Button
                  className="btn btn-primary toggleTarget"
                  onClick={() => {
                    setIsAdding(true);
                  }}
                >
                  +
                </Button>
              </div>
            </div>
          )}
          {isAdding && (
            <ProjectForm
              callFetch={callFetch}
              setIsAdding={setIsAdding}
              isAdding={isAdding}
            />
          )}
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default Project;
