
import { db, auth } from './firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';


export async function getFavoritePlaces() {
  const user = auth.currentUser;
  if (!user) return [];


  const favRef = collection(db, 'users', user.uid, 'favorites');
  const snapshot = await getDocs(favRef);

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


export function subscribeToFavoritePlaces(callback) {
  const user = auth.currentUser;
  if (!user) return () => {};


  const favRef = collection(db, 'users', user.uid, 'favorites');

  return onSnapshot(
    favRef,
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
    err  => {
      console.error('Favoriler alınamadı:', err);
      callback([]);
    }
  );
}
