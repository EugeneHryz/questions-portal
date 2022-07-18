import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../app-context/appContext';
import userService from '../service/userService';
import Validation from './validation';

function SignUpForm(props) {

    const [state, setState] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',

        emailInvalidMsg: '',
        passwordInvalidMsg: '',
        confirmPasswordInvalidMsg: '',
        firstNameInvalidMsg: '',
        lastNameInvalidMsg: '',
        phoneNumberInvalidMsg: '',

        failedToRegisterMsg: ''
    });

    const navigate = useNavigate();

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        setState(prevState => {
            return { ...prevState, [name]: value };
        });
        switch (name) {
            case 'email':
                validateEmail(value);
                break;
            case 'password':
                validatePassword(value);
                break;
            case 'confirmPassword':
                validateConfirmPassword(value);
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
        }
    }

    function validateEmail(email) {
        const result = Validation.validateEmail(email);
        setState(prevState => {
            return { ...prevState, emailInvalidMsg: result.errorMsg };
        });
        return result.valid;
    }

    function validatePassword(password) {
        const result = Validation.validatePassword(password);
        setState(prevState => {
            return { ...prevState, passwordInvalidMsg: result.errorMsg };
        });
        return result.valid;
    }

    function validateConfirmPassword(confirmPassword) {
        const password = state.password;

        let isValid = false;
        let errorMsg = '';
        if (password !== confirmPassword) {
            errorMsg = "Passwords don't match";
        } else {
            isValid = true;
        }
        setState(prevState => {
            return { ...prevState, confirmPasswordInvalidMsg: errorMsg };
        });
        return isValid;
    }

    function validateName(value, errorPropertyName) {
        const result = Validation.validateName(value);
        setState(prevState => {
            return { ...prevState, [errorPropertyName]: result.errorMsg };
        });
        return result.valid;
    }

    function validatePhoneNumber(value) {
        const result = Validation.validatePhoneNumber(value);
        setState(prevState => {
            return { ...prevState, phoneNumberInvalidMsg: result.errorMsg };
        });
        return result.valid;
    }

    function handleSubmit(event, setUser) {
        const allIsValid = validateEmail(state.email)
            && validatePassword(state.password)
            && validateConfirmPassword(state.confirmPassword)
            && validateName(state.firstName, 'firstNameInvalidMsg')
            && validateName(state.lastName, 'lastNameInvalidMsg')
            && validatePhoneNumber(state.phoneNumber);
        
        if (allIsValid) {
            registerUser(setUser);
        }
        event.preventDefault();
    }

    function registerUser(setUser) {
        userService.register(state.email, state.password, 
            state.firstName, state.lastName, 
            state.phoneNumber).then((response) => {
            
            return userService.logIn(state.email, state.password);
        })
        .then((response) => {
            console.log("Successfully registered!");
            console.log(response.data);
            setState(prevState => {
                return { ...prevState, failedToRegisterMsg: '' };
            });
            const authenticatedUser = {
                id: response.data.id,
                email: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                phoneNumber: response.data.phoneNumber
            }
            setUser(authenticatedUser);
            navigate("/home");
        })
        .catch((error) => {
            console.log(error);

            let errorMsg = 'User with this email already exists';
            if (error.response.status == 400) {
                errorMsg = 'Invalid input data';
            }
            setState(prevState => {
                return { ...prevState, failedToRegisterMsg: errorMsg };
            });
        })
    }

    return (
        <AppContext.Consumer>
            {({user, setUser}) => (
            <div>
                <h1 className="mb-4 text-center app-name">Ask
                    <span className="outlined">Me</span>
                </h1>
                <div className="login-container">
                    <form id="signupForm" onSubmit={(e) => handleSubmit(e, setUser)} noValidate>
                        <h1 className="display-6 mb-3">Sign up</h1>

                        <div className="form-floating position-relative mb-3">
                            <input id="floatingEmail" type="email" className={'form-control ' +
                                (state.emailInvalidMsg ? 'is-invalid' : '')} name="email"
                                data-bs-toggle="popover" placeholder=" " value={state.email}
                                onChange={handleChange} />
                            <label htmlFor="floatingEmail">Email</label>
                            <div className="invalid-tooltip">
                                {state.emailInvalidMsg}
                            </div>
                        </div>

                        <div className="form-floating position-relative mb-3">
                            <input id="floatingPassword" type="password" className={'form-control ' +
                                (state.passwordInvalidMsg ? 'is-invalid' : '')} name="password"
                                data-bs-toggle="popover" placeholder=" " value={state.password}
                                onChange={handleChange} />
                            <label htmlFor="floatingPassword">Password</label>
                            <div className="invalid-tooltip">
                                {state.passwordInvalidMsg}
                            </div>
                        </div>

                        <div className="form-floating position-relative mb-3">
                            <input id="floatingConfirmPassword" type="password" className={'form-control ' +
                                (state.confirmPasswordInvalidMsg ? 'is-invalid' : '')} name="confirmPassword"
                                data-bs-toggle="popover" placeholder=" " value={state.confirmPassword}
                                onChange={handleChange} />
                            <label htmlFor="floatingConfirmPassword">Confirm password</label>
                            <div className="invalid-tooltip">
                                {state.confirmPasswordInvalidMsg}
                            </div>
                        </div>

                        <div className="form-floating position-relative mb-3">
                            <input id="floatingFirstName" type="text" className={'form-control ' +
                                (state.firstNameInvalidMsg ? 'is-invalid' : '')} name="firstName"
                                data-bs-toggle="popover" placeholder=" " value={state.firstName}
                                onChange={handleChange} />
                            <label htmlFor="floatingFirstName">First name</label>
                            <div className="invalid-tooltip">
                                {state.firstNameInvalidMsg}
                            </div>
                        </div>

                        <div className="form-floating position-relative mb-3">
                            <input id="floatingLastName" type="text" className={'form-control ' +
                                (state.lastNameInvalidMsg ? 'is-invalid' : '')} name="lastName"
                                data-bs-toggle="popover" placeholder=" " value={state.lastName}
                                onChange={handleChange} />
                            <label htmlFor="floatingLastName">Last name</label>
                            <div className="invalid-tooltip">
                                {state.lastNameInvalidMsg}
                            </div>
                        </div>

                        <div className="form-floating position-relative">
                            <input id="floatingPhoneNumber" type="tel" className={'form-control ' +
                                (state.phoneNumberInvalidMsg ? 'is-invalid' : '')} name="phoneNumber"
                                data-bs-toggle="popover" placeholder=" " value={state.phoneNumber}
                                onChange={handleChange} />
                            <label htmlFor="floatingPhoneNumber">Phone number</label>
                            <div className="invalid-tooltip">
                                {state.phoneNumberInvalidMsg}
                            </div>
                        </div>
                        <div className="alert alert-danger mt-2 mb-0" style={(!state.failedToRegisterMsg ?
                            { display: 'none' } : {})} role="alert">
                            {state.failedToRegisterMsg}
                        </div>

                        <button className="btn btn-secondary w-100 mt-3" type="submit" id="signUpButton">
                            Sign up
                        </button>
                        <p className="mt-2 mb-0 ps-2">Already have account?
                            <Link to="/login" className="ms-2">Log in</Link>
                        </p>
                    </form>
                </div>
            </div>)}
        </AppContext.Consumer>);
}

export default SignUpForm;