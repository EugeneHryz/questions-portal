import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from './app-context/appContext';
import './sass/custom.scss';
import userService from './service/userService';

function App() {

  const [state, setState] = useState({
    user: {
      id: undefined,
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: ''
    },

    setUser: (newUser) => {
      setState(prevState => {
        return { ...prevState, user: { ...prevState.user, ...newUser } };
      });
    }
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    userService.logIn().then(response => {
      const authenticatedUser = {
        id: response.data.id,
        email: response.data.email,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phoneNumber: response.data.phoneNumber
      }
      state.setUser(authenticatedUser);
      console.log("context updated");
    })
      .catch(error => {
        console.log(error);
        navigate("/login");
      });
  }, []);

  return (
    <AppContext.Provider value={state}>
      <div className='page-body'>
        <Outlet />
      </div>
    </AppContext.Provider>
  );
}

export default App;
