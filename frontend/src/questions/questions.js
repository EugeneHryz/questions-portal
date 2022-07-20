import { Pagination } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import questionService from "../service/questionService";
import { AppContext } from "../app-context/appContext";

const PAGE_SIZE = 4;

function YourQuestions(props) {
      
    const context = useContext(AppContext);
    const outletContext = useOutletContext();
    
    const [state, setState] = useState({
        userId: context.user.id,
        pageCount: 0,
        currentPage: 1,
        
        needToReload: true
    });
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (state.needToReload) {
            console.log("User id: " + state.userId);
            questionService.getUserQuestionsPaginated(state.userId, state.currentPage - 1, PAGE_SIZE)
                .then(response => {
                    console.log(response.data.content);
                    setState(prevState => {
                        return {
                            ...prevState, pageCount: response.data.totalPages,
                            currentPage: response.data.number + 1
                        };
                    })
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

    function handlePageChange(e, value) {
        setState(prevState => {
            return { ...prevState, currentPage: value, needToReload: true };
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
            <div className="card-body py-0">
                <table className="table table-hover my-0 app-table">
                    <thead>
                        <tr>
                            <th scope="col">For user</th>
                            <th scope="col">Question</th>
                            <th scope="col">Answer type</th>
                            <th scope="col">Answer</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q) => (
                            <tr key={q.id}>
                                
                                <td>{q.toUserEmail}</td>
                                <td>{q.question}</td>
                                <td>{q.answerType.type}</td>
                                <td></td>
                                <td className="text-end">
                                    <IconButton title="edit" sx={{ mr: '-5px', fontSize: '22px' }}
                                        edge="end">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </IconButton>
                                    <IconButton title="delete" sx={{ mr: '-6px', fontSize: '22px' }}
                                        edge="end">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="card-body">
                <Pagination count={state.pageCount} page={state.currentPage} onChange={handlePageChange}
                    shape="rounded" />
            </div>
        </div>);

}

export default YourQuestions;