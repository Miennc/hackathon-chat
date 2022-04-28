import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { useSearchParams } from 'react-router-dom';
import {getStorage, uploadBytes, ref, getDownloadURL} from "firebase/storage";
import { collection, getDocs, deleteDoc, doc, onSnapshot, getDoc, query, where, addDoc,orderBy, limit,} from 'firebase/firestore';
function Chat(props) {
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const [dataMessage, setDataMessage] = useState([]);
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
    const [userEmail, setUserEmail] = useState(searchParams.get('email'));
    const [userId, setUserId] = useState(searchParams.get('id'));
    const [selectedImages, setSelectedImage] = useState([]);
    const [file_name, setFile_name] = useState([]);
    const [files,setFiles] = useState([]);
    const [showModal,setShowModal] = useState(false);
    const [previewImage,setPreviewImage] = useState('')
    const [audio,setAudio] = useState(null)
    let unSub = null;

    const postMessage = async (e) => {

        e.preventDefault();
        const storage = getStorage();//base storage //unix
        if (!message) {
            alert("ghi rồi mới submit bạn êiiii");
            return;
        }  
        
        const urls = []
        for (let i = 0;i < file_name.length;i++) {
            for (let j = 0;j < file_name[i].length;j++) {
                try{
                    const fileName = `images/${Date.now()}image.png`;
                    const myRef = ref(storage, fileName);//tao ref
                    await uploadBytes(myRef, file_name[i][j], fileName);
                    const pathRef = ref(storage, fileName);
                    const url = await getDownloadURL(pathRef);
                    console.log(url);
                    urls.push(url);
                }catch(e) {
                    alert(e)
                }
            }
        }

        
        const urlAudio = []
        try {
            const fileName = `audios/${Date.now()}audio.mp4`;
            const myRef = ref(storage, fileName);//tao ref
            await uploadBytes(myRef, audio, fileName);
            //lưu lại file vào firestore
            const pathRef = ref(storage, fileName);
            const url = await getDownloadURL(pathRef);
            urlAudio.push(url);
        } catch (e) {
            alert("lỗi")
        }

        const collectionRef = collection(db, 'chat');
        await addDoc(collectionRef, {
            message: message, 
            uid: user.uid, 
            date: new Date(), 
            userUid: [user.uid, userId],
            urls:urls,
            urlAudio:urlAudio[0],
        });
        document.getElementById('messages').scrollTo(0, 1000000);
        setMessage('');
        setFile_name([]);
        setSelectedImage([]);
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
                        date: doc.data().date,
                        urls: doc.data().urls,
                        urlAudio:doc.data().urlAudio
                    });
                });
                setDataMessage(localMessage);
            });
            
        })();
        document.getElementById('messages').scrollTo(0, 1000000);
    }, []);

    const imageChange = (e) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
            setSelectedImage((prevImages) => prevImages.concat(fileArray));
            const file_names = Array.from(e.target.files).map((file) => (file))
            setFile_name(file_name => [...file_name, file_names]);
            Array.from(e.target.files).map(
                (file) => URL.revokeObjectURL(file)
            )
        }
    };

    const renderPhotos = (source) => {
        return source.map((photo, index) => {
            return (<div className="w-40 h-40 relative" key={index}>
                <img className="w-40 h-40 object-cover shadow" type="img" src={photo} key={photo} />
                <i className="w-6 h-6 absolute z-10 top-2 left-32 rounded-full text-center flex items-center justify-center cursor-pointer opacity-30 hover:opacity-100 hover:bg-gray-200 bg-gray-300 text-2xl" onClick={removeSelectedImage.bind(this, index)}>x<ion-icon name="close-outline"></ion-icon></i>
            </div>)
        })
    };

    const removeSelectedImage = (index) => {
        const arr = [...selectedImages];
        const postImg = [...file_name];
        arr.splice(index, 1);
        setSelectedImage(arr);
        postImg.splice(index, 1)
        setFile_name(postImg);
    };

    const prevImage = (img) =>{
        setPreviewImage(img);
        setShowModal(true);
    }

    const audioChange = (e) =>{
        setAudio(e.target.files[0]);
    }

    // const DeleteNote = async (id) => {
    //     const docRef = doc(db, 'chat', id);
    //     await deleteDoc(docRef)
    // }
    return (
        <div>
            <div className=" bg-slate-200">
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
                        <div className={showModal ? "relative w-100vw h-100vh bg-gray-500" : "hidden"}>
                        <div className="w-100vw top-0 left-0 ">
                                <img className="w-auto object-cover mx-auto" src={previewImage} alt=""  />
                                <span className="absolute right-3 top-0 text-2xl cursor-pointer" onClick={()=>{setShowModal(!showModal)}}>x</span>
                            </div>
                        </div>
                        <div id="messages"
                            className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
                            {
                                dataMessage?.sort((a,b)=>a.date - b.date)?.map((messageItem, messageIndex) => {
                                    return (
                                        <div>
                                            <div className="chat-message">
                                                <div className={user.uid === messageItem.uid ? "flex items-end justify-end" : "flex items-end"}>
                                                    <div className={user.uid === messageItem.uid ? "flex flex-col space-y-2 text-xs order-1 max-w-xs mx-2 items-end" : "flex flex-col space-y-2 text-xs order-2 max-w-xs mx-2 items-end"}>
                                                    {
                                                        messageItem?.urls?.map((img,index) => {
                                                            return(
                                                                <img className="cursor-pointer" src={img} alt="" key={index} onClick={()=>prevImage(img)}/>
                                                            )
                                                        })
                                                    }
                                                    
                                                        <div>
                                                            <audio controls>
                                                                <source src={messageItem?.urlAudio} type="audio/ogg" />
                                                                <source src={messageItem?.urlAudio} type="audio/mpeg" />
                                                                Your browser does not support the audio element.
                                                            </audio>
                                                        </div>
                                                   
                                                        <div><span
                                                            className={user.uid === messageItem.uid ? "px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white  text-xl" : "px-4 py-2 rounded-lg inline-block rounded-br-none bg-pink-600 text-white text-xl"}>{messageItem.message} </span>
                                                     
                                                        </div>
                                                        <div>{messageItem.idIncrement}</div>
                                                        <div>
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
                         <div>
                            {selectedImages && (
                                <div className="w-max space-x-4 flex">
                                    {renderPhotos(selectedImages)}
                                </div>
                            )}
                         </div>
                      <div className="flex items-center">
                      <label for="fileImg" className=" cursor-pointer mx-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" className="h-6 w-6 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <input type="file" id="fileImg" onChange={imageChange} accept="image/*" multiple
                                    className="inline-flex hidden items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                            />
                        </label>
                        <label for="mic" className="absolute inset-y-0 flex items-center">
                            <input type="file" id="mic" onChange={audioChange} accept="audio/*"
                                    className="hidden inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"/>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="h-6 w-6 text-gray-600">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                            </svg>
                        </label>
                         <input type="text" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Aa"  className="border-2 border-green-400 w-96 p-2"/>
                      

                      </div>
                     </form>
                     
                </div>
            </div>
        </div>
        </div >
    );

}

export default Chat;