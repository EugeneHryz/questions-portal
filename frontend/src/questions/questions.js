import { Pagination } from "@mui/material";
import React from "react";

class YourQuestions extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            pageCount: undefined,
            currentPage: 1
        }
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    handlePageChange(e, value) {
        this.setState({ currentPage: value });
    }

    componentDidMount() {
    }

    render() {
        return (<div className="card questions-page">
            <div className="card-header d-flex justify-content-between align-self-stretch">
                Your questions
                <button className="btn btn-secondary align-self-end">
                    <i className="fa-solid fa-plus"></i> Create
                </button>
            </div>
            <div className="card-body">
            </div>
            <div className="card-body">
                <Pagination count={20} page={this.state.currentPage} onChange={this.handlePageChange} shape="rounded" />
            </div>
        </div>);
    }
}

export default YourQuestions;