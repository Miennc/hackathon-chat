import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Home from './components/Home';
import Chat from './components/Chat';
import Login from './components/Login';
import Signup from './components/Signup';
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
          <Route path="/signup" element={<Signup />} ></Route>
          <Route path="/login" element={<Login />} ></Route>
        </Routes>
        {/* <Link to={`/about?name=mien&age=20`}>about</Link> */}
      </BrowserRouter>

    </div>
  )
}
