import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignInForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/dj-rest-auth/login/', { username, password });
      localStorage.setItem('authToken', response.data.key);
      toast.success('Signed in successfully!');
      history.push('/');
    } catch (err) {
      toast.error('Failed to sign in. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignInForm;