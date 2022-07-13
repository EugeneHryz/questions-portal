import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../service/userService';
import { useState } from 'react';
import { AppContext } from '../app-context/appContext';
import Validation from './validation';

function LoginForm(props) {

    const [state, setState] = useState({
        email: '',
        password: '',

        emailInvalidMsg: '',
        credentialsInvalidMsg: ''
    });
    const navigate = useNavigate();

    function handleChange(event) {
        const name = event.target.name;
        const newValue = event.target.value;
        setState(prevState => {
            return { ...prevState, [name]: newValue };
        });

        if (name === 'email') {
            validateEmail(newValue);
        }
    }

    function validateEmail(email) {
        const result = Validation.validateEmail(email);
        setState(prevState => {
            return { ...prevState, emailInvalidMsg: result.errorMsg };
        });
        return result.valid;
    }

    function handleSubmit(event, setUser) {
        if (validateEmail(state.email)) {
            authenticateUser(setUser);
        }
        event.preventDefault();
    }

    function authenticateUser(setUser) {
        UserService.logIn(state.email, state.password).then((response) => {

            setState(prevState => {
                return { ...prevState, credentialsInvalidMsg: '' };
            });
            console.log("Successfully authenticated!");
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
            const errorMsg = 'Invalid username or password';
            setState(prevState => {
                return { ...prevState, credentialsInvalidMsg: errorMsg };
            });
        });
    }

    return (
        <AppContext.Consumer>
            {({ user, setUser }) => (
                <div className="login-content">
                    <h1 className="mb-4 text-center app-name">Ask
                        <span className="outlined">Me</span>
                    </h1>
                    <div className="login-container">
                        <form id="loginForm" className="needs-validation" noValidate
                            onSubmit={(e) => handleSubmit(e, setUser)}>
                            <h1 className="display-6 mb-3">Log in</h1>

                            <div className="form-floating position-relative mb-3">
                                <input id="floatingEmail" type="email" className={'form-control ' +
                                    (state.emailInvalidMsg.length !== 0 ? 'is-invalid' : '')} name="email"
                                    data-bs-toggle="popover tooltip" data-bs-placement="right" placeholder=" " required
                                    value={state.email} onChange={handleChange} />
                                <label htmlFor="floatingEmail">Email</label>
                                <div className="invalid-tooltip">
                                    {state.emailInvalidMsg}
                                </div>
                            </div>

                            <div className="form-floating position-relative">
                                <input id="floatingPassword" type="password" className="form-control" name="password"
                                    data-bs-toggle="popover" placeholder=" "
                                    value={state.password} onChange={handleChange} />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            <div className="alert alert-danger mt-2 mb-0" style={(state.credentialsInvalidMsg.length === 0 ? 
                            { display: 'none' } : {})} role="alert">
                                {state.credentialsInvalidMsg}
                            </div>
                            <button className="btn btn-primary w-100 mt-3" type="submit" id="loginButton">
                                Log in
                            </button>
                        </form>
                        <p className="mt-2 mb-0 ps-2">Don't have account?
                            <Link to="/signup" className="ms-2">Sign up</Link>
                        </p>
                    </div>
                </div>
            )}
        </AppContext.Consumer>);
}

export default LoginForm;