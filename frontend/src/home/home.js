import { Modal } from 'bootstrap';
import React, { useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from '../app-context/appContext';
import Header from '../header/header';
import userService from '../service/userService';

function HomePage(props) {

    const modalRef = useRef();
    const showModal = () => {
        const modal = Modal.getOrCreateInstance(modalRef.current);
        modal.show();
    };
    const hideModal = () => {
        const modal = Modal.getOrCreateInstance(modalRef.current);
        modal.hide();
    }
    const [state, setState] = useState({
        showModal: showModal,
        hideModal: hideModal,

        password: '',
        passwordInvalidMsg: '',
        failedToDeleteMsg: ''
    });
    const navigate = useNavigate();

    function handleChange(e) {
        const value = e.target.value;
        setState(prevState => { 
            return { ...prevState, password: value };
        });
        
        validatePassword(value);
    }

    function validatePassword(password) {
        let errorMsg = '';
        let isValid = false;
        if (!password) {
            errorMsg = 'Password is required';
        } else {
            isValid = true;
        }
        setState(prevState => {
            return { ...prevState, passwordInvalidMsg: errorMsg };
        });
        return isValid;
    }

    function handleSubmit(e, userId, setUser) {
        if (validatePassword(state.password)) {
            deleteAccount(userId, setUser);
        }

        e.preventDefault();
    }

    function deleteAccount(userId, setUser) {
        userService.deleteUserAccount(userId, state.password).then((response) => {
            console.log("User account deleted");
            setUser(null);
            state.hideModal();
            navigate("/signup");
        })
        .catch((error) => {
            const errorMsg = 'Unable to delete user account';
            setState(prevState => {
                return { ...prevState, failedToDeleteMsg: errorMsg };
            });
        })
    }

    return (<div className="home-page">
        <Header showModal={state.showModal} />
        <Outlet />

        <AppContext.Consumer>
            {({ user, setUser }) => (
                <div className="modal fade delete-account-modal" id="confirmationModal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true"
                    ref={modalRef}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modalHeader">Delete account?</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(e) => handleSubmit(e, user.id, setUser)} noValidate>
                                    <div className="mb-3 position-relative">
                                        <label htmlFor="password" className="form-label">Enter your password
                                            <span className="text-danger"> *</span>
                                        </label>
                                        <input type="password" className={'form-control ' +
                                            (state.passwordInvalidMsg ? 'is-invalid' : '')} id="password"
                                            value={state.password} onChange={handleChange} />
                                        <div className="invalid-tooltip">
                                            {state.passwordInvalidMsg}
                                        </div>
                                    </div>
                                    <div className="alert alert-danger mb-2" style={(!state.failedToDeleteMsg ?
                                        { display: 'none' } : {})} role="alert">
                                        {state.failedToDeleteMsg}
                                    </div>
                                    <button className="btn btn-danger" type="submit">Delete</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>)}
        </AppContext.Consumer>
    </div>);
}

export default HomePage;