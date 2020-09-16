import React, {useState} from "react";
import {authService, firebaseInstance} from "../fbase";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccout] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {target: {name, value}} = event;
        if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault();    //기본행위 (새로고침)방지
        try {
            let data;
            if (newAccount) {
                //create account
                data = await authService.createUserWithEmailAndPassword(email, password);
            } else {
                //log in
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            console.log(data)
        } catch (error) {
            setError(error.message)
        }


    };
    const toggleAccount = () => setNewAccout((prev) => !prev);
    const onSocialClick = async (event) => {
        //확인용 console.log(event.target.name);
        const {
            target: {name},
        } = event;

        let provider;
        if (name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === "github") {
            provider = new firebaseInstance.auth.GithubAuthProvider();

        }
        const data = await authService.signInWithPopup(provider)

        console.log(data);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    name="email"
                    type="text"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={onChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                />
                <input type="submit" value={newAccount ? "Create Account" : "Log In"}
                />
                {error}

            </form>
            <span onClick={toggleAccount}>{newAccount ? "Log In" : "Create Account"}</span>
            <button onClick={onSocialClick} name={"google"}>Continue with Google</button>
            <button onClick={onSocialClick} name={"github"}>Continue with Github</button>

        </div>
    )
}

export default Auth;