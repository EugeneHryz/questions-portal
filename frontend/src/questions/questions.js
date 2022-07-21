import { Pagination, PaginationItem } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import questionService from "../service/questionService";
import { AppContext } from "../app-context/appContext";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Link, useLocation } from 'react-router-dom';

const PAGE_SIZE = 4;

function YourQuestions(props) {
      
    const context = useContext(AppContext);
    const outletContext = useOutletContext();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const page = parseInt(Number(query.get('page') || 1), 10);
    
    const [state, setState] = useState({
        userId: context.user.id,
        pageCount: 0,
        currentPage: page,
        
        needToReload: true
    });
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        setState(prevState => {
            return { ...prevState, userId: context.user.id, needToReload: true };
        });
    }, [context]);

    useEffect(() => {
        if (state.needToReload) {
            questionService.getUserQuestionsPaginated(state.userId, state.currentPage - 1, PAGE_SIZE)
                .then(response => {
                    console.log(response.data.content);
                    setState(prevState => {
                        return {
                            ...prevState, pageCount: response.data.totalPages
                        };
                    });
                    setQuestions(response.data.content);
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    setState(prevState => {
                        return { ...prevState, needToReload: false };
                    })
                })
        }
    }, [state.needToReload]);

    function handlePageChange(e, newValue) {
        setState(prevState => {
            return { ...prevState, currentPage: newValue, needToReload: true };
        });
    }

    return (
        <div className="card questions-page">
            <div className="card-header d-flex justify-content-between align-self-stretch">
                Your questions
                <button className="btn btn-secondary align-self-end" onClick={outletContext.showAddEditQuestionModal}>
                    <i className="fa-solid fa-plus"></i> Create
                </button>
            </div>
            <div className="card-body py-0 w-100 table-wrapper">
                <table className="table table-hover my-0 questions-table">
                    <thead>
                        <tr>
                            <th className="for-user-col" scope="col">For user</th>
                            <th className="question-col" scope="col">Question</th>
                            <th className="answer-type-col" scope="col">Answer type</th>
                            <th className="answer-col" scope="col">Answer</th>
                            <th className="actions-col" scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q) => (
                            <tr key={q.id}>
                                <td className="for-user-col" title={q.toUserEmail}>{q.toUserEmail}</td>
                                <td className="question-col" title={q.question}>{q.question}</td>
                                <td className="answer-type-col" title={q.answerType.type}>{q.answerType.type}</td>
                                <td className="answer-col"></td>
                                <td className="actions-col">
                                    <IconButton title="edit" sx={{ mr: '-8px', fontSize: '22px' }}
                                        edge="end">
                                        <EditRoundedIcon />
                                    </IconButton>
                                    <IconButton title="delete" sx={{ mr: '-8px', fontSize: '22px' }}
                                        edge="end">
                                        <DeleteForeverRoundedIcon />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="card-body">
                <Pagination count={state.pageCount}
                    page={state.currentPage}
                    onChange={handlePageChange}
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    renderItem={(item) => (
                        <PaginationItem
                            component={Link}
                            to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
                            {...item} />
                    )} />
            </div>
        </div>);

}

export default YourQuestions;