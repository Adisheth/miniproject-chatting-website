import React, { useRef, useState, useEffect } from 'react';
import { PiHashBold } from 'react-icons/pi';
import { AiFillBell } from 'react-icons/ai';
import { BsFillPeopleFill } from 'react-icons/bs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../../Server/Firebase.js';
import Participants from '../Participants/Participants.js';
import './Chats.css';
import CryptoJS from 'crypto-js';

const decryptData = (encryptedData) => {
  try {
    const secretKey = "your-secret-key"; // Replace with a secure key
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error:", error);
    return "default-avatar-url"; // Fallback image
  }
};

function Chats() {
  const [isParticipantHidden, setIsParticipantHidden] = useState(true);
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt', 'asc').limit(50);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [chatbotMessage, setChatbotMessage] = useState(null);
  const [formValue, setFormValue] = useState('');
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      setChatbotMessage({
        id: 'chatbot',
        text: `Welcome to DisChat, ${user.displayName || 'Guest'} 👋!`,
        createdAt: new Date(),
        photoURL: "data:image/png;base64,CHATBOT_BASE64_STRING",
      });

      setTimeout(() => {
        dummy.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!formValue.trim()) return;
  
    if (!auth.currentUser) {
      console.error("User not authenticated");
      return;
    }
  
    const { uid } = auth.currentUser;
    const userRef = firestore.collection('users').doc(uid);
    const userDoc = await userRef.get();
  
    const photoURL = userDoc.exists ? decryptData(userDoc.data().profileImage) : "default-avatar-url";
  
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });
  
    setFormValue('');
    setTimeout(() => dummy.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };
  

  const handleParticipantToggle = () => setIsParticipantHidden(!isParticipantHidden);

  return (
    <div className="relative">
      <header className="header p-3 py-4 font-semibold text-white font-[poppins] flex items-center justify-between px-10 z-10 h-[57px]">
        <div className="flex items-center w-auto">
          <div className="flex items-center text-center space-x-3 mr-[120vh]">
            <PiHashBold className="text-[#696c74] text-xl" />
            <h1>DisChat</h1>
          </div>
          <AiFillBell className="mr-10 text-2xl text-[#696c74] cursor-pointer" />
          <BsFillPeopleFill
            onClick={handleParticipantToggle}
            className="text-2xl text-[#696c74] cursor-pointer"
          />
        </div>
      </header>
      <div className="flex">
        <div className="chatArea-container">
          <div className={`chatArea ${isParticipantHidden ? 'w-[157vh]' : 'w-[118vh]'} h-[83vh] p-5 overflow-hidden overflow-y-scroll`}>
            {chatbotMessage && <ChatMessage message={chatbotMessage} isChatbot />}
            <span ref={dummy}></span>
            {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
            <span ref={dummy}></span>
          </div>
          <div className={`input-container flex flex-col justify-center px-20 h-[7vh] pt-3 ${isParticipantHidden ? 'w-[157vh]' : 'w-[118vh]'} `}>
            <form onSubmit={sendMessage}>
              <input
                className="w-full h-[40px] pl-3 rounded-xl outline-none text-[15px] bg-[#494b52]"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="Type Here"
              />
            </form>
          </div>
        </div>
        <div className={`${isParticipantHidden ? 'hidden' : 'block'} w-[40vh] h-screen`}>
          <Participants />
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message, isChatbot }) {
  const { text, uid, photoURL } = message;
  const messageClass = uid === auth.currentUser?.uid ? 'sent' : 'received';
  const decryptedPhotoURL = isChatbot ? photoURL : decryptData(photoURL);

  return (
    <div className={`message ${messageClass}`}>
      <img className="avatar" src={decryptedPhotoURL} alt="Avatar" />
      <p>{text}</p>
    </div>
  );
}

export { Chats, ChatMessage };
