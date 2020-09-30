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
                setUserObj({
                    displayName:user.displayName,
                    uid:user.uid,
                    updateProfile:(args) => user.updateProfile(args),
                });
            } else {
                setUserObj(null);
                // setIsLoggedIn(false)
            }
            setInit(true)
        });
    }, []);
const refreshUser = () =>{
    const user = authService.currentUser;
    /*
    setUserObj(Object.assign({},user));
     여기서 앞에는 빈 object자리 뒤에는 source
     결과적으로 빈 object자리에 user의 사본이 새 object의 형태로 생성
     새로운 object가 생기면 react가 rendering 함
     */
    setUserObj({
        displayName:user.displayName,
        uid:user.uid,
        updateProfile:(args) => user.updateProfile(args),
    })
}
//header와 navigation등 userObj를 쓰는 애들을 refresh해줘야 함으로
    return (
        <>
            {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj}/> : ("Initializing....."
            )}
            {/*<footer>*/}
            {/*    &copy; {new Date().getFullYear()} Twintter*/}
            {/*</footer>*/}
        </>
    );
}

export default App;
