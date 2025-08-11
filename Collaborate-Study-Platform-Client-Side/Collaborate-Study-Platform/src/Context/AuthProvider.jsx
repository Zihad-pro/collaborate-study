import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { auth } from "../Firebase/FIrebase.init";
const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // google login
  const SignInGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, provider);
  };
  // register
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  // Login
  const logInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // logOut
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };
  // user update
  const UpdateUserProfile = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  // security grad
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      return () => {
        unSubscribe();
      };
    });
  }, []);

  const authInfo = {
    loading,
    user,
    SignInGoogle,
    registerUser,
    logInUser,
    logOut,
    UpdateUserProfile,
  };
  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
