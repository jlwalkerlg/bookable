import React from 'react';
import PropTypes from 'prop-types';
import BPagination from 'react-bootstrap/Pagination';
import { Link } from 'react-router-dom';
import paginate from 'jw-paginate';

const Pagination = ({
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
    <BPagination className={className}>
      {pages[0] > 1 && (
        <>
          <BPagination.Item as={Link} href={url + '1'} to={url + '1'}>
            1
          </BPagination.Item>
          <BPagination.Ellipsis disabled />
        </>
      )}
      {pages.map((page, index) => (
        <BPagination.Item
          key={index}
          as={page !== currentPage ? Link : undefined}
          href={url + page}
          to={url + page}
          active={page === currentPage}
        >
          {page}
        </BPagination.Item>
      ))}
      {pages[pages.length - 1] < totalPages && (
        <>
          <BPagination.Ellipsis disabled />
          <BPagination.Item
            as={Link}
            href={url + totalPages}
            to={url + totalPages}
          >
            {totalPages}
          </BPagination.Item>
        </>
      )}
    </BPagination>
  );
};

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number,
  maxPages: PropTypes.number,
  url: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default Pagination;
