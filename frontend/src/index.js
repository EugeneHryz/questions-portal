import React from 'react';
import ReactDOM from 'react-dom/client';
import './sass/custom.scss';
import 'bootstrap/dist/js/bootstrap.js';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import LoginForm from './login/login';
import SignUpForm from './login/signup';
import HomePage from './home/home';
import Profile from './profile/profile';
import YourQuestions from './questions/questions';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Navigate to="login"/>} />
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignUpForm />} />
          <Route path="home/" element={<HomePage />}>
            <Route index element={<Navigate to="questions"/>} />
            <Route path="profile" element={<Profile />} />
            <Route path="questions" element={<YourQuestions />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
