import './upload'
import '../scss/styles.scss'
import {initializeApp} from 'firebase/app'
import {getStorage,ref,uploadBytes,uploadBytesResumable,getDownloadURL} from 'firebase/storage'
import { Upload } from './upload'
         // uploadBytes(storageRef, file).then((snapshot) => {
         //    console.log(snapshot)
         // },err =>{
         //    console.log(err)
         // },
         // () =>{
         //    console.log('Complite')
         // })
const firebaseConfig = {
   apiKey: "AIzaSyCllUMC5CUslqCl81F2mpIhAI9KVEPfdJs",
   authDomain: "fileclient.firebaseapp.com",
   projectId: "fileclient",
   storageBucket: "fileclient.appspot.com",
   messagingSenderId: "69809882747",
   appId: "1:69809882747:web:ed991e618205f09f2304de"
}
const app = initializeApp(firebaseConfig)
const storage = getStorage()
Upload('file',{
   multi:true,
   accept:[
      '.png',
      '.jpg',
      '.jpeg',
      '.gif'
   ],
   onUpload(files,elements){
      files.forEach((file,idx) =>{
         const storageRef = ref(storage,`images/${file.name}`)

         const uploadTask = uploadBytesResumable(storageRef,file)

         uploadTask.on('state_changed',snapshot =>{
            const percent = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
            const block = elements[idx].querySelector('.preview__info-progress')
            block.textContent = percent + '%'
            block.style.width = percent + '%'
         },err =>{
            console.log(err)
         },
         () =>{
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
               console.log('File available at', url);
            });
         })
      })
   }
})