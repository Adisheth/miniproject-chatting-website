import React, { useState, useEffect, useRef } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../../Server/Firebase.js';
import CryptoJS from 'crypto-js';
import { IoMdClose } from 'react-icons/io';
import { MdModeEditOutline } from 'react-icons/md';

const SECRET_KEY = 'your-secret-key';

function Sidebar() {
  const [photoURL, setPhotoURL] = useState('');
  const [userName, setUserName] = useState('');
  const [isUserChangeHidden, setIsUserChangeHidden] = useState(true);
  const [formValue, setFormValue] = useState('');
  const fileInputRef = useRef(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;
    const userRef = firestore.collection('users').doc(user.uid);

    const fetchUserProfile = async () => {
      try {
        const userDoc = await userRef.get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setUserName(userData.userName || '');
          if (userData.profileImage) {
            setPhotoURL(decryptImage(userData.profileImage));
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const encryptImage = (base64String) => CryptoJS.AES.encrypt(base64String, SECRET_KEY).toString();
  const decryptImage = (cipherText) => {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return '';
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const encryptedData = encryptImage(reader.result);
      setPhotoURL(reader.result);

      try {
        await firestore.collection('users').doc(user?.uid).update({ profileImage: encryptedData });
      } catch (error) {
        console.error('Error updating profile image:', error);
      }
    };
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await firestore.collection('users').doc(user.uid).update({ userName: formValue || userName });
      setUserName(formValue || userName);
      setFormValue('');
      setIsUserChangeHidden(true);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="relative px-3 h-screen w-[10vh] bg-black flex flex-col items-center">
      {/* Profile Edit Modal */}
      <div
        className={`absolute z-10 bg-gray-100 w-[400px] h-[400px] rounded-xl flex flex-col items-center py-2 ${
          isUserChangeHidden ? 'hidden' : ''
        }`}
      >
        <h1 className="font-semibold mb-4 mt-2">Profile</h1>
        <IoMdClose onClick={() => setIsUserChangeHidden(true)} className="cursor-pointer absolute right-5 top-2" />

        <form onSubmit={handleUserSubmit} className="flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full border border-black flex justify-center items-center">
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden />
            <img
              className="w-full h-full object-cover rounded-full"
              src={photoURL || 'default-avatar-url'}
              alt="Profile"
            />
            <div
              className="absolute w-full h-full rounded-full cursor-pointer bg-black opacity-0 hover:opacity-40 flex justify-center items-center"
              onClick={() => fileInputRef.current.click()}
            >
              <MdModeEditOutline className="text-2xl text-white" />
            </div>
          </div>

          <input
            className="mt-4 p-2 rounded-xl text-[15px] border border-gray-300"
            type="text"
            placeholder="Enter new username"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <button className="bg-gray-700 mt-3 p-2 rounded-xl text-white text-lg w-full" type="submit">
            Save
          </button>
        </form>
      </div>

      {/* Profile Picture */}
      <div className="w-12 h-12 rounded-full flex justify-center items-center bg-gray-800">
        <img
          onClick={() => setIsUserChangeHidden(false)}
          className="cursor-pointer w-full h-full object-cover rounded-full"
          src={photoURL || 'default-avatar-url'}
          alt="Profile"
        />
      </div>
    </div>
  );
}

export default Sidebar;
