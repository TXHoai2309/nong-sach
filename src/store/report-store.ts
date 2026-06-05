import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Report } from "@/types/report";

interface ReportState {
  reports: Report[];
  addReport: (report: Omit<Report, "id" | "createdAt" | "status">) => void;
  getReportsByShopId: (shopId: string) => Report[];
  getReportsByProductId: (productId: string) => Report[];
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],
      addReport: (reportData) => {
        const newReport: Report = {
          ...reportData,
          id: `REP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set({ reports: [newReport, ...get().reports] });
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
