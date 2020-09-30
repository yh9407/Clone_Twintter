import React, {useState} from "react";
import {authService} from "../fbase";


const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const toggleAccount = () => setNewAccount((prev) => !prev);
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
        } catch (error) {
            setError(error.message)
        }


    };
    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input
                    className="authInput"ㄹ
                    name="email"
                    type="text"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={onChange}
                />
                <input
                    className="authInput"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                />
                <input
                    className="authInput authSubmit"
                    type="submit"
                    value={newAccount ? "Create Account" : "Sign In"}
                />
                {error && <span className="authError">{error}</span>}
                <span onClick={toggleAccount}
                      className="authSwitch">{newAccount ? "로그인" : "회원가입"}</span>
            </form>
        </>
    )

}
export default AuthForm;