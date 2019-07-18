import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import sanitize from '../utils/sanitize';

const Truncate = ({ text, length, html, ending, btnClassName, ...props }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  const full = html ? sanitize.sanitize(html) : text || '';

  if (full.length <= length)
    return (
      <p
        {...props}
        dangerouslySetInnerHTML={html ? { __html: full } : undefined}
      >
        {html ? undefined : full}
      </p>
    );

  const truncated = html
    ? sanitize.sanitize(html.slice(0, length))
    : text.slice(0, length);

  return (
    <p {...props}>
      <span
        dangerouslySetInnerHTML={
          html ? { __html: expanded ? full : truncated } : undefined
        }
      >
        {html ? undefined : expanded ? full : truncated}
      </span>{' '}
      <Button
        variant="link"
        className={`p-0 align-baseline ${btnClassName || ''}`}
        onClick={toggleExpanded}
      >
        {ending || '...more'}
      </Button>
    </p>
  );
};

export default Truncate;
