import { firebaseConfig } from './config';
import { initializeApp } from 'firebase/app'
import {
	getFirestore,
	collection,
	getDocs,
} from 'firebase/firestore'
import { getDownloadURL, getStorage, ref } from "firebase/storage";


export const appDB = initializeApp(firebaseConfig)
export const db = getFirestore()
export const appStorage = getStorage(appDB);



const storageRef = ref(appStorage, 'Portfolio/1.png');

getDownloadURL(storageRef).then((url) => {
  
}).catch((error) => {
  console.error(error);
});





const navRef = collection(db, 'Navigation')

export const collectionNav = getDocs(navRef).then(ss => {
	ss.docs.map(doc => doc.data())
})




getDocs(navRef).then(ss => {
	ss.docs.forEach(doc => {
		const t = doc.data()
	})
})
