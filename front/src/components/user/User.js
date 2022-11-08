import React, { useState, useEffect, useContext } from 'react';
import UserEditForm from './UserEditForm';
import UserCard from './UserCard';
import { UserStateContext } from '../../App';
import * as Api from '../../api';

function User({ portfolioOwnerId, isEditable, setIsEditable }) {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const me = useContext(UserStateContext);

  useEffect(() => {
    Api.get('users', portfolioOwnerId).then((res) => setUser(res.data));
  }, [portfolioOwnerId]);

  useEffect(() => {
    if (user !== null && me !== null) {
      if (user.id !== me.user.id) {
        const recentlyViewUserPortfolioObj = { name: user.name, id: user.id };
        let recentlyViewUserPortfolio = JSON.parse(
          localStorage.getItem(me.user.id) ?? '[]'
        );

        recentlyViewUserPortfolio = recentlyViewUserPortfolio.filter(
          (targetObj) =>
            targetObj.name !== recentlyViewUserPortfolioObj.name &&
            targetObj.id !== recentlyViewUserPortfolioObj.id
        );

        recentlyViewUserPortfolio.unshift(recentlyViewUserPortfolioObj);

        if (recentlyViewUserPortfolio.length > 5) {
          recentlyViewUserPortfolio.pop();
        }

        localStorage.setItem(
          me.user.id,
          JSON.stringify(recentlyViewUserPortfolio)
        );
      }
    }
  }, [user]);

  return (
    <React.Fragment>
      {isEditing ? (
        <UserEditForm
          user={user}
          setIsEditing={setIsEditing}
          setUser={setUser}
        />
      ) : (
        <UserCard
          user={user}
          setIsEditing={setIsEditing}
          setIsEditable={setIsEditable}
          isEditable={isEditable}
          portfolioOwnerId={portfolioOwnerId}
        />
      )}
    </React.Fragment>
  );
}

export default User;
