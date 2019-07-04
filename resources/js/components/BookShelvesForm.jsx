import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form } from 'react-bootstrap';

const BookShelvesForm = ({
  shelves,
  onRemoveShelfItem,
  onAddShelfItem,
  isProcessing
}) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="info" id="addToShelf">
        Add To Shelf
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {shelves.map(shelf => {
          const shelfItem = shelf.items[0];

          return (
            <Form
              key={shelf.id}
              action={`/api/shelves/${shelf.id}/items`}
              method="POST"
              data-shelf-id={shelf.id}
              onSubmit={shelfItem ? onRemoveShelfItem : onAddShelfItem}
            >
              <Dropdown.Item
                as="button"
                disabled={isProcessing}
                className="d-flex justify-content-between align-items-center"
              >
                {shelf.name}
                <i className="material-icons">
                  {shelfItem ? 'check_box' : 'check_box_outline_blank'}
                </i>
              </Dropdown.Item>
            </Form>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

BookShelvesForm.propTypes = {
  shelves: PropTypes.array.isRequired,
  onRemoveShelfItem: PropTypes.func.isRequired,
  onAddShelfItem: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired
};

export default BookShelvesForm;
