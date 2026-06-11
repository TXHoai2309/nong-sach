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
  role?: "buyer" | "seller" | "admin";
  sellerStatus?: "pending" | "approved" | "rejected" | "blocked";
  sellerRejectionReason?: string;
  sellerInfo?: SellerInfo;
  isLocked?: boolean;
  lockReason?: string;
}

export interface SellerInfo {
  shopName: string;
  slogan?: string;
  shopPhone: string;
  shopZalo: string;
  description: string;
  shopLogo?: string;
  coverImage?: string;
  farmImages?: string[];
  mainCategories: string[];
  province: string;
  farmAddress: string;
  farmingStandards: string[];
  farmingStandardsDetail?: string;
  idCardNumber: string;
  idCardFront?: string;
  idCardBack?: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface RegisteredUser extends User {
  passwordHash: string; // Storing plain text password for local state/mock purposes
}
