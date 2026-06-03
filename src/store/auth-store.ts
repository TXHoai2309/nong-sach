import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, RegisteredUser } from "@/types/user";

interface AuthState {
  currentUser: User | null;
  registeredUsers: RegisteredUser[];
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
}

const DEFAULT_USERS: RegisteredUser[] = [
  {
    id: "default-admin",
    name: "Quản trị viên",
    email: "admin@nongsach.vn",
    passwordHash: "12345678",
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
          passwordHash: password,
        };

        set({
          registeredUsers: [...users, newUser],
        });

        return { success: true, message: "Đăng ký thành công!" };
      },

      logout: () => {
        set({ currentUser: null });
      },
    }),
    {
      name: "nong-sach-auth",
    }
  )
);
