import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { useHistory } from 'react-router-dom';

export const CreatePage = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { request } = useHttp();
  const [link, setlink] = useState('');

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const pressHandler = async event => {
    if (event.key === 'Enter') {
      try {
        const data = await request('/api/link/generate', 'POST', { from: link }, { Authorization: `Bearer ${auth.token}` });
        history.push(`/detail/${data.link._id}`);
      } catch (e) {}
    }
  }

  return (
    <div className="row">
      <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}></div>
      <div className="input-field">
        <input
          placeholder="Enter your link"
          id="link"
          type="text"
          className="blue__input"
          value={link}
          onChange={e => setlink(e.target.value)}
          onKeyPress={pressHandler}
        />
        <label htmlFor="link">Enter link</label>
      </div>
    </div>
  );
};