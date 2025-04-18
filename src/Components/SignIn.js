import React from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "../Style/SignIn.css";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../Server/Firebase";
import CryptoJS from "crypto-js";

const encryptData = (data) => {
  try {
    const secretKey = "your-secret-key"; // Replace with a secure key
    return CryptoJS.AES.encrypt(data, secretKey).toString();
  } catch (error) {
    console.error("Error encrypting data:", error);
    return null;
  }
};

const convertToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch image");
    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to Base64:", error);
    return null;
  }
};

const SignIn = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await auth.signOut();
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      console.log("Signed in with Google:", user);

      const userRef = firestore.collection("users").doc(user.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        console.log("User does not exist, creating profile");
        const googleProfile = result.additionalUserInfo.profile;
        const displayName = googleProfile.name;
        const photoURL = googleProfile.picture;

        let encryptedImage = null;
        if (photoURL) {
          const base64Image = await convertToBase64(photoURL);
          encryptedImage = base64Image ? encryptData(base64Image) : null;
        }

        await userRef.set({
          userName: displayName,
          profileImage: encryptedImage,
        });
      }

      navigate("/"); // Navigate to home after successful sign-in
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "dischat-main/src/Components/social-media-sketch-vector-seamless-600nw-1660950727.png",  
      }}
    >
      <div className="bg-[#1e1f24]/90 backdrop-blur-md rounded-2xl shadow-2xl w-[90vw] max-w-md h-auto px-8 py-10 flex flex-col items-center text-center">
        <h1 className="mb-4 text-3xl lg:text-4xl font-bold text-white font-[Poppins]">
          Welcome to Dischat
        </h1>
        <p className="text-gray-300 mb-8 text-sm lg:text-base">
          Join the conversation. Connect with your people instantly.
        </p>
        <button
          className="bg-white w-full max-w-xs h-12 lg:h-14 rounded-full text-sm lg:text-lg font-medium flex justify-center items-center gap-3 text-black transition hover:bg-gray-200 active:scale-95"
          onClick={signInWithGoogle}
        >
          <FcGoogle className="text-xl" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
  
  }  

export default SignIn;
