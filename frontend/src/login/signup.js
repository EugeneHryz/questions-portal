import React from 'react';

class SignUpForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div>
            <h1 className="mb-2 text-center app-name">Ask
                <span className="outlined">Me</span>
            </h1>
            <div className="login-container">
                <form id="signupForm" method="post">
                    <h1 className="display-6 mb-3">Sign up</h1>

                    <div className="form-floating">
                        <input id="floatingEmail" type="email" className="form-control mb-2" name="email"
                            data-bs-toggle="popover" placeholder=" " />
                        <label htmlFor="floatingEmail">Email</label>
                    </div>

                    <div className="form-floating">
                        <input id="floatingPassword" type="password" className="form-control mb-2" name="password"
                            data-bs-toggle="popover" placeholder=" " />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>

                    <div className="form-floating">
                        <input id="floatingConfirmPassword" type="password" className="form-control mb-2" name="confirmPassword"
                            data-bs-toggle="popover" placeholder=" " />
                        <label htmlFor="floatingConfirmPassword">Confirm password</label>
                    </div>

                    <div className="form-floating">
                        <input id="floatingFirstName" type="text" className="form-control mb-2" name="firstName"
                            data-bs-toggle="popover" placeholder=" " />
                        <label htmlFor="floatingFirstName">First name</label>
                    </div>

                    <div className="form-floating">
                        <input id="floatingLastName" type="text" className="form-control mb-2" name="lastName"
                            data-bs-toggle="popover" placeholder=" " />
                        <label htmlFor="floatingLastName">Last name</label>
                    </div>

                    <div className="form-floating">
                        <input id="floatingPhoneNumber" type="tel" className="form-control" name="phoneNumber"
                            data-bs-toggle="popover" placeholder=" " />
                        <label htmlFor="floatingPhoneNumber">Phone number</label>
                    </div>

                    <button className="btn btn-secondary w-100 mt-3" type="submit" id="signUpButton">
                        Sign up
                    </button>
                </form>
            </div>
        </div>);
    }
}

export default SignUpForm;