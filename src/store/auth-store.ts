import { create } from "zustand";
import { User, RegisteredUser, UserAddress, SellerInfo } from "@/types/user";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

interface AuthState {
  currentUser: User | null;
  registeredUsers: RegisteredUser[];
  isAuthLoading: boolean;
  initAuth: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  addAddress: (address: Omit<UserAddress, "id">) => Promise<void>;
  updateAddress: (id: string, address: Partial<UserAddress>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  registerSeller: (info: SellerInfo) => Promise<void>;
  approveSeller: (userId: string) => Promise<void>;
  updateSellerInfo: (info: SellerInfo) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  currentUser: null,
  registeredUsers: [], // Keep empty array to support legacy types
  isAuthLoading: true,

  initAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            set({ currentUser: userSnap.data() as User, isAuthLoading: false });
          } else {
            // Profile doc doesn't exist, create a new profile doc
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Người dùng",
              email: firebaseUser.email || "",
              phone: firebaseUser.phoneNumber || "",
              dob: "",
              gender: "",
              memberSince: new Date().toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }),
              addresses: [],
              role: "buyer",
            };
            await setDoc(userRef, newUser);
            set({ currentUser: newUser, isAuthLoading: false });
          }
        } catch (err) {
          console.error("Firestore user fetch error:", err);
          set({ isAuthLoading: false });
        }
      } else {
        set({ currentUser: null, isAuthLoading: false });
      }
    });
  },

  login: async (email, password) => {
    // 1. Fallback auto-registration check for default demo account
    if (email.toLowerCase().trim() === "nguyenvana@gmail.com" && password === "12345678") {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        const uid = userCredential.user.uid;
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        let userProfile: User;
        if (userSnap.exists()) {
          userProfile = userSnap.data() as User;
        } else {
          userProfile = {
            id: uid,
            name: "Nguyễn Văn A",
            email: "nguyenvana@gmail.com",
            phone: "0123456789",
            dob: "1995-06-15",
            gender: "Nam",
            memberSince: "06/2024",
            addresses: [
              {
                id: "addr-default",
                fullName: "Nguyễn Văn A",
                phone: "0123 456 789",
                streetAddress: "123 Đường Nguyễn Huệ, Phường Bến Nghé",
                provinceCode: 79,
                provinceName: "Thành phố Hồ Chí Minh",
                districtCode: 760,
                districtName: "Quận 1",
                isDefault: true,
              },
            ],
            role: "buyer",
          };
          await setDoc(userRef, userProfile);
        }
        set({ currentUser: userProfile });
        return { success: true, message: "Đăng nhập thành công với tài khoản Demo!" };
      } catch (err: any) {
        if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
          try {
            // Auto register the demo user
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
            const uid = userCredential.user.uid;
            const defaultUser: User = {
              id: uid,
              name: "Nguyễn Văn A",
              email: "nguyenvana@gmail.com",
              phone: "0123456789",
              dob: "1995-06-15",
              gender: "Nam",
              memberSince: "06/2024",
              addresses: [
                {
                  id: "addr-default",
                  fullName: "Nguyễn Văn A",
                  phone: "0123 456 789",
                  streetAddress: "123 Đường Nguyễn Huệ, Phường Bến Nghé",
                  provinceCode: 79,
                  provinceName: "Thành phố Hồ Chí Minh",
                  districtCode: 760,
                  districtName: "Quận 1",
                  isDefault: true,
                },
              ],
              role: "buyer",
            };
            await setDoc(doc(db, "users", uid), defaultUser);
            set({ currentUser: defaultUser });
            return { success: true, message: "Đăng nhập thành công với tài khoản Demo!" };
          } catch (regErr: any) {
            console.error("Auto-registration of Demo user failed:", regErr);
          }
        }
      }
    }

    // 2. Standard login flow
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const uid = userCredential.user.uid;
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data() as User;
        set({ currentUser: userData });
        return { success: true, message: "Đăng nhập thành công!" };
      } else {
        const newUser: User = {
          id: uid,
          name: userCredential.user.displayName || email.split("@")[0],
          email: email.trim(),
          phone: "",
          dob: "",
          gender: "",
          memberSince: new Date().toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }),
          addresses: [],
          role: "buyer",
        };
        await setDoc(userRef, newUser);
        set({ currentUser: newUser });
        return { success: true, message: "Đăng nhập thành công!" };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMsg = "Email hoặc mật khẩu không chính xác.";
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        errorMsg = "Email hoặc mật khẩu không chính xác.";
      } else if (error.code === "auth/invalid-email") {
        errorMsg = "Địa chỉ email không hợp lệ.";
      } else if (error.code === "auth/too-many-requests") {
        errorMsg = "Tài khoản bị tạm khóa do đăng nhập sai nhiều lần. Vui lòng thử lại sau.";
      } else if (error.message) {
        errorMsg = `Lỗi đăng nhập: ${error.message}`;
      }
      return { success: false, message: errorMsg };
    }
  },

  register: async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = userCredential.user.uid;

      const newUser: User = {
        id: uid,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: "",
        dob: "",
        gender: "",
        memberSince: new Date().toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }),
        addresses: [],
        role: "buyer",
      };

      await setDoc(doc(db, "users", uid), newUser);
      return { success: true, message: "Đăng ký thành công!" };
    } catch (error: any) {
      console.error("Registration error:", error);
      let errorMsg = "Đăng ký thất bại.";
      if (error.code === "auth/email-already-in-use") {
        errorMsg = "Email này đã được sử dụng.";
      } else if (error.code === "auth/invalid-email") {
        errorMsg = "Địa chỉ email không hợp lệ.";
      } else if (error.code === "auth/weak-password") {
        errorMsg = "Mật khẩu quá yếu (tối thiểu 6 ký tự).";
      } else if (error.message) {
        errorMsg = `Lỗi đăng ký: ${error.message}`;
      }
      return { success: false, message: errorMsg };
    }
  },

  logout: async () => {
    await signOut(auth);
    set({ currentUser: null });
  },

  updateProfile: async (profile) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...profile };
    set({ currentUser: updatedUser });

    try {
      const userRef = doc(db, "users", currentUser.id);
      await updateDoc(userRef, profile);
    } catch (err) {
      console.error("Lỗi cập nhật profile trên Firestore:", err);
    }
  },

  changePassword: async (currentPass, newPass) => {
    const currentUser = get().currentUser;
    if (!currentUser) return { success: false, message: "Người dùng chưa đăng nhập." };

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return { success: false, message: "Không tìm thấy phiên đăng nhập." };
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPass);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPass);
      return { success: true, message: "Cập nhật mật khẩu thành công!" };
    } catch (error: any) {
      console.error("Change password error:", error);
      let errorMsg = "Mật khẩu hiện tại không chính xác.";
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMsg = "Mật khẩu hiện tại không chính xác.";
      } else if (error.code === "auth/weak-password") {
        errorMsg = "Mật khẩu mới quá yếu (tối thiểu 6 ký tự).";
      } else if (error.message) {
        errorMsg = `Lỗi đổi mật khẩu: ${error.message}`;
      }
      return { success: false, message: errorMsg };
    }
  },

  addAddress: async (address) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    const currentAddresses = currentUser.addresses || [];
    const isFirst = currentAddresses.length === 0;

    const newAddress: UserAddress = {
      ...address,
      id: "addr-" + Date.now(),
      isDefault: isFirst ? true : address.isDefault,
    };

    let updatedAddresses = [...currentAddresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({ ...addr, isDefault: false }));
    }
    updatedAddresses.push(newAddress);

    await get().updateProfile({ addresses: updatedAddresses });
  },

  updateAddress: async (id, updatedFields) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    const currentAddresses = currentUser.addresses || [];
    let updatedAddresses = currentAddresses.map((addr) =>
      addr.id === id ? { ...addr, ...updatedFields } : addr
    );

    if (updatedFields.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) =>
        addr.id === id ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
      );
    }

    await get().updateProfile({ addresses: updatedAddresses });
  },

  deleteAddress: async (id) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    const currentAddresses = currentUser.addresses || [];
    const addressToDelete = currentAddresses.find((addr) => addr.id === id);
    const updatedAddresses = currentAddresses.filter((addr) => addr.id !== id);

    if (addressToDelete?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    await get().updateProfile({ addresses: updatedAddresses });
  },

  setDefaultAddress: async (id) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    const currentAddresses = currentUser.addresses || [];
    const updatedAddresses = currentAddresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));

    await get().updateProfile({ addresses: updatedAddresses });
  },

  registerSeller: async (info) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    const updatedProfile = {
      sellerStatus: "pending" as const,
      sellerInfo: info,
    };

    const updatedUser = { ...currentUser, ...updatedProfile };
    set({ currentUser: updatedUser });

    try {
      const userRef = doc(db, "users", currentUser.id);

      // Strip large base64 media fields from Firestore payload
      const sanitizedInfo = { ...info };
      delete sanitizedInfo.idCardFront;
      delete sanitizedInfo.idCardBack;
      delete sanitizedInfo.farmImages;
      delete sanitizedInfo.shopLogo;

      await updateDoc(userRef, {
        sellerStatus: "pending",
        sellerInfo: sanitizedInfo,
      });
    } catch (err) {
      console.error("Firestore register seller update error:", err);
    }
  },

  approveSeller: async (userId) => {
    const currentUser = get().currentUser;
    const isSelf = currentUser && currentUser.id === userId;

    const updatedProfile = {
      role: "seller" as const,
      sellerStatus: "approved" as const,
    };

    if (isSelf) {
      set({ currentUser: { ...currentUser, ...updatedProfile } });
    }

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, updatedProfile);
    } catch (err) {
      console.error("Firestore approve seller update error:", err);
    }
  },

  updateSellerInfo: async (info) => {
    const currentUser = get().currentUser;
    if (!currentUser) return;

    const updatedProfile = {
      sellerInfo: info,
    };

    const updatedUser = { ...currentUser, ...updatedProfile };
    set({ currentUser: updatedUser });

    try {
      const userRef = doc(db, "users", currentUser.id);

      // Strip large base64 media fields from Firestore payload
      const sanitizedInfo = { ...info };
      delete sanitizedInfo.idCardFront;
      delete sanitizedInfo.idCardBack;
      delete sanitizedInfo.farmImages;
      delete sanitizedInfo.shopLogo;

      await updateDoc(userRef, {
        sellerInfo: sanitizedInfo,
      });
    } catch (err) {
      console.error("Firestore update seller info error:", err);
    }
  },
}));
