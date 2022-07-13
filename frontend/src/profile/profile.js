import React, { useState } from "react";
import { AppContext } from "../app-context/appContext";
import Validation from "../login/validation";
import UserService from "../service/userService";

class Profile extends React.Component {
    static contextType = AppContext;

    constructor(props, context) {
        super(props);

        this.state = {
            id: context.user.id,
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
        };

        this.handleChange = this.handleChange.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validateName = this.validateName.bind(this);
        this.validateCurrentPassword = this.validateCurrentPassword.bind(this);
        this.validateNewPassword = this.validateNewPassword.bind(this);
        this.validateConfirmPassword = this.validateConfirmPassword.bind(this);
        this.validatePhoneNumber = this.validatePhoneNumber.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value });
        switch (name) {
            case 'email':
                this.validateEmail(value);
                break;
            case 'firstName':
                this.validateName(value, 'firstNameInvalidMsg');
                break;
            case 'lastName':
                this.validateName(value, 'lastNameInvalidMsg');
                break;
            case 'phoneNumber':
                this.validatePhoneNumber(value);
                break;
            case 'currentPassword':
                this.validateCurrentPassword(value);
                break;
            case 'newPassword':
                this.validateNewPassword(value);
                break;
            case 'confirmPassword':
                this.validateConfirmPassword(value);
                break;
        }
    }

    validateEmail(email) {
        const result = Validation.validateEmail(email);
        this.setState({ emailInvalidMsg: result.errorMsg });
        return result.valid;
    }

    validateName(name, errorPropertyName) {
        const result = Validation.validateName(name);
        this.setState({ [errorPropertyName]: result.errorMsg });
        return result.valid;
    }

    validateCurrentPassword(password) {
        let valid = true;
        let errorMsg = '';
        if (password.length === 0) {
            errorMsg = 'Password is required';
            valid = false;
        }
        this.setState({ currentPwInvalidMsg: errorMsg });
        return valid;
    }

    validateNewPassword(password) {
        let valid = true;
        let errorMsg = '';
        if (password.length > 0) {
            const result = Validation.validatePassword(password);

            errorMsg = result.errorMsg;
            valid = result.valid;
        }
        this.setState({ newPwInvalidMsg: errorMsg });
        return valid;
    }

    validateConfirmPassword(confirmPw) {
        const password = this.state.newPassword;
        let isValid = false;
        let errorMsg = '';
        if (password !== confirmPw) {
            errorMsg = "Passwords don't match";
        } else {
            isValid = true;
        }
        this.setState({ confirmPwInvalidMsg: errorMsg });
        return isValid;
    }

    validatePhoneNumber(phoneNumber) {
        const result = Validation.validatePhoneNumber(phoneNumber);
        this.setState({ phoneNumberInvalidMsg: result.errorMsg });
        return result.valid;
    }

    handleSubmit(event, setUser) {
        const allIsValid = this.validateEmail(this.state.email)
            && this.validateName(this.state.firstName, 'firstNameInvalidMsg')
            && this.validateName(this.state.lastName, 'lastNameInvalidMsg')
            && this.validatePhoneNumber(this.state.phoneNumber)
            && this.validateCurrentPassword(this.state.currentPassword)
            && this.validateNewPassword(this.state.newPassword)
            && this.validateConfirmPassword(this.state.confirmPassword);
        
        if (allIsValid) {
            this.updateUser(setUser);
        }
        event.preventDefault();
    }

    updateUser(setUser) {
        // const toastNotification = document.getElementById("notificationToast");
        
        // const toast = new Toast(toastNotification);
        // toast.show();

        UserService.update(this.state.id, this.state.email,
            this.state.password, this.state.firstName,
            this.state.lastName, this.state.phoneNumber).then((response) => {

            })
            .catch((error) => {

            });
    }

    render() {
        return (
            <div className="card profile-card">
                <div className="card-header">
                    Account details
                </div>
                <div className="container card-body">
                    <div className="row">
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <form id="editProfileForm" onSubmit={(e) => this.handleSubmit(e, this.context.setUser)}
                                noValidate>
                                <div className="mb-2 position-relative">
                                    <label htmlFor="firstName" className="form-label">First name</label>
                                    <input type="text" name="firstName" className={'form-control ' +
                                        (this.state.firstNameInvalidMsg.length !== 0 ? 'is-invalid' : '')} id="firstName"
                                           value={this.state.firstName} onChange={this.handleChange} />
                                    <div className="invalid-tooltip">
                                        {this.state.firstNameInvalidMsg}
                                    </div>
                                </div>

                                <div className="mb-2 position-relative">
                                    <label htmlFor="lastName" className="form-label">Last name</label>
                                    <input type="text" name="lastName" className={'form-control ' +
                                        (this.state.lastNameInvalidMsg.length !== 0 ? 'is-invalid' : '')} id="lastName"
                                           value={this.state.lastName} onChange={this.handleChange} />
                                    <div className="invalid-tooltip">
                                        {this.state.lastNameInvalidMsg}
                                    </div>
                                </div>

                                <div className="mb-2 position-relative">
                                    <label htmlFor="email" className="form-label">Email address
                                        <span className="text-danger"> *</span>
                                    </label>
                                    <input type="email" name="email" className={'form-control ' +
                                        (this.state.emailInvalidMsg.length !== 0 ? 'is-invalid' : '')} id="email"
                                           value={this.state.email} onChange={this.handleChange} />
                                    <div className="invalid-tooltip">
                                        {this.state.emailInvalidMsg}
                                    </div>
                                </div>

                                <div className="mb-2 position-relative">
                                    <label htmlFor="phoneNumber" className="form-label">Phone number</label>
                                    <input type="text" name="phoneNumber" className={'form-control ' +
                                        (this.state.phoneNumberInvalidMsg.length !== 0 ? 'is-invalid' : '')} id="phoneNumber"
                                           value={this.state.phoneNumber} onChange={this.handleChange} />
                                    <div className="invalid-tooltip">
                                        {this.state.phoneNumberInvalidMsg}
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
                                    (this.state.currentPwInvalidMsg.length !== 0 ? 'is-invalid' : '')} id="currentPassword"
                                       value={this.state.currentPassword} onChange={this.handleChange} form="editProfileForm"/>
                                <div className="invalid-tooltip">
                                    {this.state.currentPwInvalidMsg}
                                </div>
                            </div>

                            <div className="mb-2 position-relative">
                                <label htmlFor="newPassword" className="form-label">New password</label>
                                <input type="password" name="newPassword" className={'form-control ' +
                                    (this.state.newPwInvalidMsg.length !== 0 ? 'is-invalid' : '')} id="newPassword"
                                       value={this.state.newPassword} onChange={this.handleChange} form="editProfileForm"/>
                                <div className="invalid-tooltip">
                                    {this.state.newPwInvalidMsg}
                                </div>
                            </div>

                            <div className="mb-2 position-relative">
                                <label htmlFor="confirmPassword" className="form-label">Confirm new password</label>
                                <input type="password" name="confirmPassword" className={'form-control ' +
                                    (this.state.confirmPwInvalidMsg.length !== 0 ? 'is-invalid' : '')} id="confirmPassword"
                                       value={this.state.confirmPassword} onChange={this.handleChange} form="editProfileForm"/>
                                <div className="invalid-tooltip">
                                    {this.state.confirmPwInvalidMsg}
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
                    <div id="notificationToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-header">
                            <strong className="me-auto">Notification</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"/>
                        </div>
                        <div className="toast-body">
                            {this.state.updateProfileResultMsg}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;