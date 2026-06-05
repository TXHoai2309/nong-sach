import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ShopReport } from "@/types/report";

interface ReportState {
  reports: ShopReport[];
  addReport: (report: Omit<ShopReport, "id" | "createdAt" | "status">) => void;
  getReportsByShopId: (shopId: string) => ShopReport[];
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],
      addReport: (reportData) => {
        const newReport: ShopReport = {
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
    }),
    {
      name: "nong-sach-reports",
    }
  )
);
