import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, onSnapshot, getDoc, query, where, addDoc, orderBy, limit, } from 'firebase/firestore';
function Chat(props) {
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const [dataMessage, setDataMessage] = useState([]);
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
    const [userEmail, setUserEmail] = useState(searchParams.get('email'));
    const [userId, setUserId] = useState(searchParams.get('id'));
    let unSub = null;

    const postMessage = async (e) => {
        e.preventDefault();
        if (!message) {
            alert("ghi rồi mới submit bạn êiiii");
            return;
        }
        const collectionRef = collection(db, 'chat');
        await addDoc(collectionRef, {
            message: message, uid: user.uid, date: Date.now(), userUid: [user.uid, userId]
        });
        setMessage('');
    }

    useEffect(() => {
        (async () => {
            const collectionRef = collection(db, 'chat');
            const collectionQuery = query(collectionRef, where('userUid', 'in', [[userId, user.uid], [user.uid, userId]]));

            unSub = onSnapshot(collectionQuery, (snapShot) => {
                const localMessage = [];
                snapShot.forEach(doc => {
                    localMessage.push({
                        id: doc.id,
                        message: doc.data().message,
                        uid: doc.data().uid,
                        date: doc.data().date
                    });
                });
                setDataMessage(localMessage);
            });
        })();


    }, []);

    // const deleteNote = async (id) => {
    //     const docRef = doc(db, 'chat', id);
    //     await deleteDoc(docRef)
    // }
    return (
        <div>
            <div className=" bg-green-300">
                <div className="w-10/12 bg-white mx-auto">
                    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
                        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                            <div className="relative flex items-center space-x-4">
                                <div className="relative">
                                    <span className="absolute text-green-500 right-0 bottom-0">
                                        <svg width="20" height="20">
                                            <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                                        </svg>
                                    </span>
                                    <img
                                        src="https://taimienphi.vn/tmp/cf/aut/anh-gai-xinh-1.jpg"
                                        alt="" className="w-10 sm:w-16 h-10 sm:h-16 rounded-full object-cover" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <div className="text-2xl mt-1 flex items-center">
                                        <span className="text-gray-700 mr-3">{userEmail}</span>
                                    </div>
                                    <span className="text-lg text-gray-600">Junior Developer</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button type="button"
                                    className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" className="h-6 w-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </button>
                                <button type="button"
                                    className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" className="h-6 w-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                    </svg>
                                </button>
                                <button type="button"
                                    className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" className="h-6 w-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div id="messages"
                            className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                            {
                                dataMessage?.map((messageItem, messageIndex) => {
                                    return (
                                        <div>
                                            <div className="chat-message">
                                                <div className={user.uid === messageItem.uid ? "flex items-end justify-end" : "flex items-end"}>
                                                    <div className={user.uid === messageItem.uid ? "flex flex-col space-y-2 text-xs order-1 max-w-xs mx-2 items-end" : "flex flex-col space-y-2 text-xs order-2 max-w-xs mx-2 items-end"}>
                                                        <div><span
                                                            className={user.uid === messageItem.uid ? "px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white  text-xl" : "px-4 py-2 rounded-lg inline-block rounded-br-none bg-pink-600 text-white text-xl"}>{messageItem.message} </span>
                                                        </div>
                                                    </div>
                                                    <img
                                                        src={user.uid === messageItem.uid ? "https://taimienphi.vn/tmp/cf/aut/anh-gai-xinh-1.jpg" : "https://tophinhanh.com/wp-content/uploads/2021/12/hinh-anh-gai-xinh-nhat-the-gioi.jpg"}
                                                        alt="My profile" className={user.uid === messageItem.uid ? "w-6 h-6 rounded-full order-2 object-cover" : "w-6 h-6 rounded-full order-1 object-cover"} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }


                        </div>

                        <form onSubmit={postMessage}>
                            <input type="file" />
                            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Aa" className="border-2 border-green-400 w-96 p-2" />
                        </form>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Chat;