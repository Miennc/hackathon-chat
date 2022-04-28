import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase";
import { collection, getDocs, deleteDoc, doc, onSnapshot, addDoc, query, where } from 'firebase/firestore';
import '../../src/App.css';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    let navigate = useNavigate();
    const submitForm = async (evt) => {
        console.log(1)
        evt.preventDefault();
        if (email === '' || password === '') {
            alert('Please fill all the fields')
        } else if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            alert('Please enter a valid email')
        } else if (password.length < 6) {
            alert('Password must be at least 6 characters')
        } else if (password.length > 20) {
            alert('Password must be less than 20 characters')
        } else {
            try {
                const response = await createUserWithEmailAndPassword(auth, email, password);
                const collectionRef = collection(db, 'users');
                console.log(response.user.email);
                await addDoc(collectionRef, {
                    email: response.user.email,
                    userId: response.user.uid,
                 });
                alert('Register success')
                navigate('/login')
            } catch (error) {
                console.log(error);
                alert('Registration Failed')
            }
        }

    };
    return (
        <div className="container mx-auto ">
            <div className="bg-green-300 h-screen w-screen">
                <div className="flex flex-col items-center flex-1 h-full justify-center px-4 sm:px-0">
                    <div className="flex rounded-lg shadow-lg w-full sm:w-3/4 lg:w-1/2 bg-white sm:mx-0" style={{ height: '500px' }}>
                        <div className="flex flex-col w-full md:w-1/2 p-4">
                            <div className="flex flex-col flex-1 justify-center mb-8">
                                <h1 className="text-4xl text-center font-thin">Register </h1>
                                <div className="w-full mt-4">
                                    <form className="form-horizontal w-3/4 mx-auto" method="POST" action="#" onSubmit={submitForm}>
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
                                                Register
                                            </button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block md:w-1/2 rounded-r-lg" style={{ background: 'url("https://images.unsplash.com/photo-1515965885361-f1e0095517ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80")', backgroundSize: 'cover', backgroundPosition: 'center center' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Signup;