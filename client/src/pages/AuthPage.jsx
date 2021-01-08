import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';

export const AuthPage = () => {
  
  const auth = useContext(AuthContext);
  const message = useMessage();
  const { loading, request, error, clearError } = useHttp();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };


  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form });
      message(data.message);
    } catch (e) {}
  };

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form });
      auth.login(data.token, data.userId);
    } catch (e) {}
  };

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1 className="center-align">CutLink</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Authenticate</span>
            <div>
                
              <div className="input-field">
                <input
                  placeholder="Enter your email"
                  id="email"
                  type="email"
                  name="email"
                  className="yellow__input"
                  value={form.email}
                  onChange={changeHandler}
                />
                <label htmlFor="first_name">First Name</label>
              </div>

              <div className="input-field">
                <input
                placeholder="Enter your password"
                id="password"
                type="password"
                name="password"
                className="yellow__input"
                value={form.password}
                onChange={changeHandler}
                disabled={loading}
                />
                <label htmlFor="first_name">First Name</label>
              </div>

            </div>
          </div>
          <div className="card-action">
            <button 
              className="btn yellow darken-4" 
              style={{marginRight: 10}}
              onClick={loginHandler}
              disabled={loading}
            >Log in</button>
            <button 
              className="btn grey lighten-2 black-text" 
              onClick={registerHandler}
              disabled={loading}
            >Sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
};