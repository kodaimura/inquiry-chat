import React, {useState, useEffect} from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import {
  LoginPage,
  SignupPage,
  MyPage
} from '../components/pages'

import {
  NotFoundPage
} from "../components/pages/errors"

import {authorized} from '../apis/users.api'


const AppRoutes = () => {
  const [authz, setAuthz] = useState(false);

  useEffect(() => {
    authorized()
    .then(bool => setAuthz(bool));
  }, []);

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={authz? <MyPage /> : <LoginPage />}/>
            <Route path="/signup" element={<SignupPage />}/>
            <Route path="*" element={<NotFoundPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes