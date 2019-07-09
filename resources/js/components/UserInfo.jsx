import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const UserInfo = ({ user, totalRatings, totalReviews }) => {
  return (
    <>
      <div>
        <h2 className="h5">Statistics</h2>
        <p className="m-0">Books rated: {totalRatings}</p>
        <p className="m-0">Books reviewed: {totalReviews}</p>
      </div>

      <div className="mt-4">
        <h2 className="h5">Links</h2>
        <ul className="list-unstyled">
          <li>
            <Link to={`/users/${user.id}/ratings`} className="default">
              Ratings
            </Link>
          </li>
          <li>
            <Link to={`/users/${user.id}/shelves`} className="default">
              Reviews
            </Link>
          </li>
          <li>
            <Link to={`/users/${user.id}/shelves`} className="default">
              Shelves
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

UserInfo.propTypes = {
  user: PropTypes.object.isRequired,
  totalRatings: PropTypes.number.isRequired,
  totalReviews: PropTypes.number.isRequired
};

export default UserInfo;
