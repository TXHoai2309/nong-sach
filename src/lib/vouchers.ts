import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, collection, query, where, onSnapshot, increment } from "firebase/firestore";
import { Voucher } from "@/types/voucher";

export async function createVoucher(voucher: Voucher): Promise<void> {
  const codeKey = voucher.code.toUpperCase().trim();
  const docRef = doc(db, "vouchers", codeKey);
  await setDoc(docRef, {
    ...voucher,
    code: codeKey,
  });
}

export async function stopVoucher(code: string): Promise<void> {
  const codeKey = code.toUpperCase().trim();
  const docRef = doc(db, "vouchers", codeKey);
  await updateDoc(docRef, {
    status: "stopped",
  });
}

export function subscribeToSellerVouchers(
  sellerId: string,
  callback: (vouchers: Voucher[]) => void
) {
  const q = query(collection(db, "vouchers"), where("sellerId", "==", sellerId));
  return onSnapshot(q, (snapshot) => {
    const list: Voucher[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data() as Voucher);
    });
    // Sort by createdAt descending
    list.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
    callback(list);
  });
}

export async function incrementVoucherUsage(code: string): Promise<void> {
  const codeKey = code.toUpperCase().trim();
  const docRef = doc(db, "vouchers", codeKey);
  await updateDoc(docRef, {
    usedCount: increment(1),
  });
}

export async function saveVoucherHistory(history: {
  voucherCode: string;
  userId: string;
  orderId: string;
  discountAmount: number;
  sellerId: string;
}): Promise<void> {
  const id = `VH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const docRef = doc(db, "voucherHistories", id);
  await setDoc(docRef, {
    ...history,
    id,
    usedAt: new Date().toISOString(),
  });
}

