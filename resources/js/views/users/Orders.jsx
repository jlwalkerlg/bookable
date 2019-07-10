import React from 'react';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import Order from '../../components/Order';

const Orders = ({
  isLoading,
  error,
  transactions,
  count,
  page,
  limit,
  pathname
}) => {
  if (isLoading) return <Loading />;

  if (error) return <p>Something went wrong: {error.message}.</p>;

  return (
    <>
      <ul className="list-unstyled">
        {transactions.map(transaction => {
          return <Order key={transaction.id} transaction={transaction} />;
        })}
      </ul>

      <Pagination
        totalItems={count}
        currentPage={page}
        pageSize={limit}
        maxPages={5}
        url={`${pathname}?page=`}
        className="mt-3 justify-content-center pagination-warning"
      />
    </>
  );
};

export default Orders;
