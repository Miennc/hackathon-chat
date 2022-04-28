import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const [error, setError] = useState('')
    let navigate = useNavigate();
    // const validate = () => {
    //     if (!email) {
    //         alert('Email is required')
    //         return;
    //     } else if (!/\S+@\S+\.\S+/.test(email)) {
    //         alert('Email is invalid')
    //         return;
    //     } else if (!password) {
    //         alert('Password is required')
    //         return;
    //     }
    // }
    const _doLogin = async (evt) => {
        evt.preventDefault();
        if (!email) {
            alert('Email is required')
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            alert('Email is invalid')
            return;
        } else if (!password) {
            alert('Password is required')
            return;
        } else {
            try {
                const resp = await signInWithEmailAndPassword(auth, email, password);
                console.log(resp.user);
                alert('Login success')
                sessionStorage.setItem('user',JSON.stringify(resp.user));
                navigate('/')
            } catch (e) {
                alert("Ko đăng nhập đc bạn ei, non")
                console.error(e);
            }
        }
    }
    return (
        <div className="container mx-auto ">
            <div className="bg-green-300 h-screen w-screen">
                <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
                    <div className="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2 bg-white sm:mx-0" style={{ height: '500px' }}>
                        <div className="flex flex-col w-full md:w-1/2 p-4">
                            <div className="flex flex-col flex-1 justify-center mb-8">
                                <h1 className="text-4xl text-center font-thin">Login </h1>
                                <div className="w-full mt-4">
                                    <form className="form-horizontal w-3/4 mx-auto" method="POST" action="#" onSubmit={_doLogin}>
                                        <div className="flex flex-col mt-4">
                                            <input id="email" type="text" className="flex-grow h-8 px-2 border rounded border-grey-400" name="email" placeholder="Email"
                                                onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                        <div className="flex flex-col mt-4">
                                            <input id="password" type="password" className="flex-grow h-8 px-2 rounded border border-grey-400" name="password" required placeholder="Password"
                                                onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <input type="checkbox" name="remember" id="remember" className="mr-2" /> <label htmlFor="remember" className="text-sm text-grey-dark">Remember Me</label>
                                        </div>
                                        <div className="flex flex-col mt-8">
                                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded"
                                            >
                                                Login
                                            </button>
                                        </div>
                                    </form>
                                    <div className="text-center mt-4">
                                        <a className="no-underline hover:underline text-blue-dark text-xs" href="{{ route('password.request') }}">
                                            Forgot Your Password?
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block md:w-1/2 rounded-r-lg" style={{ background: 'url("https://images.unsplash.com/photo-1515965885361-f1e0095517ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80")', backgroundSize: 'cover', backgroundPosition: 'center center' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login