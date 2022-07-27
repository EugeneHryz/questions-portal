import { Pagination, PaginationItem } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import { AppContext } from "../app-context/appContext";
import { Link, useLocation } from 'react-router-dom';
import questionService from "../service/questionService";
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import AnswerQuestionDialog from "./answerQuestionDialog";
import answerService from "../service/answerService";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const PAGE_SIZE = 4;

let stompClient = null;

function YourAnswers(props) {
      
    const context = useContext(AppContext);

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const page = parseInt(Number(query.get('page') || 1), 10);
    
    const [state, setState] = useState({
        pageCount: 1,
        currentPage: page,
        numberOfElements: 3

    });
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    
    const [answerDialogShown, setAnswerDialogShown] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState({
        id: '',
        toUserEmail: '',
        fromUser: {
            id: '',
            email: ''
        },
        question: '',
        answerType: '',
        answerOptions: []
    });

    useEffect(() => {
        stompClient = Stomp.over(function () {
            return new SockJS('http://localhost:8080/questions-portal/ws');
        });

        let subscription;
        stompClient.onConnect = function () {

            subscription = stompClient
                .subscribe('/user/queue/question-updates', function (message) {
                    const questionEvent = JSON.parse(message.body);
                    
                    console.log(JSON.stringify(questionEvent));
                    handleQuestionEvent(questionEvent);
                });
        }

        stompClient.activate();
        return () => {
            if (subscription) {
                subscription.unsubscribe();
                stompClient.deactivate();
            }
        };
    }, [questions, answers]);

    useEffect(() => {
        if (!answerDialogShown) {
            loadCurrentPage();
        }
    }, [answerDialogShown]);

    useEffect(() => {
        loadCurrentPage();

    }, [state.currentPage, context]);

    function handlePageChange(e, newValue) {
        setState(prevState => {
            return { ...prevState, currentPage: newValue };
        });
    }

    function handleQuestionEvent(event) {
        
        if (event.action === 'UPDATED') {
            console.log("Old answers: " + JSON.stringify(answers));
            const newAnswers = answers.filter(a => a.questionId !== event.id);
            console.log("New answers: " + JSON.stringify(newAnswers));

            const updatedQuestions = questions.slice();
            const newQuestions = updateArray(updatedQuestions, event.content);

            setAnswers(newAnswers);
            setQuestions(newQuestions);
        } else {
            loadCurrentPage();
        }
    }

    function updateArray(array, updatedElmnt) {
        const index = array.findIndex(a => a.id === updatedElmnt.id);
        if (index === -1) {
            array.push(updatedElmnt);
        } else {
            array[index] = updatedElmnt;
        }
        return array;
    }

    function loadCurrentPage() {
        questionService.getQuestionsToUserPaginated(context.user.id, state.currentPage - 1, PAGE_SIZE)
            .then(response => {
                setState(prevState => {
                    return {
                        ...prevState, 
                        pageCount: response.data.totalPages,
                        numberOfElements: response.data.numberOfElements,
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
            });
    }

    return (
        <div className="card answers-page">
            <div className="card-header d-flex justify-content-between align-self-stretch">
                Your answers
            </div>
            <div className="py-0 w-100 table-wrapper">
                <table className={'table table-hover my-0 my-fixed-table answers-table ' + 
                    (state.numberOfElements === 0 ? 'opacity-0' : '')}>
                    <thead>
                        <tr>
                            <th className="from-user-col" scope="col">From user</th>
                            <th className="question-col" scope="col">Question</th>
                            <th className="answer-col" scope="col">Answer</th>
                            <th className="actions-col" scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q) => (
                            <tr key={q.id}>
                                <td className="from-user-col">{q.fromUser.email}</td>
                                <td className="question-col">{q.question}</td>
                                <td className="answer-col" title={answers.find(e => e.questionId === q.id)?.answer}>
                                    {answers.find(e => e.questionId === q.id)?.answer}</td>
                                <td className="actions-col">
                                    <IconButton title="edit" sx={{ mr: '-8px', fontSize: '22px' }}
                                        edge="end" onClick={() => {
                                            setSelectedQuestion(q);
                                            setAnswerDialogShown(true);
                                        }}>
                                        <QuestionAnswerRoundedIcon />
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    state.numberOfElements === 0 &&
                    <div className="empty-table-description text-center my-auto">You have no questions to answer yet</div>
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

            <AnswerQuestionDialog show={answerDialogShown}
                hide={() => setAnswerDialogShown(false)}
                question={selectedQuestion}
                answer={answers.find(e => e.questionId === selectedQuestion.id)} />
        </div>);

}

export default YourAnswers;