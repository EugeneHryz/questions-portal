import { Modal } from "bootstrap";
import { useEffect, useRef, useState } from "react";
import { Autocomplete, TextField, IconButton, ListItem } from "@mui/material";
import { ListItemText, List, Button, CircularProgress } from "@mui/material";
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@mui/material/Collapse';
import questionService from "../service/questionService";
import userService from "../service/userService";
import React from 'react';
import { AppContext } from "../app-context/appContext";
import DeleteRoundedIcon from '@mui/icons-material/ClearRounded';

function renderItem(item, handleRemoveItem) {
    return (
        <ListItem
            secondaryAction={
                <IconButton
                    edge="end"
                    aria-label="delete"
                    title="Delete"
                    onClick={() => handleRemoveItem(item)}>
                    <DeleteRoundedIcon />
                </IconButton>}>
            <ListItemText primary={item} />
        </ListItem>
    );
}

function AddEditQuestionModal(props) {

    const modalRef = useRef();
    const [state, setState] = useState({
        toUser: '',
        users: [],
        answerTypes: [],

        addedOptions: [],
        answerOption: '',
        toUserInvalidMsg: '',
        questionInvalidMsg: '',
        optionsInvalidMsg: ''
    });
    const [userSelectOpen, setUserSelectOpen] = useState(false);
    const [usersLoading, setUsersLoading] = useState(false);
    const [selectedAnswerType, setSelectedAnswerType] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [question, setQuestion] = useState('');
    

    useEffect(() => {
        if (props.shouldShow) {
            const modal = Modal.getOrCreateInstance(modalRef.current);
            modal.show();
        }
        modalRef.current.addEventListener('hidden.bs.modal', function (event) {
            props.hide();
        });
    }, [props.shouldShow]);

    useEffect(() => {
        questionService.getAllAnswerTypes().then((response) => {
            setState(prevState => {
                return { ...prevState, answerTypes: response.data };
            });
            setSelectedAnswerType(response.data[0]);
        })
        .catch((error) => {
            console.log(error);
        })
    }, []);

    function handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;

        setState(prevState => {
            return { ...prevState, [name]: value };
        });
    }

    function removeItemFromOptionsList(item) {
        setState(prevState => {
            return { ...prevState, addedOptions: [...prevState.addedOptions.filter((i) => i !== item)] };
        });
    }

    function addOptionItem(item) {
        setState(prevState => {
            return { ...prevState, addedOptions: [...prevState.addedOptions, item] };
        });
    }

    function handleUserFieldChange(e, newValue) {
        setState(prevState => {
            return { ...prevState, toUser: newValue };
        });
        setUsersLoading(true);

        userService.searchUsersByEmail(newValue).then(response => {
            setState(prevState => {
                return { ...prevState, users: response.data.content };
            });
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            setUsersLoading(false);
        });
    }

    function validateToUser(toUser) {
        let errorMsg = '';
        let isValid = true;
        if (!toUser) {
            errorMsg = 'You need to select user';
            isValid = false;
        }
        setState(prevState => {
            return { ...prevState, toUserInvalidMsg: errorMsg };
        });
        return isValid;
    }

    function validateQuestion(question) {
        let errorMsg = '';
        let isValid = true;
        if (!question) {
            errorMsg = 'You need to ask a question';
            isValid = false;
        }
        setState(prevState => {
            return { ...prevState, questionInvalidMsg: errorMsg };
        });
        return isValid;
    }

    function validateOptionsList(answerType, options) {
        let isValid = true;
        let errorMsg = '';
        if (![1, 2, 6].includes(answerType.id)) {
            if (answerType.id === 4 && options.length !== 1) {
                errorMsg = 'For checkbox you need to add only one option';
                isValid = false;
            } else if (options.length === 0) {
                errorMsg = 'You need to add at least one option';
                isValid = false;
            }
        }
        setState(prevState => {
            return { ...prevState, optionsInvalidMsg: errorMsg };
        });
        return isValid;
    }

    function handleSubmit(e, userId) {
        const allIsValid = validateToUser(selectedUser)
            && validateQuestion(question)
            && validateOptionsList(selectedAnswerType, state.addedOptions);

        if (allIsValid) {
            questionService.createQuestion(selectedUser.email, userId, 
                question, selectedAnswerType, 
                state.addedOptions)
                .then(response => {
                    const modal = Modal.getOrCreateInstance(modalRef.current);
                    modal.hide();
                })
                .catch(error => {
                    console.log(error);
                })
        }
        e.preventDefault();
    }

    return (<div className="modal fade" id="addEditQuestionModal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true"
            ref={modalRef}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="modalHeader">{ props.edit ? 'Edit question' : 'Add question'}</h5>
                    <button id="closeModalBtn" type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                    <AppContext.Consumer>
                        {({ user, setUser }) => (
                            <form id="addQuestionForm" onSubmit={(e) => handleSubmit(e, user.id)} noValidate>
                                <div className="row mb-3">
                                    <label htmlFor="selectUser" className="col-sm-4 my-auto">To user</label>
                                    <div className="col-sm-8">
                                        <Autocomplete disablePortal id="selectUser" filterOptions={(x) => x}
                                            inputValue={state.toUser}
                                            onInputChange={(e, newInput) => handleUserFieldChange(e, newInput)}
                                            value={selectedUser}
                                            onChange={(e, newValue) => {
                                                setSelectedUser(newValue);
                                            }}
                                            open={userSelectOpen}
                                            onOpen={() => { setUserSelectOpen(true); }}
                                            onClose={() => { setUserSelectOpen(false); }}
                                            loading={usersLoading}
                                            isOptionEqualToValue={(option, value) => option.email === value.email}
                                            getOptionLabel={(option) => option ? option.email : ''}
                                            options={state.users} renderInput={(params) =>
                                                <TextField {...params} label="User"
                                                    error={state.toUserInvalidMsg.length !== 0}
                                                    helperText={state.toUserInvalidMsg}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <React.Fragment>
                                                                {usersLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </React.Fragment>
                                                        ),
                                                    }} />}>
                                        </Autocomplete>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="questionMultilineText" className="col-sm-4 my-auto">Question</label>
                                    <div className="col-sm-8">
                                        <TextField
                                            id="questionMultilineText"
                                            label="Question"
                                            value={question}
                                            onChange={(e) => {
                                                setQuestion(e.target.value);
                                            }}
                                            error={state.questionInvalidMsg.length !== 0}
                                            helperText={state.questionInvalidMsg}
                                            maxRows={4}
                                            className="w-100" />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="selectAnswerType" className="col-sm-4 my-auto">Answer type</label>
                                    <div className="col-sm-8">
                                        <Autocomplete disablePortal
                                            id="selectAnswerType"
                                            disableClearable
                                            isOptionEqualToValue={(option, value) => option.type === value.type}
                                            getOptionLabel={(option) => option ? option.type : ''}
                                            value={selectedAnswerType}
                                            onChange={(e, newValue) => {
                                                if ([1, 2, 6].includes(newValue.id)) {
                                                    setState(prevState => {
                                                        return { ...prevState, addedOptions: [] };
                                                    });
                                                }
                                                setSelectedAnswerType(newValue);
                                            }}
                                            options={state.answerTypes} renderInput={(params) =>
                                                <TextField {...params} label="Answer type" />}>
                                        </Autocomplete>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="answerOptionText" className="col-sm-4 my-auto">Add option</label>
                                    <div className="col-sm-8">
                                        <TextField
                                            fullWidth
                                            id="answerOptionText"
                                            label="Answer option" variant="standard"
                                            value={state.answerOption}
                                            name="answerOption"
                                            onChange={handleChange}
                                            disabled={[1, 2, 6].includes(selectedAnswerType.id)}
                                            error={state.optionsInvalidMsg.length !== 0}
                                            helperText={state.optionsInvalidMsg}
                                            InputProps={{
                                                endAdornment: <Button onClick={() => {
                                                    if (state.answerOption) {
                                                        addOptionItem(state.answerOption);
                                                    }
                                                }}
                                                    disabled={[1, 2, 6].includes(selectedAnswerType.id)}>Add</Button>
                                            }} />
                                    </div>
                                </div>
                                {state.addedOptions.length > 0 &&
                                    <hr className="border-light m-0"></hr>
                                }
                                <List sx={{
                                    width: '100%',
                                    maxHeight: 280,
                                    position: 'relative',
                                    overflow: 'auto'
                                }}>
                                    <TransitionGroup>
                                        {state.addedOptions.map((item) => (
                                            <Collapse key={item}>
                                                {renderItem(item, removeItemFromOptionsList)}
                                            </Collapse>
                                        ))}
                                    </TransitionGroup>
                                </List>
                                {state.addedOptions.length > 0 &&
                                    <hr className="border-light m-0"></hr>
                                }
                            </form>)}
                    </AppContext.Consumer>
                        
                    <div className="d-flex justify-content-end mt-3">
                        <button className="btn btn-grey me-2" data-bs-dismiss="modal">Cancel</button>
                        <button form="addQuestionForm" className="btn btn-primary" type="submit">Add</button>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default AddEditQuestionModal;