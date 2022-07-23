import { Pagination, PaginationItem } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import questionService from "../service/questionService";
import { AppContext } from "../app-context/appContext";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Link, useLocation } from 'react-router-dom';
import { formatAnswerType } from "../util/util";

const PAGE_SIZE = 4;

function YourQuestions(props) {
      
    const context = useContext(AppContext);
    const [ showAddEditQuestionModal, reloadQuestions ] = useOutletContext();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const page = parseInt(Number(query.get('page') || 1), 10);
    
    const [state, setState] = useState({
        pageCount: 0,
        currentPage: page,
        numberOfElements: -1
    });
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        loadCurrentPage();

    }, [state.currentPage, context, reloadQuestions]);

    function handlePageChange(e, newValue) {
        setState(prevState => {
            return { ...prevState, currentPage: newValue };
        });
    }

    function handleQuestionDelete(item) {
        const questionId = item.id;
        questionService.deleteQuestion(questionId).then(response => {
            if (state.numberOfElements === 1 && state.currentPage !== 1) {
                setState(prevState => {
                    return { ...prevState, currentPage: prevState.currentPage - 1 };
                });
            } else {
                loadCurrentPage();
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    function loadCurrentPage() {
        questionService.getUserQuestionsPaginated(context.user.id, state.currentPage - 1, PAGE_SIZE)
            .then(response => {
                console.log(response.data.content);
                setState(prevState => {
                    return {
                        ...prevState, 
                        pageCount: response.data.totalPages,
                        numberOfElements: response.data.numberOfElements,
                        showNoQuestionsMsg: false
                    };
                });
                setQuestions(response.data.content);
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <div className="card questions-page">
            <div className="card-header d-flex justify-content-between align-self-stretch">
                Your questions
                <button className="btn btn-secondary align-self-end" onClick={showAddEditQuestionModal}>
                    <i className="fa-solid fa-plus"></i> Create
                </button>
            </div>
            <div className="py-0 w-100 table-wrapper">
                <table className={'table table-hover my-0 questions-table ' + 
                    (state.numberOfElements === 0 ? 'opacity-0' : '')}>
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
                                <td className="answer-type-col" title={formatAnswerType(q.answerType)}>
                                    {formatAnswerType(q.answerType)}
                                </td>
                                <td className="answer-col"></td>
                                <td className="actions-col">
                                    <IconButton title="edit" sx={{ mr: '-8px', fontSize: '22px' }}
                                        edge="end">
                                        <EditRoundedIcon />
                                    </IconButton>
                                    <IconButton title="delete" sx={{ mr: '-8px', fontSize: '22px' }}
                                        edge="end" onClick={() => handleQuestionDelete(q)}>
                                        <DeleteForeverRoundedIcon />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    state.numberOfElements === 0 &&
                    <div className="empty-table-description text-center my-auto">You have no questions</div>
                }
            </div>
            
            <div className={'card-body ' + (state.numberOfElements === 0 ? 'opacity-0' : '')}>
                <Pagination count={state.pageCount}
                    page={state.currentPage}
                    onChange={handlePageChange}
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    renderItem={(item) => (
                        <PaginationItem
                            component={Link}
                            to={`?page=${item.page}`}
                            {...item} />
                    )} />
            </div>
        </div>);

}

export default YourQuestions;