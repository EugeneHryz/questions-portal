import axios from 'axios';

const USERS_URL = "http://localhost:8080/questions-portal/users";
const options = {
    headers: {
        'content-type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
}

class UserService {
    
    logIn(email, password) {
        const options = {
            withCredentials: true,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
        if (email && password) {
            options.auth = {
                username: email,
                password: password
            };
        }
        return axios.get(USERS_URL + "/login", options);
    }

    register(email, password, firstName, lastName, phoneNumber) {
        const newUser = { email, password, firstName, lastName, phoneNumber };
        return axios.post(USERS_URL + "/signup", JSON.stringify(newUser), options);
    }

    update(id, email, password, firstName, lastName, phoneNumber) {
        const updatedUser = { email, password, firstName, lastName, phoneNumber };
        return axios.put(USERS_URL + "/" + id, JSON.stringify(updatedUser), options);
    }

    logOut() {
        return axios.get(USERS_URL + "/logout", options);
    }

    deleteUserAccount(userId, password) {
        const options = {
            headers: {
                'content-type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            withCredentials: true,
            data: { password }
        }
        return axios.delete(USERS_URL + "/" + userId, options);
    }

    searchUsersByEmail(emailSearch) {
        const options = {
            withCredentials: true,
            params: {
                email: emailSearch,
                size: 5
            }
        }
        return axios.get(USERS_URL, options);
    }
}

export default new UserService();