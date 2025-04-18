
import React, { useRef, useState, useEffect } from 'react';
import { auth, firestore } from './Server/Firebase.js';
import UseGeoLocation from './Helper/UseGeoLocation.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import SignIn from './Components/SignIn.js';
import SignOut from './Components/SignOut.js';
import { ChatRoom } from './Components/Chatroom.js';  
import MainPage from './Components/MainPage/MainPage.js';
import { BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import './Style.css';

function App() {
  const [user] = useAuthState(auth);
  // const location = UseGeoLocation();



  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/" element={user ? <MainPage /> : <SignIn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

