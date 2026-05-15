import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const listings = JSON.parse(readFileSync("./listings.json", "utf8"));

async function upload() {
  const colRef = db.collection("listings");
  let success = 0;
  let failed = 0;

  for (const listing of listings) {
    try {
      await colRef.doc(listing.listing_no).set({
        ...listing,
        price: Number(listing.price),
        area: Number(listing.area),
        floor: Number(listing.floor),
        total_floors: Number(listing.total_floors),
        building_age: Number(listing.building_age),
      });
      console.log(`Yüklendi: ${listing.listing_no}`);
      success++;
    } catch (err) {
      console.error(`Hata (${listing.listing_no}):`, err.message);
      failed++;
    }
  }

  console.log(`\n Tamamlandı: ${success} başarılı, ${failed} hatalı`);
}

upload();
