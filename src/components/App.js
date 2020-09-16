import React, {useEffect, useState} from 'react';
import AppRouter from "components/Router";
import {authService} from "fbase";

//https://firebase.google.com/docs/reference/js?authuser=0
function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState(null);
    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
                setUserObj(user);
            } else {
                setIsLoggedIn(false)
            }
            setInit(true)
        });
    }, []);

    return (
        <>
            {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/> : ("Initializing....."
            )}
            <footer>
                &copy; Twintter{new Date().getFullYear()}
            </footer>
        </>
    );
}

export default App;
