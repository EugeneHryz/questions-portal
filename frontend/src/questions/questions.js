import { Pagination, PaginationItem } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import questionService from "../service/questionService";
import { AppContext } from "../app-context/appContext";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { Link, useLocation } from 'react-router-dom';
import { formatAnswerType } from "../util/util";
import ConfirmDialog from "../home/confirmDialog";
import AddEditQuestionDialog from '../questions/addEditQuestionDialog';
import answerService from "../service/answerService";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const PAGE_SIZE = 4;

let stompClient = null;

function YourQuestions(props) {
      
    const context = useContext(AppContext);

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const page = parseInt(Number(query.get('page') || 1), 10);
    
    const [state, setState] = useState({
        pageCount: 0,
        currentPage: page,
        numberOfElements: -1,
        
        showConfirmDialog: false
    });
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [addEditQuestionModalShown, setAddEditQuestionModalShown] = useState(false);
    
    // true - edit question, false - add question
    const [editQuestion, setEditQuestion] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState({
        id: '',
        toUserEmail: '',
        question: '',
        answerType: '',
        answerOptions: []
    });

    useEffect(() => {
        if (!addEditQuestionModalShown) {
            loadCurrentPage();
        }
    }, [addEditQuestionModalShown]);

    useEffect(() => {
        loadCurrentPage();

    }, [state.currentPage, context]);

    useEffect(() => {
        stompClient = Stomp.over(function () {
            return new SockJS('http://localhost:8080/questions-portal/ws');
        });

        let subscription;
        stompClient.onConnect = function () {

            subscription = stompClient
                .subscribe('/user/queue/answer-updates', function (message) {
                    const answerEvent = JSON.parse(message.body);
                    const newAnswer = answerEvent.content;
                    console.log(JSON.stringify(newAnswer));

                    const updatedAnswers = answers.slice();
                    const index = answers.findIndex(a => a.id === answerEvent.id);
                    if (index === -1) {
                        updatedAnswers.push(newAnswer);
                    } else {
                        updatedAnswers[index] = newAnswer;
                    }

                    setAnswers(updatedAnswers);
                });
        }

        stompClient.activate();
        return () => {
            if (subscription) {
                subscription.unsubscribe();
                stompClient.deactivate();
            }
        };
    }, [questions]);

    function handlePageChange(e, newValue) {
        setState(prevState => {
            return { ...prevState, currentPage: newValue };
        });
    }

    function handleQuestionDelete(item) {
        setSelectedQuestion(item);
        // show confirmation dialog
        setState(prevState => {
            return { ...prevState, showConfirmDialog: !prevState.showConfirmDialog };
        });
    }

    function onDialogResult(result) {
        if (result) {
            questionService.deleteQuestion(selectedQuestion.id).then(response => {
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
    }

    function onDialogDismissed() {
        setState(prevState => {
            return { ...prevState, showConfirmDialog: false };
        });
    }

    function loadCurrentPage() {
        questionService.getQuestionsFromUserPaginated(context.user.id, state.currentPage - 1, PAGE_SIZE)
            .then(response => {
                setState(prevState => {
                    return {
                        ...prevState, 
                        pageCount: response.data.totalPages,
                        numberOfElements: response.data.numberOfElements
                    };
                });
                setQuestions(response.data.content);

                const questionIds = response.data.content.map(q => q.id);
                return answerService.getAnswersByQuestionIds(questionIds);
            })
            .then(response => {
                setAnswers(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <div className="card questions-page">
            <div className="card-header d-flex justify-content-between align-self-stretch">
                Your questions
                <button className="btn btn-secondary align-self-end" onClick={() => {
                        setEditQuestion(false);
                        setSelectedQuestion({});
                        setAddEditQuestionModalShown(true);
                    }}>
                    <i className="fa-solid fa-plus"></i> Create
                </button>
            </div>
            <div className="py-0 w-100 table-wrapper">
                <table className={'table table-hover my-0 my-fixed-table questions-table ' + 
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
                                <td className="answer-col" title={answers.find(e => e.questionId === q.id)?.answer}>
                                    {answers.find(e => e.questionId === q.id)?.answer}</td>
                                <td className="actions-col">
                                    <IconButton title="edit" sx={{ mr: '-8px', fontSize: '22px' }}
                                        edge="end" onClick={() => {
                                            setEditQuestion(true);
                                            setSelectedQuestion(old => ({ ...old, ...q }));
                                            setAddEditQuestionModalShown(true);
                                        }}>
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
                    <div className="empty-table-description text-center my-auto">You haven't created any questions yet</div>
                }
            </div>
            
            <div className={'card-body ' + (state.numberOfElements === 0 ? 'opacity-0' : '')}>
                <Pagination 
                    count={state.pageCount}
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
            <ConfirmDialog
                title="Really delete?"
                actionBtn="Delete"
                cancelBtn="No"
                show={state.showConfirmDialog}
                onResult={onDialogResult}
                onDismiss={onDialogDismissed} />

            <AddEditQuestionDialog
                show={addEditQuestionModalShown}
                edit={editQuestion}
                hide={() => setAddEditQuestionModalShown(false)}
                question={selectedQuestion} />
        </div>);
}

export default YourQuestions;