import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, RegisteredUser, UserAddress, SellerInfo } from "@/types/user";

interface AuthState {
  currentUser: User | null;
  registeredUsers: RegisteredUser[];
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (profile: Partial<User>) => void;
  changePassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
  addAddress: (address: Omit<UserAddress, "id">) => void;
  updateAddress: (id: string, address: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  registerSeller: (info: SellerInfo) => void;
  approveSeller: (userId: string) => void;
  updateSellerInfo: (info: SellerInfo) => void;
}

const DEFAULT_USERS: RegisteredUser[] = [
  {
    id: "default-admin",
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
    passwordHash: "12345678",
    role: "buyer",
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      registeredUsers: DEFAULT_USERS,

      login: (email, password) => {
        const users = get().registeredUsers;
        const matchedUser = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.passwordHash === password
        );

        if (matchedUser) {
          const userObj: User = {
            id: matchedUser.id,
            name: matchedUser.name,
            email: matchedUser.email,
            phone: matchedUser.phone || "",
            dob: matchedUser.dob || "",
            gender: matchedUser.gender || "",
            memberSince: matchedUser.memberSince || "06/2024",
            addresses: matchedUser.addresses || [],
            role: matchedUser.role || "buyer",
            sellerStatus: matchedUser.sellerStatus,
            sellerInfo: matchedUser.sellerInfo,
          };
          set({ currentUser: userObj });
          return { success: true, message: "Đăng nhập thành công!" };
        }

        return { success: false, message: "Email hoặc mật khẩu không chính xác." };
      },

      register: (name, email, password) => {
        const users = get().registeredUsers;
        const emailExists = users.some(
          (u) => u.email.toLowerCase() === email.toLowerCase().trim()
        );

        if (emailExists) {
          return { success: false, message: "Email này đã được sử dụng." };
        }

        const newUser: RegisteredUser = {
          id: "usr-" + Date.now(),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: "",
          dob: "",
          gender: "",
          memberSince: new Date().toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }),
          addresses: [],
          passwordHash: password,
          role: "buyer",
        };

        set({
          registeredUsers: [...users, newUser],
        });

        return { success: true, message: "Đăng ký thành công!" };
      },

      logout: () => {
        set({ currentUser: null });
      },

      updateProfile: (profile) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...profile };
        const registeredUsers = get().registeredUsers.map((user) =>
          user.id === currentUser.id ? { ...user, ...profile } : user
        );

        set({
          currentUser: updatedUser,
          registeredUsers,
        });
      },

      changePassword: (currentPass, newPass) => {
        const currentUser = get().currentUser;
        if (!currentUser) return { success: false, message: "Người dùng chưa đăng nhập." };

        const matchedUser = get().registeredUsers.find((u) => u.id === currentUser.id);
        if (!matchedUser || matchedUser.passwordHash !== currentPass) {
          return { success: false, message: "Mật khẩu hiện tại không chính xác." };
        }

        const registeredUsers = get().registeredUsers.map((user) =>
          user.id === currentUser.id ? { ...user, passwordHash: newPass } : user
        );

        set({ registeredUsers });
        return { success: true, message: "Cập nhật mật khẩu thành công!" };
      },

      registerSeller: (info) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const updatedProfile = {
          sellerStatus: "pending" as const,
          sellerInfo: info,
        };

        const updatedUser = { ...currentUser, ...updatedProfile };
        const registeredUsers = get().registeredUsers.map((user) =>
          user.id === currentUser.id ? { ...user, ...updatedProfile } : user
        );

        set({
          currentUser: updatedUser,
          registeredUsers,
        });
      },

      approveSeller: (userId) => {
        const currentUser = get().currentUser;
        const isSelf = currentUser && currentUser.id === userId;

        const updatedProfile = {
          role: "seller" as const,
          sellerStatus: "approved" as const,
        };

        const registeredUsers = get().registeredUsers.map((user) =>
          user.id === userId ? { ...user, ...updatedProfile } : user
        );

        const newSet: Partial<AuthState> = { registeredUsers };
        if (isSelf) {
          newSet.currentUser = { ...currentUser, ...updatedProfile };
        }
        set(newSet);
      },

      updateSellerInfo: (info) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const updatedProfile = {
          sellerInfo: info,
        };

        const updatedUser = { ...currentUser, ...updatedProfile };
        const registeredUsers = get().registeredUsers.map((user) =>
          user.id === currentUser.id ? { ...user, ...updatedProfile } : user
        );

        set({
          currentUser: updatedUser,
          registeredUsers,
        });
      },

      addAddress: (address) => {
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

        get().updateProfile({ addresses: updatedAddresses });
      },

      updateAddress: (id, updatedFields) => {
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

        get().updateProfile({ addresses: updatedAddresses });
      },

      deleteAddress: (id) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const currentAddresses = currentUser.addresses || [];
        const addressToDelete = currentAddresses.find((addr) => addr.id === id);
        const updatedAddresses = currentAddresses.filter((addr) => addr.id !== id);

        if (addressToDelete?.isDefault && updatedAddresses.length > 0) {
          updatedAddresses[0].isDefault = true;
        }

        get().updateProfile({ addresses: updatedAddresses });
      },

      setDefaultAddress: (id) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;

        const currentAddresses = currentUser.addresses || [];
        const updatedAddresses = currentAddresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        }));

        get().updateProfile({ addresses: updatedAddresses });
      },
    }),
    {
      name: "nong-sach-auth",
      partialize: (state) => {
        const sanitizeUser = (user: User | RegisteredUser | null) => {
          if (!user) return user;
          if (!user.sellerInfo) return user;
          const restInfo: Partial<SellerInfo> = { ...user.sellerInfo };
          delete restInfo.idCardFront;
          delete restInfo.idCardBack;
          delete restInfo.farmImages;
          delete restInfo.shopLogo;
          return {
            ...user,
            sellerInfo: restInfo,
          };
        };

        return {
          currentUser: sanitizeUser(state.currentUser),
          registeredUsers: state.registeredUsers.map(sanitizeUser),
        };
      },
    }
  )
);
