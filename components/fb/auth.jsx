import app from "./config";
import { getAuth, signInAnonymously, GoogleAuthProvider, signOut } from "firebase/auth";
import { createUser } from "./db";
import { redirect } from "next/navigation";

const auth = getAuth(app);

function getUser(){
    const user = auth.currentUser;
    console.log(user)
    if (user !== null) {
        return user
    }
    return null;
}

function signin(){
  return signInAnonymously(auth)
}

function signout(){
  signOut(auth).then(()=>{
    window.location.href = '/signin'
  })
}

export {auth, signin, signout, getUser}