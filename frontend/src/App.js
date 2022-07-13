import './sass/custom.scss';
import { Outlet } from 'react-router-dom';
import { AppContext } from './app-context/appContext';
import { useState } from 'react';

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
  
  return (
    <AppContext.Provider value={ state }>
      <div className='page-body'>
        <Outlet />
      </div>
    </AppContext.Provider>
  );
}

export default App;
