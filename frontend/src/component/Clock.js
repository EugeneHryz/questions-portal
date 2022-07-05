import React from 'react';

class Clock extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            time: new Date() 
        };
    }

    componentDidMount() {
        this.timerId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    render() {
        return (<h3>
            Current time is {this.state.time.toLocaleTimeString()}
        </h3>);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    tick() {
        this.setState({ 
            time: new Date() 
        });
    }
}

export default Clock;


