import React from 'react';
import '../css/LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../API_helpers/APIHelpers.js';
import store from '../store.js';
import { signalLoggedIn } from './authSlice.js';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await login(event);
            if (response.status === 200) {
                store.dispatch(signalLoggedIn());
                navigate('/');
            } else if (response.status === 400) {
                alert("Bad request. Correct username and password required.");
            } else if (response.status === 401) {
                alert("Username or password is incorrect.");
            } else {
                console.log(response);
                alert(response.status);
            }
        } catch (err) {
            console.log(err);
            alert('Something went wrong.');
        }
    };

    return (
        <div id='login-page'>
            <h1>Log in to your account</h1>
            <form onSubmit={handleLoginSubmit}>
                <label htmlFor='username-input'>Username</label>
                <br></br>
                <input id='username-input' name='username' required></input>
                <br></br>
                <label htmlFor='password-input'>Password</label>
                <br></br>
                <input id='password-input' name='password' type='password' required></input>
                <br></br>
                <input type='submit' value='Login' id='login-submit'></input>
                <br></br>
            </form>
            <Link to='../register'>Don't have an account? Sign up!</Link>
        </div>
    );
};

export default LoginPage;