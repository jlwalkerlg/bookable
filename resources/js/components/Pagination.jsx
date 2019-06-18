import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import paginate from 'jw-paginate';

const MyPagination = ({
  totalItems,
  currentPage,
  pageSize,
  maxPages,
  url,
  className
}) => {
  const pagination = paginate(totalItems, currentPage, pageSize, maxPages);
  const { pages, totalPages } = pagination;

  return (
    <Pagination className={className}>
      {pages[0] > 1 && (
        <>
          <Pagination.Item as={Link} href={url + '1'} to={url + '1'}>
            1
          </Pagination.Item>
          <Pagination.Ellipsis disabled />
        </>
      )}
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
      {pages[pages.length - 1] < totalPages && (
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
  totalItems: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number,
  maxPages: PropTypes.number,
  url: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default MyPagination;
