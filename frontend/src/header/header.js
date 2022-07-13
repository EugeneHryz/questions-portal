import { Link } from "react-router-dom";

function Header(props) {

    return (<nav className="navbar navbar-expand-md fixed-top navbar-light app-header align-self-stretch">
        <div className="container-fluid justify-content-end">

            <a className="navbar-brand fs-2 fw-normal" href="#">AskMe</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon d-flex"/>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">

                <ul className="navbar-nav me-auto mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link active" to="/home/questions">Your questions</Link>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Your answers</a>
                    </li>
                </ul>
            </div>

            <div className="dropdown">
                <a href="#" className="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownAccount" data-bs-toggle="dropdown" aria-expanded="false">
                    Account
                </a>
                <ul className="dropdown-menu dropdown-menu-end text-small shadow" aria-labelledby="dropdownAccount">
                    <li><Link className="dropdown-item" to="/home/profile">Profile</Link></li>
                    <li><a className="dropdown-item" href="#">Delete account</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">Log out</a></li>
                </ul>
            </div>
        </div>
    </nav >);
}

export default Header; 