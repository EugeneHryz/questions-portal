import React from 'react';
import { Link } from 'react-router-dom';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <h1 className="mb-2 text-center app-name">Ask
                <span className="outlined">Me</span>
            </h1>
            <div className="login-container">
                <form id="loginForm" method="post">
                    <h1 className="display-6 mb-3">Log in</h1>

                    <div className="form-floating mb-2">
                        <input id="floatingEmail" type="email" className="form-control" name="email"
                            data-bs-toggle="popover" placeholder=" " />
                        <label htmlFor="floatingEmail">Email</label>
                    </div>

                    <div className="form-floating">
                        <input id="floatingPassword" type="password" className="form-control" name="password"
                            data-bs-toggle="popover" placeholder=" " />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <button className="btn btn-primary w-100 mt-3" type="submit" id="loginButton">
                        Log in
                    </button>
                </form>
                <p className="mt-2 mb-0 ps-2">Don't have an account?
                    <Link to="/signup" className="ms-2">Sign up</Link>
                </p>
            </div>
        </div>);
    }
}

export default LoginForm;