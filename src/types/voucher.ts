export interface Voucher {
  code: string;            // Uppercase, trimmed, alphanumeric (unique ID)
  sellerId: string;        // ID of the seller who created it
  shopName: string;        // Name of the seller's shop
  type: "percent" | "fixed"; // Discount type
  value: number;           // Discount value (e.g. 15 for 15%, or 15000 for 15,000 VND)
  limit: number;           // Max number of usages
  usedCount: number;       // Number of times used
  expiryDate: string;      // Expiration date (YYYY-MM-DD)
  status: "active" | "stopped"; // Status
  createdAt: string;       // Creation ISO timestamp
}
