import React from 'react';

export const AppContext = React.createContext({
    // this can be empty??
    user: {
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
    },

    setUser: () => {}
});