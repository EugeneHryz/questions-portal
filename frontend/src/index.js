import React from 'react';
import ReactDOM from 'react-dom/client';
import './sass/custom.scss';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import LoginForm from './login/login';
import SignUpForm from './login/signup';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="signup" element={<SignUpForm />} />
        <Route path="login" element={<LoginForm />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
