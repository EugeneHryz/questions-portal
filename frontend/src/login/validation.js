class Validation {

    validateEmail(email) {
        const emailRegex = /^(?=.{3,30}$)[\w.]+@[\w.]+$/;
        
        let result = {
            errorMsg: '',
            valid: false
        };
        if (email.length === 0) {
            result.errorMsg = 'Email field is required';
        } else if (!emailRegex.test(email)) {
            result.errorMsg = "Invalid email format";
        } else {
            result.valid = true;
        }
        return result;
    }

    validatePassword(password) {
        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
        const minLength = 8;
        const maxLength = 30;

        let result = {
            errorMsg: '',
            valid: false
        };
        if (password.length < minLength || password.length > maxLength) {
            result.errorMsg = "Password length must be between 8 and 30 characters";
        } else if (!passwordRegex.test(password)) {
            result.errorMsg = "Password must contain at least one lowercase, one uppercase character and one digit";
        } else {
            result.valid = true;
        }
        return result;
    }

    validateName(name) {
        const nameRegex = /^(\p{L})+$/u;
        const minLength = 3;
        const maxLength = 25;

        let result = {
            errorMsg: '',
            valid: false
        };
        if (name.length > 0) {
            if (!nameRegex.test(name)) {
                result.errorMsg = 'Digits and special characters are not allowed';
            } else if (name.length < minLength) {
                result.errorMsg = 'Too short';
            } else if (name.length > maxLength) {
                result.errorMsg = 'Too long';
            } else {
                result.valid = true;
            }
        } else {
            result.valid = true;
        }
        return result;
    }

    validatePhoneNumber(phoneNumber) {
        const phoneNumberRegex = /^\+[0-9]{12}$/;

        let result = {
            errorMsg: '',
            valid: true
        };
        if (phoneNumber.length > 0) {
            if (!phoneNumberRegex.test(phoneNumber)) {
                result.errorMsg = 'Please enter phone number in international format';
                result.valid = false;
            }
        }
        return result;
    }
}

export default new Validation();