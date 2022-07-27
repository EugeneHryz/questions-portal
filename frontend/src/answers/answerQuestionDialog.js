import { Modal } from "bootstrap";
import { useContext, useEffect, useRef, useState } from "react";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormHelperText from '@mui/material/FormHelperText';
import answerService from "../service/answerService";

function AnswerQuestionDialog(props) {

    const modalRef = useRef();
    const [state, setState] = useState({
        answerInvalidMsg: ''
    });

    const [singleLineText, setSingleLineText] = useState('');
    const [multilineText, setMultilineText] = useState('');
    const [dateValue, setDateValue] = useState(new Date().toISOString().slice(0, 10));
    const [checkboxValue, setCheckboxValue] = useState(false);
    const [selectedRadioButton, setSelectedRadioButton] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (props.show) {
            const modal = Modal.getOrCreateInstance(modalRef.current);
            modal.show();
        }
        const hiddenListener = function (e) {
            props.hide();
        };
        modalRef.current.addEventListener('hidden.bs.modal', hiddenListener);
        return () => {
            if (modalRef.current) {
                modalRef.current.removeEventListener('hidden.bs.modal', hiddenListener);
            }
        };
    }, [props.show]);

    useEffect(() => {
        setState(prevState => ({ ...prevState, answerInvalidMsg: '' }));
    }, [props.question]);

    useEffect(() => {
        if (props.answer) {
            const a = props.answer;
            switch (props.question.answerType) {
                case 'SINGLE_LINE_TEXT':
                    setSingleLineText(a.answer);
                    break;
                case 'MULTILINE_TEXT':
                    setMultilineText(a.answer);
                    break;
                case 'DATE':
                    setDateValue(a.answer);
                    break;
                case 'CHECKBOX':
                    setCheckboxValue(a.answer === 'Checked' ? true : false);
                    break;
                case 'RADIO_BUTTON':
                    setSelectedRadioButton(a.answer);
                    break;
                case 'COMBOBOX':
                    setSelectedOption(a.answer);
                    break;
            }
        }
    }, [props.answer]);

    function validateValue(value) {
        let isValid = true;
        let errorMsg = '';
        if (!value) {
            errorMsg = 'You need to provide answer';
            isValid = false;
        }
        setState(prevState => ({ ...prevState, answerInvalidMsg: errorMsg }));
        return isValid;
    }

    function handleSubmit() {
        const answer = getAnswerText();
        const inputIsValid = validateValue(answer);

        if (inputIsValid) {
            submitAnswer(answer);
        }
    }

    function submitAnswer(answer) {
        if (props.answer) {
            answerService.updateAnswer(props.answer.id, answer)
                .then(response => {
                    const modal = Modal.getOrCreateInstance(modalRef.current);
                    modal.hide();
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            answerService.createAnswer(props.question.id, answer)
                .then(response => {
                    const modal = Modal.getOrCreateInstance(modalRef.current);
                    modal.hide();
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    function getAnswerText() {
        let answer = '';
        switch (props.question.answerType) {
            case 'SINGLE_LINE_TEXT':
                answer = singleLineText;
                break;
            case 'MULTILINE_TEXT':
                answer = multilineText;
                break;
            case 'DATE':
                answer = dateValue;
                break;
            case 'RADIO_BUTTON':
                answer = selectedRadioButton;
                break;
            case 'COMBOBOX':
                answer = selectedOption;
                break;
            case 'CHECKBOX':
                answer = checkboxValue ? 'Checked' : 'Not checked';
                break;
        }
        return answer;
    }

    return (<div className="modal fade" id="addEditQuestionModal" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true"
            ref={modalRef}>
        <div className="modal-dialog modal-dialog-centered answer-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="modalHeader">Answer the question</h5>
                    <button id="closeModalBtn" type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body d-flex flex-column">
                    <div className="align-self-center w-100 p-1">
                        
                        <div className="mb-3">
                            <TextField
                                fullWidth
                                id="fromUserEmail"
                                label="From user"
                                value={props.question.fromUser.email}
                                onChange={() => { }}
                                InputProps={{
                                    readOnly: true
                                }}
                                variant="filled" />
                        </div>
                        <div className="mb-3">
                            <TextField
                                fullWidth
                                id="question"
                                label="Question"
                                value={props.question.question}
                                onChange={() => { }}
                                InputProps={{
                                    readOnly: true
                                }}
                                variant="filled" />
                        </div>
                        <div className="text-dark mb-2">Enter your answer here:</div>
                        
                        {props.question.answerType === 'SINGLE_LINE_TEXT' &&
                            <TextField
                                fullWidth
                                id="singleLineTextInput"
                                label="Answer"
                                value={singleLineText}
                                onChange={(e) => setSingleLineText(e.target.value)}
                                error={state.answerInvalidMsg.length !== 0}
                                helperText={state.answerInvalidMsg}
                                variant="standard" />}

                        {props.question.answerType === 'MULTILINE_TEXT' &&
                            <TextField
                                fullWidth
                                multiline
                                id="multilineTextInput"
                                label="Answer"
                                value={multilineText}
                                onChange={(e) => setMultilineText(e.target.value)}
                                error={state.answerInvalidMsg.length !== 0}
                                helperText={state.answerInvalidMsg}
                                variant="standard" />}

                        {props.question.answerType === 'DATE' &&
                            <TextField
                                id="dateInput"
                                label="Date"
                                type="date"
                                value={dateValue}
                                onChange={(e) => setDateValue(e.target.value)}
                                sx={{ width: 220 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                error={state.answerInvalidMsg.length !== 0}
                                helperText={state.answerInvalidMsg} />}

                        {props.question.answerType === 'CHECKBOX' && 
                            <FormControlLabel id="checkboxInput"
                                    control={<Checkbox
                                    checked={checkboxValue}
                                    onChange={(e) => setCheckboxValue(e.target.checked)}
                                    inputProps={{ 'aria-label': 'controlled' }} />} />}

                        {props.question.answerType === 'RADIO_BUTTON' &&
                            <FormControl variant="standard"
                                error={state.answerInvalidMsg.length !== 0}>
                                <RadioGroup
                                    name="radioButtonInput"
                                    value={selectedRadioButton}
                                    onChange={(e) => setSelectedRadioButton(e.target.value)}>
                                    {props.question.answerOptions.map((option) => (
                                        <FormControlLabel key={option} value={option}
                                            control={<Radio />} label={option} />
                                    ))}
                                </RadioGroup>
                                <FormHelperText>{state.answerInvalidMsg}</FormHelperText>
                            </FormControl>}

                        {props.question.answerType === 'COMBOBOX' && 
                            <Autocomplete disablePortal 
                                id="comboboxInput"
                                value={selectedOption}
                                onChange={(e, newValue) => setSelectedOption(newValue)}
                                isOptionEqualToValue={(option, value) => option === value}
                                getOptionLabel={(option) => option}
                                options={props.question.answerOptions} renderInput={(params) =>
                                    <TextField {...params} label="Answer" 
                                        error={state.answerInvalidMsg.length !== 0}
                                        helperText={state.answerInvalidMsg} /> }>
                            </Autocomplete>}

                    </div>
                    
                    <div className="d-flex justify-content-end mt-4">
                        <button className="btn btn-grey me-2" data-bs-dismiss="modal">Cancel</button>
                        <button className="btn btn-primary" type="submit" 
                            onClick={handleSubmit}>Answer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default AnswerQuestionDialog;