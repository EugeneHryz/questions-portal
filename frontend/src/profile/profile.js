import { Toast } from "bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../app-context/appContext";
import Validation from "../login/validation";
import userService from "../service/userService";

function Profile(props) {

    const context = useContext(AppContext);
    const [state, setState] = useState({
        userId: context.user.id,
        email: context.user.email,
        firstName: context.user.firstName,
        lastName: context.user.lastName,
        phoneNumber: context.user.phoneNumber,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',

        emailInvalidMsg: '',
        firstNameInvalidMsg: '',
        lastNameInvalidMsg: '',
        phoneNumberInvalidMsg: '',
        currentPwInvalidMsg: '',
        newPwInvalidMsg: '',
        confirmPwInvalidMsg: '',
        updateProfileResultMsg: ''
    });

    const toastRef = React.createRef();

    useEffect(() => {
        if (state.updateProfileResultMsg) {
            // show toast notification
            const toastDomElmnt = toastRef.current;
            const toast = Toast.getOrCreateInstance(toastDomElmnt);
            toast.show();
        }
    }, [state.updateProfileResultMsg]);

    useEffect(() => {
        setState(prevState => {
            return {
                ...prevState,
                userId: context.user.id,
                email: context.user.email,
                firstName: context.user.firstName,
                lastName: context.user.lastName,
                phoneNumber: context.user.phoneNumber
            };
        })
    }, [context])

    function handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        setState(prevState => {
            return { ...prevState, [name]: value };
        });
        switch (name) {
            case 'email':
                validateEmail(value);
                break;
            case 'firstName':
                validateName(value, 'firstNameInvalidMsg');
                break;
            case 'lastName':
                validateName(value, 'lastNameInvalidMsg');
                break;
            case 'phoneNumber':
                validatePhoneNumber(value);
                break;
            case 'currentPassword':
                validateCurrentPassword(value);
                break;
            case 'newPassword':
                validateNewPassword(value);
                break;
            case 'confirmPassword':
                validateConfirmPassword(value);
                break;
        }
    }

    function validateEmail(email) {
        const result = Validation.validateEmail(email);
        setState(prevState => {
            return { ...prevState, emailInvalidMsg: result.errorMsg };
        });
        return result.valid;
    }

    function validateName(name, errorPropertyName) {
        const result = Validation.validateName(name);
        setState(prevState => {
            return { ...prevState, [errorPropertyName]: result.errorMsg };
        });
        return result.valid;
    }

    function validateCurrentPassword(password) {
        let valid = true;
        let errorMsg = '';
        if (password.length === 0) {
            errorMsg = 'Password is required';
            valid = false;
        }
        setState(prevState => {
            return { ...prevState, currentPwInvalidMsg: errorMsg };
        });
        return valid;
    }

    function validateNewPassword(password) {
        let valid = true;
        let errorMsg = '';
        if (password.length > 0) {
            const result = Validation.validatePassword(password);

            errorMsg = result.errorMsg;
            valid = result.valid;
        }
        setState(prevState => {
            return { ...prevState, newPwInvalidMsg: errorMsg };
        });
        return valid;
    }

    function validateConfirmPassword(confirmPw) {
        const password = state.newPassword;
        let isValid = false;
        let errorMsg = '';
        if (password !== confirmPw) {
            errorMsg = "Passwords don't match";
        } else {
            isValid = true;
        }
        setState(prevState => {
            return { ...prevState, confirmPwInvalidMsg: errorMsg };
        });
        return isValid;
    }

    function validatePhoneNumber(phoneNumber) {
        const result = Validation.validatePhoneNumber(phoneNumber);
        setState(prevState => {
            return { ...prevState, phoneNumberInvalidMsg: result.errorMsg };
        });
        return result.valid;
    }

    function handleSubmit(event, setUser) {
        const allIsValid = validateEmail(state.email)
            && validateName(state.firstName, 'firstNameInvalidMsg')
            && validateName(state.lastName, 'lastNameInvalidMsg')
            && validatePhoneNumber(state.phoneNumber)
            && validateCurrentPassword(state.currentPassword)
            && validateNewPassword(state.newPassword)
            && validateConfirmPassword(state.confirmPassword);
        
        if (allIsValid) {
            updateUser(setUser);
        }
        event.preventDefault();
    }

    function updateUser(setUser) {
        setState(prevState => {
            return { ...prevState, updateProfileResultMsg: ''};
        });
        userService.update(state.userId, state.email,
            state.currentPassword, state.firstName,
            state.lastName, state.phoneNumber).then((response) => {
                console.log("User updated successfully!");
                const successMsg = "Profile updated successfully!";
                
                const updatedUser = {
                    email: response.data.email,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    phoneNumber: response.data.phoneNumber,
                    currentPassword: ''
                };
                setState(prevState => {
                    return { ...prevState, updateProfileResultMsg: successMsg, ...updatedUser };
                });
                setUser(updatedUser);
            })
            .catch((error) => {
                console.log(error);

                const errorMsg = "Unable to update user profile";
                setState(prevState => {
                    return { ...prevState, updateProfileResultMsg: errorMsg };
                });
            });
    }

    return (
        <div className="card profile-card">
            <div className="card-header">
                Account details
            </div>
            <div className="container card-body">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <form id="editProfileForm" onSubmit={(e) => handleSubmit(e, context.setUser)}
                            noValidate>
                            <div className="mb-2 position-relative">
                                <label htmlFor="firstName" className="form-label">First name</label>
                                <input type="text" name="firstName" className={'form-control ' +
                                    (state.firstNameInvalidMsg ? 'is-invalid' : '')} id="firstName"
                                    value={state.firstName} onChange={handleChange} />
                                <div className="invalid-tooltip">
                                    {state.firstNameInvalidMsg}
                                </div>
                            </div>

                            <div className="mb-2 position-relative">
                                <label htmlFor="lastName" className="form-label">Last name</label>
                                <input type="text" name="lastName" className={'form-control ' +
                                    (state.lastNameInvalidMsg ? 'is-invalid' : '')} id="lastName"
                                    value={state.lastName} onChange={handleChange} />
                                <div className="invalid-tooltip">
                                    {state.lastNameInvalidMsg}
                                </div>
                            </div>

                            <div className="mb-2 position-relative">
                                <label htmlFor="email" className="form-label">Email address
                                    <span className="text-danger"> *</span>
                                </label>
                                <input type="email" name="email" className={'form-control ' +
                                    (state.emailInvalidMsg ? 'is-invalid' : '')} id="email"
                                    value={state.email} onChange={handleChange} />
                                <div className="invalid-tooltip">
                                    {state.emailInvalidMsg}
                                </div>
                            </div>

                            <div className="mb-2 position-relative">
                                <label htmlFor="phoneNumber" className="form-label">Phone number</label>
                                <input type="text" name="phoneNumber" className={'form-control ' +
                                    (state.phoneNumberInvalidMsg ? 'is-invalid' : '')} id="phoneNumber"
                                    value={state.phoneNumber} onChange={handleChange} />
                                <div className="invalid-tooltip">
                                    {state.phoneNumberInvalidMsg}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="mb-2 position-relative">
                            <label htmlFor="currentPassword" className="form-label">Current password
                                <span className="text-danger"> *</span>
                            </label>
                            <input type="password" name="currentPassword" className={'form-control ' +
                                (state.currentPwInvalidMsg ? 'is-invalid' : '')} id="currentPassword"
                                value={state.currentPassword} onChange={handleChange} form="editProfileForm" />
                            <div className="invalid-tooltip">
                                {state.currentPwInvalidMsg}
                            </div>
                        </div>

                        <div className="mb-2 position-relative">
                            <label htmlFor="newPassword" className="form-label">New password</label>
                            <input type="password" name="newPassword" className={'form-control ' +
                                (state.newPwInvalidMsg ? 'is-invalid' : '')} id="newPassword"
                                value={state.newPassword} onChange={handleChange} form="editProfileForm" />
                            <div className="invalid-tooltip">
                                {state.newPwInvalidMsg}
                            </div>
                        </div>

                        <div className="mb-2 position-relative">
                            <label htmlFor="confirmPassword" className="form-label">Confirm new password</label>
                            <input type="password" name="confirmPassword" className={'form-control ' +
                                (state.confirmPwInvalidMsg ? 'is-invalid' : '')} id="confirmPassword"
                                value={state.confirmPassword} onChange={handleChange} form="editProfileForm" />
                            <div className="invalid-tooltip">
                                {state.confirmPwInvalidMsg}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="row mt-3">
                    <div className="col">
                        <button type="submit" form="editProfileForm" className="btn btn-secondary px-4">Save</button>
                    </div>
                </div>
            </div>
            <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div id="notificationToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true"
                    ref={toastRef}>
                    <div className="toast-header">
                        <strong className="me-auto">Notification</strong>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" />
                    </div>
                    <div className="toast-body">
                        {state.updateProfileResultMsg}
                    </div>
                </div>
            </div>
        </div>);
}

export default Profile;