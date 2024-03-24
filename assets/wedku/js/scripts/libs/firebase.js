import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDg801cjvaqmzjtyBOpjCOvSQqZbGmFVLk",
    authDomain: "fahmihdytlloh.firebaseapp.com",
    projectId: "fahmihdytlloh",
    storageBucket: "fahmihdytlloh.appspot.com",
    messagingSenderId: "433711684808",
    appId: "1:433711684808:web:ad3991254219af8385d9fd",
    measurementId: "G-J18EJWS5QF"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

window.uploadFile = async function(nm, file){
  try{
    const imgRef = ref(storage, `wedding/fam_${Date.now()}_${nm}`);
    const upld = await uploadBytes(imgRef, file);
    const dlu = await getDownloadURL(ref(storage, upld.metadata.fullPath));
    return dlu;
  }catch(e){
    console.log(e)
  }
}