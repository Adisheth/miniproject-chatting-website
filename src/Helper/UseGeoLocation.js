import  { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
// import {GeoFireStore} from "geofirestore"
import { firestore,auth } from "../Server/Firebase.js";


function UseGeoLocation() {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: '', lng: '' },
  
  });

  const onSuccess = (location) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
   
    });
   // Save or update the user's location in Firestore
   const { latitude, longitude } = location.coords;

   if (auth.currentUser) {
     const userId = auth.currentUser.uid;
     const userLocationRef = firestore.collection('locations').doc(userId);

     userLocationRef
       .get()
       .then((doc) => {
         if (doc.exists) {
           // Update the existing location document
           return userLocationRef.update({
             latitude,
             longitude,
             lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
           });
         } else {
           // Create a new location document
           return userLocationRef.set({
             latitude,
             longitude,
             lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
           });
         }
       })
       .then(() => {
         console.log('User location updated successfully');
       })
       .catch((error) => {
         console.error('Error updating user location:', error);
       });
   }
  };

  const onError = (err) => {
    setLocation({
      loaded: true,
      coordinates: { lat: '', lng: '' },
      error: err,
    });
  };

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      onError({
        code: 0,
        message: 'Geolocation not supported',
      });
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  }, []);
  
 return location;

}

export default UseGeoLocation;
