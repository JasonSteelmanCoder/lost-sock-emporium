import React, { useEffect, useState } from 'react';
import '../css/LoadingPage.css';
import { useNavigate } from 'react-router-dom';
import { checkUserId } from '../API_helpers/APIHelpers';
import store from '../store.js';
import { signalLoggedIn } from './authSlice';

const LoadingPage = () => {
    
    const navigate = useNavigate();

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const queryUserId = params.get('user_id');

    const checkAuthStatus = async () => {
        const authData = await checkUserId(queryUserId);
        if (authData.authenticated) {
            store.dispatch(signalLoggedIn({user_id: authData.user_id }));
            clearTimeout(timeoutId);
            navigate('/');
        }
    } 
    setTimeout(() => checkAuthStatus(), 4000);
        
    const timeoutId = setTimeout(() => {
        navigate('/');
    }, 5000);

    
    return (
        <div id="LoadingPage">
            <h1>Loading...<br/><br/>Please wait.</h1>
        </div>
    )
}

export default LoadingPage;