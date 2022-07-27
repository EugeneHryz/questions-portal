import axios from 'axios';

const QUESTIONS_URL = "http://localhost:8080/questions-portal/questions";
const options = {
    headers: {
        'content-type': 'application/json'
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
            fromUser: {
                id: fromUserId
            },
            question,
            answerType,
            answerOptions
        };
        return axios.post(QUESTIONS_URL, JSON.stringify(questionToCreate), options);
    }

    getQuestionsFromUserPaginated(userId, page, size) {
        const options = {
            withCredentials: true,
            params: {
                userId, page, size
            }
        }
        return axios.get(QUESTIONS_URL + "/from-user", options);
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

    getQuestionsToUserPaginated(userId, page, size) {
        const options = {
            withCredentials: true,
            params: {
                userId, page, size
            }
        }
        return axios.get(QUESTIONS_URL + "/to-user", options);
    }
}

export default new QuestionService();