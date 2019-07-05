import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

const ShelvesList = ({ user, shelves }) => {
  return (
    <>
      <h2 className="h5 text-uppercase">{user.name}&apos;s Bookshelves</h2>

      {/* Desktop */}
      <ul className="list-unstyled text-secondary d-none d-md-block">
        <li>
          <NavLink
            className="sub-nav-link"
            to={`/users/${user.id}/shelves`}
            exact
          >
            All
          </NavLink>
        </li>
        {shelves.map(shelf => (
          <li key={shelf.id}>
            <NavLink
              className="sub-nav-link"
              to={`/users/${user.id}/shelves/${shelf.id}`}
              exact
            >
              {shelf.name}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Mobile */}
      <Dropdown className="d-block d-md-none w-100">
        <Dropdown.Toggle variant="info" id="addToShelf">
          Select a shelf
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            as={NavLink}
            to={`/users/${user.id}/shelves`}
            exact
            className="d-flex justify-content-between align-items-center"
          >
            All
          </Dropdown.Item>
          {shelves.map(shelf => (
            <Dropdown.Item
              key={shelf.id}
              as={NavLink}
              to={`/users/${user.id}/shelves/${shelf.id}`}
              exact
              className="d-flex justify-content-between align-items-center"
            >
              {shelf.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

ShelvesList.propTypes = {
  user: PropTypes.object.isRequired,
  shelves: PropTypes.array.isRequired
};

export default ShelvesList;
