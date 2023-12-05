"use client"
import app from "./config";
import {ref as sRef, uploadBytes, getStorage, getDownloadURL} from 'firebase/storage'
import { child, get, getDatabase, ref, set, equalTo, query, orderByChild, push, onChildChanged, onChildAdded} from 'firebase/database'
import { User } from "firebase/auth";

const db = ref(getDatabase(app),"dmu/map");
const st = getStorage(app)

export function updateMap(cb){
  onChildAdded(db,(ss,pc) =>{
    if (ss.exists()) {
      cb(rfr)
    }
  })
}

export async function submitData(d,cb){
  await push(db,d).then(cb);
}
export {db}