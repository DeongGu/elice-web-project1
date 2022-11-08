import React, { useState, useRef, useEffect } from 'react';
import { Col, Button, Overlay, Tooltip } from 'react-bootstrap';
import '../../styles/tooltip.css';

const DeleteButton = ({ educationid, onRemove }) => {
  const [isConfirm, setConfirm] = useState(false);
  const target = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfirm(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isConfirm]);

  const checkDelete = async (id) => {
    if (isConfirm) {
      await onRemove(id);
    }

    setConfirm(true);
  };

  return (
    <Col className="col-lg-1">
      <Button
        variant="outline-danger"
        size="sm"
        className="mr-3 btn-sm toggleTarget"
        ref={target}
        onClick={() => checkDelete(educationid)}
      >
        삭제
      </Button>

      <Overlay target={target.current} show={isConfirm} placement="left">
        <Tooltip className="red-tooltip">정말 삭제하시겠습니까?</Tooltip>
      </Overlay>
    </Col>
  );
};

export default DeleteButton;
