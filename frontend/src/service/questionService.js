import axios from 'axios';

const QUESTIONS_URL = "http://localhost:8080/questions-portal/questions";
const options = {
    headers: {
        'content-type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
}

class QuestionService {
    
    getAllAnswerTypes() {
        return axios.get(QUESTIONS_URL + "/answer-types", options);
    }

    createQuestion(toUserEmail, fromUserId, question, answerType, answerOptions) {
        const questionToCreate = {
            toUserEmail,
            fromUserId,
            question,
            answerType,
            answerOptions
        };
        return axios.post(QUESTIONS_URL, JSON.stringify(questionToCreate), options);
    }

    getUserQuestionsPaginated(userId, page, size) {
        const options = {
            withCredentials: true,
            params: {
                userId, page, size
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        return axios.get(QUESTIONS_URL, options);
    }

    deleteQuestion(id) {
        return axios.delete(QUESTIONS_URL + "/" + id, options);
    }

    editQuestion(id, toUserEmail, question, answerType, answerOptions) {
        const questionToEdit = {
            toUserEmail,
            question,
            answerType,
            answerOptions
        };
        return axios.put(QUESTIONS_URL + "/" + id, JSON.stringify(questionToEdit), options);
    }
}

export default new QuestionService();