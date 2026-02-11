import axios from 'axios';

interface LoginUserData {
    email: string;
    password: string;
}

interface RegisterUserData extends LoginUserData {
    username: string;
}

const API = axios.create({baseURL: 'http://localhost:5000/api'});

export const register = (userData: RegisterUserData) => API.post('/user/register', userData);
export const login = (userData: LoginUserData) => API.post('/user/login', userData);