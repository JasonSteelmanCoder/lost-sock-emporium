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
        console.log("CHECKING AUTH STATUS!")
        const authData = await checkUserId(queryUserId);
        if (authData.authenticated) {
            store.dispatch(signalLoggedIn({user_id: authData.user_id }));
            clearTimeout(timeoutCheckingId);
            clearTimeout(timeoutNavigationId);
            navigate('/');
        }
    } 
    // wait until session is created to check authorization
    const timeoutCheckingId = setTimeout(() => checkAuthStatus(), 4000);
        
    // return to homepage in maximum of 5 seconds
    const timeoutNavigationId = setTimeout(() => {
        clearTimeout(timeoutCheckingId);
        clearTimeout(timeoutNavigationId);
        navigate('/');
    }, 5000);
    
    return (
        <div id="LoadingPage">
            <h1>Loading<span id='ellipsis'/></h1>
            <h2>Please wait.</h2>
        </div>
    )
}

export default LoadingPage;