import { Modal } from "bootstrap";
import { useEffect, useRef } from "react";

function ConfirmDialog(props) {

    const modalRef = useRef();
    
    useEffect(() => {
        const modal = Modal.getOrCreateInstance(modalRef.current);
        if (props.show) {
            modal.show();
        }
        const hiddenListener = function () {
            props.onDismiss();
        };
        modalRef.current.addEventListener('hidden.bs.modal', hiddenListener);

        return () => {
            if (modalRef.current) {
                modalRef.current.removeEventListener('hidden.bs.modal', hiddenListener);
            }
        };
    }, [props.show]);

    return (
        <div className="modal fade" id="confirmationModal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true"
            ref={modalRef}>
            <div className="modal-dialog modal-sm modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalHeader">{props.title}</h5>
                        <button type="button" className="btn-close" onClick={() => props.onResult(false)}
                            data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-grey" data-bs-dismiss="modal">{props.cancelBtn}</button>
                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" 
                            onClick={() => props.onResult(true)}>
                            {props.actionBtn}
                        </button>
                    </div>
                </div>
            </div>
        </div>);
}

export default ConfirmDialog;