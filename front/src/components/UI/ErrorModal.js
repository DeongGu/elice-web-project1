import { useContext } from 'react';
import ErrorModalContext from '../stores/ErrorModalContext';
import { Button, Modal } from 'react-bootstrap';
import '../../styles/modal.css';

const ErrorModal = () => {
  const errorModalContext = useContext(ErrorModalContext);

  const errorModalCheck = () => {
    errorModalContext.setModalText('');
  };

  return (
    <div className="modal-background">
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>사이트가 많이 아파요...</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ width: '40rem' }}>
          {errorModalContext.modalText.split('//').map((text) => (
            <p key={text}>{text}</p>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button className="modal-button" onClick={errorModalCheck}>
            그렇군요...
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
};

export default ErrorModal;
