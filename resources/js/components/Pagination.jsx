import React from 'react';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MyPagination = ({ totalPages, limit, currentPage, url, className }) => {
  limit = limit || 5;
  limit = limit < totalPages - 1 ? limit : totalPages;

  const pages = [];
  for (let i = 1; i <= limit; i++) {
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

export default MyPagination;