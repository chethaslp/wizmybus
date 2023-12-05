import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDS43ywmEggiT2oGLzDV_OOqtIAV0kJiYE",
  authDomain: "devprojectsclp.firebaseapp.com",
  projectId: "devprojectsclp",
  storageBucket: "devprojectsclp.appspot.com",
  // databaseURL: "https://devprojectsclp-default-rtdb.firebaseio.com",
  messagingSenderId: "116707340006",
  appId: "1:116707340006:web:74a4ad0b2bdc716a79d527"
};
const app = initializeApp(firebaseConfig);

export default app;
