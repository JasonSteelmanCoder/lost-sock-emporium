import React from 'react';
import '../css/RegistrationPage.css';
import { register } from '../API_helpers/APIHelpers.js';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
    const navigate = useNavigate();

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await register(event);
            if (response.status === 201) {
                navigate('/login');
            } else {
                console.log(response);
                alert(response.data);
            }
        } catch (err) {
            alert('something went wrong.');
            console.log(err);
        };
    };    

    return (
        <div id='registration-page'>
            <h1>Register a new account</h1>
            <form onSubmit={handleRegisterSubmit}>
                <label htmlFor='username-input'>Username</label>
                <br></br>
                <input id='username-input' name='username' required></input>
                <br></br>
                <label htmlFor='password-input'>Password</label>
                <br></br>
                <input id='password-input' name='password' type='password' required></input>
                <br></br>
                <label htmlFor='confirm-input'>Confirm Password</label>
                <br></br>
                <input id='confirm-input' name='confirm' type='password' required></input>
                <br></br>
                <input type='submit' value='Register' id='register-submit'></input>
                <br></br>
            </form>
            <Link to='../login' className='blue-link'>Already have an account? Sign in!</Link>
        </div>
    )
};

export default RegistrationPage;