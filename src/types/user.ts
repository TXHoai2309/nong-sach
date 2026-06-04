export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  provinceCode: number;
  provinceName: string;
  districtCode: number;
  districtName: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  dob?: string;
  gender?: "Nam" | "Nữ" | "Khác" | "";
  memberSince?: string;
  addresses?: UserAddress[];
}

export interface RegisteredUser extends User {
  passwordHash: string; // Storing plain text password for local state/mock purposes
}
