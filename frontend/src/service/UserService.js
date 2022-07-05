import axios from 'axios';

const USERS_URL = "http://localhost:8080/questions-portal/users";

const options = {
    headers: {"content-type": "application/json"}
}

class UserService {
    
    logIn(email, password) {
        const user = { email, password };
        return axios.post(USERS_URL + "/login", JSON.stringify(user), options);
    }

    signUp(email, password, firstName, lastName, phoneNumber) {
        const newUser = { email, password, firstName, lastName, phoneNumber };
        return axios.post(USERS_URL, JSON.stringify(newUser), options);
    }
}

export default new UserService();