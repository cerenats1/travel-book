
import { db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth } from "./firebase";

export async function addFavoritePlace(place) {
  const user = auth.currentUser;
  if (!user) {
    console.log("Kullanıcı oturum açmamış.");
    return;
  }

  const uid = user.uid;
  const placeId = `${place.latitude}_${place.longitude}`; 

  const placeRef = doc(collection(db, "users", uid, "favorites"), placeId);

  try {
    const placeName = place.name?.trim() || "İsimsiz Yer";

    await setDoc(placeRef, {
      name: placeName,
      latitude: place.latitude,
      longitude: place.longitude,
      addedAt: new Date().toISOString(),
    });

    console.log("Favori yer kaydedildi:", placeName);
  } catch (error) {
    console.error("Favori yer kaydedilirken hata:", error);
  }
}
