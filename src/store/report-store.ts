import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Report } from "@/types/report";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

interface ReportState {
  reports: Report[];
  addReport: (report: Omit<Report, "id" | "createdAt" | "status">) => Promise<void>;
  getReportsByShopId: (shopId: string) => Report[];
  getReportsByProductId: (productId: string) => Report[];
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],
      addReport: async (reportData) => {
        const id = `REP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newReport: Report = {
          ...reportData,
          id,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set({ reports: [newReport, ...get().reports] });

        try {
          const cleanReport = Object.fromEntries(
            Object.entries(newReport).filter(([_, v]) => v !== undefined)
          );
          const docRef = doc(db, "reports", id);
          await setDoc(docRef, cleanReport);
        } catch (error) {
          console.error("Error saving report to Firestore:", error);
        }
      },
      getReportsByShopId: (shopId: string) => {
        return get().reports.filter((r) => r.shopId === shopId);
      },
      getReportsByProductId: (productId: string) => {
        return get().reports.filter((r) => r.productId === productId);
      },
    }),
    {
      name: "nong-sach-reports",
    }
  )
);
