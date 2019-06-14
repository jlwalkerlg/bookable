import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MyPagination = ({
  totalPages,
  limit = 5,
  currentPage,
  url,
  className
}) => {
  limit = limit < totalPages - 1 ? limit : totalPages;

  const pages = [1];
  for (let i = 2; i <= limit; i++) {
    pages.push(i);
  }

  return (
    <Pagination className={className}>
      {pages.map((page, index) => (
        <Pagination.Item
          key={index}
          as={page !== currentPage ? Link : undefined}
          href={url + page}
          to={url + page}
          active={page === currentPage}
        >
          {page}
        </Pagination.Item>
      ))}
      {limit < totalPages && (
        <>
          <Pagination.Ellipsis disabled />
          <Pagination.Item
            as={Link}
            href={url + totalPages}
            to={url + totalPages}
          >
            {totalPages}
          </Pagination.Item>
        </>
      )}
    </Pagination>
  );
};

MyPagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  limit: PropTypes.number,
  currentPage: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default MyPagination;
