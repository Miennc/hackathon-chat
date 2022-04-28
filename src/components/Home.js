import React, {useEffect, useState} from 'react';
import { getAuth, signInWithCustomToken ,onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc, onSnapshot, addDoc, query, where } from 'firebase/firestore';
import { db } from "../firebase";
import { Link } from "react-router-dom";
function Home(props) {
    const [users,setUsers] = useState([])
    const [isOnline, setIsOnline] = useState(false)
    useEffect(()=>{
        const collectionRef = collection(db, 'users');

        onSnapshot(collectionRef, (querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push({
                    ...doc.data(),
                    id: doc.id
                });
                setIsOnline(!doc.data().isOnline)
            });
            setUsers(users);
        }
        );
        console.log(users)
    },[])

    return (
        <div>
            <div className='flex flex-col items-center justify-center min-h-screen p-16 bg-slate-200'>
                <h1 className="my-10 font-medium text-3xl sm:text-4xl font-black">
                    Follow a Members
                    <span className="day block" >😎</span>
                    <span className="night hidden" >👀</span>
                </h1>
                <div className="mb-4">
                    <button className="toggle-theme btn inline-block select-none no-underline align-middle cursor-pointer whitespace-nowrap px-4 py-1.5 rounded text-base font-medium leading-6 tracking-tight text-white text-center border-0 bg-[#6911e7] hover:bg-[#590acb] duration-300" type="button">Dark</button>
                </div>
                <div className='user-list w-full max-w-lg mx-auto bg-white rounded-xl shadow-xl flex flex-col py-4'>
                    {users?.map((item,index)=>{
                        return(
                            <div className="user-row flex flex-col items-center justify-between cursor-pointer  p-4 duration-300 sm:flex-row sm:py-4 sm:px-8 hover:bg-[#f6f8f9]" key={index}>
                                <div className="user flex items-center text-center flex-col sm:flex-row sm:text-left">
                                    <div className="avatar-content mb-2.5 sm:mb-0 sm:mr-2.5">
                                        <img className="avatar w-20 h-20 rounded-full" src="https://randomuser.me/api/portraits/men/32.jpg"/>
                                    </div>
                                    <div className="user-body flex flex-col mb-4 sm:mb-0 sm:mr-4">
                                        <a href="#" className="title font-medium no-underline">{item.email}</a>
                                    </div>
                                </div>
                                <span>{item.isOnline ? 'onlinne' : 'offline'}</span>
                                <div className="user-option mx-auto sm:ml-auto sm:mr-0">
                                    <button className="btn inline-block select-none no-underline align-middle cursor-pointer whitespace-nowrap px-4 py-1.5 rounded text-base font-medium leading-6 tracking-tight text-white text-center border-0 bg-[#6911e7] hover:bg-[#590acb] duration-300" type="button">
                                        <Link to={`/chat?email=${item.email}&id=${item.userId}`}>chat</Link>
                                    </button>
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