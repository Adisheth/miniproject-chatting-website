
// SignOut.js
import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { PiSignOutBold } from 'react-icons/pi';

const auth = firebase.auth();

function SignOut() {
    return auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}><PiSignOutBold/></button>
    )
  }
  
export default SignOut;
