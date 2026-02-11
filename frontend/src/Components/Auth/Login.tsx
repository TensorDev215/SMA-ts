import React, { useState, ChangeEvent, FormEvent } from 'react';
import './Register.css';
import { login } from '../../services/api';

interface FormData {
    email: string;
    password: string;

}

interface LoginResponse {
    token: string;
    userID: string;
}

export default function Login() {

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const {data}: {data: LoginResponse} = await login(formData);
      console.log(data)
      localStorage.setItem('token', data.token);
      localStorage.setItem('userID', data.userID);

      alert("Login successful! Welcome back.");
    } catch (err) {
      console.log("Login error:", err);
    }
  }

  return (
    <div className='register-container'>
      <form className='register-form' onSubmit={handleSubmit}>
        <input className='register-input' type="email" name="email" placeholder='Email' onChange={handleChange} />
        <input className='register-input' type="password" name="password" placeholder='Password' onChange={handleChange} />
        <button className='register-button' type='submit'>Login</button>
      </form>
    </div>
  );
}