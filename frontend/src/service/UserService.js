import axios from 'axios';

const USERS_URL = "http://localhost:8080/questions-portal/users";

const options = {
    headers: {"content-type": "application/json"}
}

class UserService {
    
    logIn(email, password) {
        const options = {
            headers: {
                'Authorization': 'Basic ' + window.btoa(`${email}:${password}`) 
            }
        };
        return axios.get(USERS_URL, options);
    }

    register(email, password, firstName, lastName, phoneNumber) {
        const newUser = { email, password, firstName, lastName, phoneNumber };
        return axios.post(USERS_URL + "/signup", JSON.stringify(newUser), options);
    }

    update(id, email, password, firstName, lastName, phoneNumber) {
        const updatedUser = { email, password, firstName, lastName, phoneNumber };
        return axios.put(USERS_URL + "/" + id, JSON.stringify(updatedUser), options);
    }
}

export default new UserService();