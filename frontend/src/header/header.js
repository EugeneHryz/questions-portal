import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import userService from "../service/userService";

function Header(props) {

    const location = useLocation();
    const navigate = useNavigate();
    const [activeNavItem, setActiveNavItem] = useState('questions');

    useEffect(() => {
        if (location.pathname.includes('/answers')) {
            setActiveNavItem('answers');
        } else {
            setActiveNavItem('questions');
        }
    }, [location]);

    function logOut() {
        userService.logOut().then((response) => {
            console.log("Log out successful");
            navigate("/login");
        }).catch((error) => {
            console.log(error);
        })
    }

    function handleAccountDelete() {
        props.showModal();
    }

    return (<nav className="navbar navbar-expand-md navbar-light fixed-top app-header align-self-stretch">
        <div className="container-fluid">

            <Link className="navbar-brand fs-2 fw-normal" to="/home">AskMe</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon d-flex" />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">

                <ul className="navbar-nav me-auto mb-lg-0">
                    <li className="nav-item">
                        <Link className={'nav-link ' + (activeNavItem === 'questions' ? 'active' : '')}
                            to="/home/questions">Your questions</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={'nav-link ' + (activeNavItem === 'answers' ? 'active' : '')}
                            to="/home/answers">Your answers</Link>
                    </li>
                </ul>

                <ul className="navbar-nav">
                    <li className="nav-item dropdown">
                        <button className="dropdown-toggle-text dropdown-toggle" id="dropdownAccount" data-bs-toggle="dropdown" aria-expanded="false">
                            Account
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end text-small shadow" aria-labelledby="dropdownAccount">
                            <li><Link className="dropdown-item" to="/home/profile">Profile</Link></li>
                            <li><button className="dropdown-item" onClick={handleAccountDelete}>Delete account</button></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" onClick={logOut}>Log out</button></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav >);
}

export default Header; 