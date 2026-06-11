import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";
import path from "path";

const envPath = path.resolve(".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");

const config = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*NEXT_PUBLIC_([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    config[match[1]] = match[2].replace(/['"]/g, "").trim();
  }
});

const firebaseConfig = {
  apiKey: config.FIREBASE_API_KEY,
  authDomain: config.FIREBASE_AUTH_DOMAIN,
  projectId: config.FIREBASE_PROJECT_ID,
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  console.log("Querying users...");
  const snap = await getDocs(collection(db, "users"));
  console.log(`Found ${snap.size} users:`);
  snap.forEach((doc) => {
    const data = doc.data();
    console.log(`User ID: ${doc.id}`);
    console.log(`  Name: ${data.name}`);
    console.log(`  Email: ${data.email}`);
    console.log(`  Role: ${data.role}`);
    console.log(`  Seller Status: ${data.sellerStatus}`);
    console.log(`  Shop Name: ${data.sellerInfo?.shopName}`);
    console.log("------------------");
  });
}

test()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
