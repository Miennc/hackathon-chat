import React, { useEffect, useState } from 'react';
import { getAuth, signInWithCustomToken, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, onSnapshot, addDoc, query, where } from 'firebase/firestore';
import { db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
function Home(props) {
    const [users, setUsers] = useState([])
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')))
    let navigate = useNavigate();
    useEffect(() => {
        const collectionRef = collection(db, 'users');

        onSnapshot(collectionRef, (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            setUsers(users);
        }
        );
        }, [])

    const logOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            sessionStorage.removeItem('user');
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        });
    }
    return (
        <div>
            <div className='flex flex-col items-center justify-center min-h-screen p-16 bg-slate-200'>
                <div className='flex w-full justify-center items-center'>
                    <div className="flex justify-between items-center mx-10">
                        {
                            user ? <div className="text-4xl font-bold">Home</div> : <button className='p-3 bg-green-600 text-white text-lg rounded'>
                                <Link to='/signup'>RESGISTER</Link>
                            </button>
                        }
                        {
                            user && <button className='p-3 mx-2 bg-green-600 text-white text-lg rounded' onClick={logOut}>Logout</button>
                        }

                        <div>
                            {
                                user ? <span className=" text-white p-3 bg-green-600  text-lg mx-2 rounded">{user.email}</span>
                                    :
                                    <button className='p-3 bg-green-600 text-white text-lg mx-2 rounded'>
                                        <Link to='/login'>LOGIN</Link>
                                    </button>
                            }
                        </div>

                    </div>
                </div>
                <div className="mb-4">
                </div>
                <div className='user-list w-full max-w-lg mx-auto bg-white rounded-xl shadow-xl flex flex-col py-4'>
                    {users?.map((item, index) => {
                        return (
                            <div className="user-row flex flex-col items-center justify-between cursor-pointer  p-4 duration-300 sm:flex-row sm:py-4 sm:px-8 hover:bg-[#f6f8f9]" key={index}>
                                <div className="user flex items-center text-center flex-col sm:flex-row sm:text-left">
                                    <div className="avatar-content mb-2.5 sm:mb-0 sm:mr-2.5">
                                        <img className="avatar w-20 h-20 rounded-full" src="https://randomuser.me/api/portraits/men/32.jpg" />
                                    </div>
                                    <div className="user-body flex flex-col mb-4 sm:mb-0 sm:mr-4">
                                        <a href="#" className="title font-medium no-underline">{item.email}</a>
                                    </div>
                                </div>
                                <div className="user-option mx-auto sm:ml-auto sm:mr-0">
                                    <button  className="btn inline-block select-none no-underline align-middle cursor-pointer whitespace-nowrap px-4 py-1.5 rounded text-base font-medium leading-6 tracking-tight text-white text-center border-0 bg-[#6911e7] hover:bg-[#590acb] duration-300" type="button">
                                        {
                                            user ? <Link to={`/chat?email=${item.email}&id=${item.userId}`}>Chat</Link> : <Link to='/login'>Chat</Link>
                                        }
                                    </button >
                                </div>
                            </div>
                        )
                    })}

                    <a className="show-more block w-10/12 mx-auto py-2.5 px-4 text-center no-underline rounded hover:bg-[#f6f8f9] font-medium duration-300" href="#/">Show more members</a>
                </div>
            </div>
        </div>
    );
}

export default Home;
