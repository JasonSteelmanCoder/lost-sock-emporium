import React from 'react';
import '../css/LoginPage.css';
import { Link } from 'react-router-dom';
import { login } from '../API_helpers/APIHelpers.js';

const LoginPage = () => {
    return (
        <div id='login-page'>
            <h1>Log in to your account</h1>
            <form onSubmit={login}>
                <label htmlFor='username-input'>Username</label>
                <br></br>
                <input id='username-input' name='username'></input>
                <br></br>
                <label htmlFor='password-input'>Password</label>
                <br></br>
                <input id='password-input' name='password' type='password'></input>
                <br></br>
                <input type='submit'></input>
                <br></br>
            </form>
            <Link to='../register'>Don't have an account? Sign up!</Link>
        </div>
    );
};

export default LoginPage;