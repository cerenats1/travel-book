
import { doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

/**
 * @param {string} placeId 
 */
export async function deleteFavoritePlace(placeId) {
  const user = auth.currentUser;
  if (!user) return;

  const placeRef = doc(db, 'users', user.uid, 'favorites', placeId);
  await deleteDoc(placeRef);
}
