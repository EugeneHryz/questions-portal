import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/header';

class HomePage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="home-page">
            <Header />
            <Outlet />
        </div>);
    }
}

export default HomePage;