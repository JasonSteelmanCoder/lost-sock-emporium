import React from 'react';
import '../css/RegistrationPage.css';
import { register } from '../API_helpers/APIHelpers.js';
import { Link } from 'react-router-dom';

const RegistrationPage = () => {
    return (
        <div id='registration-page'>
            <h1>Register a new account</h1>
            <form onSubmit={register}>
                <label htmlFor='username-input'>Username</label>
                <br></br>
                <input id='username-input' name='username'></input>
                <br></br>
                <label htmlFor='password-input'>Password</label>
                <br></br>
                <input id='password-input' name='password'></input>
                <br></br>
                <input type='submit'></input>
                <br></br>
            </form>
            <Link to='../login'>Already have an account? Sign in!</Link>
        </div>
    )
};

export default RegistrationPage;