import React, { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key'; // Ensure this matches the key used for encryption

function Participants() {
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    const firestore = getFirestore();
    const usersRef = collection(firestore, 'users');

    // Subscribe to real-time updates of user profiles
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const profiles = snapshot.docs.map((doc) => {
        const { userName, profileImage: encryptedImage, online } = doc.data();
        let decryptedImage = '';

        if (encryptedImage) {
          try {
            const bytes = CryptoJS.AES.decrypt(encryptedImage, SECRET_KEY);
            const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
            decryptedImage = decryptedText ? `data:image/png;base64,${decryptedText}` : '';
          } catch (error) {
            console.error('Error decrypting image:', error);
          }
        }

        return { id: doc.id, userName, profileImage: decryptedImage, online };
      });

      setUserProfiles(profiles);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full h-full bg-[#292a2e] p-3">
      <h3 className="uppercase font-[roboto] text-[13px]">Participants</h3>
      <ul>
        {userProfiles.map(({ id, userName, online, profileImage }) => (
          <li key={id} className="flex items-center space-x-6 mt-3">
            <div className="relative">
              <img
                className="w-12 h-12 object-cover rounded-full"
                src={profileImage || '/default-avatar.png'}
                alt={`${userName}'s profile`}
                onError={(e) => (e.target.src = '/default-avatar.png')} // Fallback for broken images
              />
              <div
                className={`absolute -right-[5px] bottom-[2px] w-4 h-4 rounded-full ${
                  online ? 'bg-[#23a55a]' : 'bg-[#2b2d31]'
                }`}
              ></div>
            </div>
            <h1 className="font-[roboto] text-[14px]">{userName}</h1>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Participants;
