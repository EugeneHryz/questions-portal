import axios from 'axios';

const ANSWERS_URL = "http://localhost:8080/questions-portal/answers";
const options = {
    headers: {
        'content-type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
}

class AnswerService {
    
    createAnswer(questionId, answer) {
        const answerObj = {
            questionId, answer
        };
        return axios.post(ANSWERS_URL, JSON.stringify(answerObj), options);
    }

    updateAnswer(answerId, answer) {
        const answerObj = {
            answer
        };
        return axios.put(ANSWERS_URL + "/" + answerId, JSON.stringify(answerObj), options);
    }

    getAnswersByQuestionIds(questionIds) {
        const options = {
            withCredentials: true,
            params: {
                questionIds: questionIds.join()
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return axios.get(ANSWERS_URL, options);
    }
}

export default new AnswerService();