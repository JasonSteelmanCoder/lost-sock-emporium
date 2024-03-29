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
            clearInterval(intervalId);
            navigate('/');
        }
    } 
    // wait until session is created to check authorization
    setTimeout(() => checkAuthStatus(), 4000);
        
    // return to homepage in maximum of 5 seconds
    const timeoutId = setTimeout(() => {
        navigate('/');
    }, 5000);

    // animate loading message
    const [elipsis, setElipsis] = useState("");
    const [intervalId, setIntervalId] = useState(null);
    
    useEffect(
        () => {
            setIntervalId(
                setInterval(() => {
                    if (elipsis.length === 0 || elipsis.length === 1) {
                        setElipsis(elipsis + ".");
                    } else {
                        setElipsis("");
                    }
                }, 700)
            )
        }, []
    );
    
    return (
        <div id="LoadingPage">
            <h1>Loading.{elipsis}</h1>
            <h2>Please wait.</h2>
        </div>
    )
}

export default LoadingPage;