import React, { useEffect, useState } from 'react'
import axios from 'axios';
import styled from 'styled-components';
import Input from '../components/Input';
import MyButton from '../components/Button';
import {
  BrowserRouter as Router,
  Link,
  Outlet, 
  useRoutes,
  useNavigate
} from "react-router-dom";

const AppDiv = styled.div`
    text-align: center;
    padding: 2%;
    background-color: #F5F5F5;
    height: 100%;
    width: max;
`;

const Error = styled.p`
    color: red;
    font-size: xx-small;
    text-align: center;
`;

const Success = styled.p`
    color: green;
    font-size: xx-small;
    text-align: center;
`;

const SignUp = styled.p`
    color: dark-gray;
    text-decoration: underline;
    font-size: x-small;
`;

const Login = (props) => {
    const [state, setState] = useState({
        username: "",
        password: ""
    });
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const navToSignUp = () => {
        navigate('/signup');
    }

    const navToHome = () => {
        navigate('/home');
    }

    const onInputChanged = (e) => {
        let username = state.username;
        let password = state.password;

        const name = e.target.name;
        const value = e.target.value;

        switch(name){
            case "username":
                username = value;
                break;
            case "password":
                password = value;
                break;
            default:
        }

        if(success.length > 0){setSuccess("");}
        if(errors.length > 0){setErrors([]);}
        setState({
            username: username,
            password: password
        });
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();
        axios.post(
            "http://localhost:8000/api/user/login", 
            {
                username: state.username,
                password: state.password,
            },
            { withCredentials: true },
        )
            .then(res => {
                console.log(res);
                setState({
                    username: "",
                    password: "",
                });
                setSuccess(res.data.msg);
                localStorage.setItem('usertoken', JSON.stringify(res.data.token));
                localStorage.setItem('userId', JSON.stringify(res.data.user._id));
                navToHome();
            })
            .catch(err => {
                console.log(err);
                const errorArr = [];
                const errorResponse = err.response.data.errors;

                for(const key of Object.keys(errorResponse)){
                    errorArr.push(errorResponse[key].message);
                }
                setErrors(errorArr);
            });
    }

    return (
        <AppDiv>
            <h2>Login</h2>
            {errors.map((err, index) => <Error key={index}>{err}</Error>)}
            {success && <Success>{success}</Success>}
            <form id="login-form" onSubmit={onSubmitHandler}>
                <Input
                    title="Username"
                    name="username"
                    type="username"
                    minLength={3}
                    value={state.username}
                    onChange={onInputChanged}
                />
                <Input
                    title="Password"
                    name="password"
                    type="password"
                    minLength={3}
                    value={state.password}
                    onChange={onInputChanged}
                />
                <br/>
                <MyButton
                    backgroundColor="#000000"
                    color="#FFFFFF"
                    text="Login"
                    width="150px"
                    type="submit"
                />
            </form>
            <br/><br/>
            <SignUp>Don't have an account?</SignUp>
            <MyButton
                backgroundColor="#D9D9D9"
                color="#000000"
                text="Sign Up"
                width="150px"
                type="button"
                onClick={navToSignUp}
            />
        </AppDiv>
    )
}

export default Login;