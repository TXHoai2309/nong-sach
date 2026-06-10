"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/types/user";
import { useAuthStore } from "@/store/auth-store";
import { Order } from "@/types/order";
import { formatCurrency } from "@/lib/format";
import { useNotificationStore } from "@/store/notification-store";
import { Product } from "@/types/product";
import { getAllProducts } from "@/lib/products";
import { Report } from "@/types/report";

interface AdminLog {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  action: "ignore" | "warn" | "block" | "delete" | "unblock";
  targetType: "product" | "shop";
  targetId: string;
  targetName: string;
  reportId: string;
  details: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filters for chart
  const [dateRange, setDateRange] = useState<"7" | "30">("30");
  const [activeMetric, setActiveMetric] = useState<"revenue" | "orders">("revenue");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [selectedSeller, setSelectedSeller] = useState<User | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRejectProductModalOpen, setIsRejectProductModalOpen] = useState(false);
  const [rejectProductReason, setRejectProductReason] = useState("");
  const [approvalTab, setApprovalTab] = useState<"sellers" | "products" | "reports">("sellers");

  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [reportActionType, setReportActionType] = useState<"warn" | "block" | "delete" | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);

  const approveSeller = useAuthStore((s) => s.approveSeller);
  const { currentUser } = useAuthStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersCol = collection(db, "users");
      const usersSnap = await getDocs(usersCol);
      const fetchedUsers: User[] = [];
      usersSnap.forEach((docSnap) => {
        fetchedUsers.push({ id: docSnap.id, ...docSnap.data() } as User);
      });
      setUsers(fetchedUsers);

      // Fetch orders
      const ordersCol = collection(db, "orders");
      const ordersSnap = await getDocs(ordersCol);
      const fetchedOrders: Order[] = [];
      ordersSnap.forEach((docSnap) => {
        fetchedOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      setOrders(fetchedOrders);

      // Fetch products (including pending/rejected)
      const fetchedProducts = await getAllProducts(true);
      setProducts(fetchedProducts);

      // Fetch reports
      const reportsCol = collection(db, "reports");
      const reportsSnap = await getDocs(reportsCol);
      const fetchedReports: Report[] = [];
      reportsSnap.forEach((docSnap) => {
        fetchedReports.push({ id: docSnap.id, ...docSnap.data() } as Report);
      });
      fetchedReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReports(fetchedReports);

      // Fetch admin logs
      const logsCol = collection(db, "adminLogs");
      const logsSnap = await getDocs(logsCol);
      const fetchedLogs: AdminLog[] = [];
      logsSnap.forEach((docSnap) => {
        fetchedLogs.push({ id: docSnap.id, ...docSnap.data() } as AdminLog);
      });
      fetchedLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setAdminLogs(fetchedLogs);
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      await approveSeller(userId);
      // Refresh data
      await fetchData();
    } catch (error) {
      console.error("Error approving seller:", error);
      alert("Phê duyệt thất bại!");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectSeller = async (userId: string, reason: string) => {
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do từ chối!");
      return;
    }
    setActionLoading(userId);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        sellerStatus: "rejected",
        sellerRejectionReason: reason.trim(),
      });

      // Send account update notification to the seller
      await useNotificationStore.getState().addNotification({
        userId,
        title: "Hồ sơ đăng ký bán hàng bị từ chối",
        message: `Yêu cầu đăng ký bán hàng của bạn không được phê duyệt. Lý do: "${reason.trim()}". Bạn có thể cập nhật thông tin và gửi lại yêu cầu.`,
        type: "account_update",
      });

      await fetchData();
    } catch (error) {
      console.error("Error rejecting seller:", error);
      alert("Từ chối thất bại!");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveProduct = async (productId: string) => {
    setActionLoading(productId);
    try {
      const prodRef = doc(db, "products", productId);
      await updateDoc(prodRef, {
        status: "active",
        rejectionReason: "",
      });

      const product = products.find((p) => p.id === productId);
      if (product && product.sellerId) {
        await useNotificationStore.getState().addNotification({
          userId: product.sellerId,
          title: "Sản phẩm được phê duyệt",
          message: `Sản phẩm "${product.name}" của bạn đã được phê duyệt và hiển thị công khai trên cửa hàng.`,
          type: "account_update",
          productId: product.id,
        });
      }

      await fetchData();
    } catch (error) {
      console.error("Error approving product:", error);
      alert("Phê duyệt sản phẩm thất bại!");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectProduct = async (productId: string, reason: string) => {
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do từ chối!");
      return;
    }
    setActionLoading(productId);
    try {
      const prodRef = doc(db, "products", productId);
      await updateDoc(prodRef, {
        status: "rejected",
        rejectionReason: reason.trim(),
      });

      const product = products.find((p) => p.id === productId);
      if (product && product.sellerId) {
        await useNotificationStore.getState().addNotification({
          userId: product.sellerId,
          title: "Sản phẩm bị từ chối phê duyệt",
          message: `Sản phẩm "${product.name}" của bạn bị từ chối phê duyệt. Lý do: "${reason.trim()}".`,
          type: "account_update",
          productId: product.id,
        });
      }

      await fetchData();
    } catch (error) {
      console.error("Error rejecting product:", error);
      alert("Từ chối sản phẩm thất bại!");
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (userId: string, newRole: "buyer" | "seller" | "admin") => {
    if (newRole === "admin") {
      alert("Hệ thống chỉ cho phép duy nhất một tài khoản Quản trị.");
      return;
    }
    setActionLoading(userId + "-role");
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        role: newRole,
      });
      await fetchData();
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Cập nhật quyền hạn thất bại!");
    } finally {
      setActionLoading(null);
    }
  };

  const logAdminAction = async (
    action: "ignore" | "warn" | "block" | "delete" | "unblock",
    targetType: "product" | "shop",
    targetId: string,
    targetName: string,
    reportId: string,
    details: string
  ) => {
    try {
      const logId = `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const logRef = doc(db, "adminLogs", logId);
      await setDoc(logRef, {
        id: logId,
        adminId: currentUser?.id || "unknown",
        adminName: currentUser?.name || "Admin",
        adminEmail: currentUser?.email || "",
        action,
        targetType,
        targetId,
        targetName,
        reportId,
        details,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error writing admin log:", error);
    }
  };

  const handleUnblockSeller = async (userId: string) => {
    setActionLoading(userId + "-unblock");
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { sellerStatus: "approved" });

      // Unblock all their products
      const sellerProducts = products.filter((p) => p.sellerId === userId);
      for (const prod of sellerProducts) {
        const prodRef = doc(db, "products", prod.id);
        await updateDoc(prodRef, { status: "active" });
      }

      const userObj = users.find((u) => u.id === userId);
      await logAdminAction(
        "unblock",
        "shop",
        userId,
        userObj?.sellerInfo?.shopName || userObj?.name || "",
        "SYSTEM",
        "Mở khóa cửa hàng và khôi phục hoạt động các sản phẩm"
      );

      // Notify seller
      await useNotificationStore.getState().addNotification({
        userId,
        title: "Cửa hàng của bạn đã được mở khóa",
        message: "Cửa hàng và các sản phẩm của bạn đã được khôi phục hoạt động bình thường.",
        type: "account_update",
      });

      alert("Đã mở khóa cửa hàng thành công!");
      await fetchData();
    } catch (error) {
      console.error("Error unblocking seller:", error);
      alert("Thao tác thất bại!");
    } finally {
      setActionLoading(null);
    }
  };

  const handleIgnoreReport = async (reportId: string) => {
    setActionLoading(reportId);
    try {
      const report = reports.find((r) => r.id === reportId);
      if (!report) return;

      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, { status: "dismissed" });

      await logAdminAction(
        "ignore",
        report.type,
        report.type === "product" ? report.productId || "" : report.shopId || "",
        report.type === "product" ? report.productName || "" : report.shopName || "",
        reportId,
        "Admin bỏ qua báo cáo vi phạm"
      );

      alert("Đã bỏ qua báo cáo!");
      await fetchData();
    } catch (error) {
      console.error("Error ignoring report:", error);
      alert("Thao tác thất bại!");
    } finally {
      setActionLoading(null);
    }
  };

  const handleWarnReport = async (report: Report, warnMessage: string) => {
    setActionLoading(report.id);
    try {
      const reportRef = doc(db, "reports", report.id);
      await updateDoc(reportRef, { status: "resolved" });

      const targetUserId = report.shopId || report.reporterId;
      if (targetUserId) {
        await useNotificationStore.getState().addNotification({
          userId: targetUserId,
          title: "Cảnh báo vi phạm từ Ban quản trị",
          message: `Cảnh báo đối với ${
            report.type === "product" ? `sản phẩm "${report.productName}"` : `cửa hàng của bạn`
          }. Lý do: "${warnMessage}". Vui lòng tuân thủ quy định đăng bán sản phẩm.`,
          type: "account_update",
        });
      }

      await logAdminAction(
        "warn",
        report.type,
        report.type === "product" ? report.productId || "" : report.shopId || "",
        report.type === "product" ? report.productName || "" : report.shopName || "",
        report.id,
        `Cảnh báo gửi tới người bán. Nội dung: ${warnMessage}`
      );

      alert("Đã gửi cảnh báo thành công!");
      await fetchData();
    } catch (error) {
      console.error("Error warning seller:", error);
      alert("Thao tác thất bại!");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlockReport = async (report: Report, reason: string) => {
    setActionLoading(report.id);
    try {
      const reportRef = doc(db, "reports", report.id);
      await updateDoc(reportRef, { status: "resolved" });

      if (report.type === "product" && report.productId) {
        const prodRef = doc(db, "products", report.productId);
        await updateDoc(prodRef, { status: "blocked" });

        if (report.shopId) {
          await useNotificationStore.getState().addNotification({
            userId: report.shopId,
            title: "Sản phẩm đã bị khóa tạm thời",
            message: `Sản phẩm "${report.productName}" đã bị khóa do vi phạm: "${reason}".`,
            type: "account_update",
          });
        }
      } else if (report.type === "shop" && report.shopId) {
        const userRef = doc(db, "users", report.shopId);
        await updateDoc(userRef, { sellerStatus: "blocked" });

        const sellerProducts = products.filter((p) => p.sellerId === report.shopId);
        for (const prod of sellerProducts) {
          const prodRef = doc(db, "products", prod.id);
          await updateDoc(prodRef, { status: "blocked" });
        }

        await useNotificationStore.getState().addNotification({
          userId: report.shopId,
          title: "Cửa hàng đã bị khóa tạm thời",
          message: `Cửa hàng của bạn đã bị khóa do vi phạm: "${reason}". Tất cả sản phẩm đã được ẩn.`,
          type: "account_update",
        });
      }

      await logAdminAction(
        "block",
        report.type,
        report.type === "product" ? report.productId || "" : report.shopId || "",
        report.type === "product" ? report.productName || "" : report.shopName || "",
        report.id,
        `Khóa tạm thời đối tượng. Lý do: ${reason}`
      );

      alert("Đã khóa tạm thời đối tượng vi phạm!");
      await fetchData();
    } catch (error) {
      console.error("Error blocking object:", error);
      alert("Thao tác thất bại!");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteReport = async (report: Report, reason: string) => {
    setActionLoading(report.id);
    try {
      const reportRef = doc(db, "reports", report.id);
      await updateDoc(reportRef, { status: "resolved" });

      if (report.type === "product" && report.productId) {
        const prodRef = doc(db, "products", report.productId);
        await deleteDoc(prodRef);

        if (report.shopId) {
          await useNotificationStore.getState().addNotification({
            userId: report.shopId,
            title: "Sản phẩm đã bị xóa khỏi hệ thống",
            message: `Sản phẩm "${report.productName}" đã bị xóa do vi phạm chính sách: "${reason}".`,
            type: "account_update",
          });
        }
      } else if (report.type === "shop" && report.shopId) {
        const userRef = doc(db, "users", report.shopId);
        await updateDoc(userRef, {
          role: "buyer",
          sellerStatus: "rejected",
        });

        const sellerProducts = products.filter((p) => p.sellerId === report.shopId);
        for (const prod of sellerProducts) {
          const prodRef = doc(db, "products", prod.id);
          await deleteDoc(prodRef);
        }

        await useNotificationStore.getState().addNotification({
          userId: report.shopId,
          title: "Quyền bán hàng của bạn đã bị thu hồi",
          message: `Tài khoản của bạn đã bị thu hồi quyền bán hàng và xóa toàn bộ sản phẩm do vi phạm: "${reason}".`,
          type: "account_update",
        });
      }

      await logAdminAction(
        "delete",
        report.type,
        report.type === "product" ? report.productId || "" : report.shopId || "",
        report.type === "product" ? report.productName || "" : report.shopName || "",
        report.id,
        `Xóa đối tượng vi phạm. Lý do: ${reason}`
      );

      alert("Đã xử lý xóa đối tượng vi phạm!");
      await fetchData();
    } catch (error) {
      console.error("Error deleting object:", error);
      alert("Thao tác thất bại!");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#006c49] border-t-transparent" />
          <p className="text-slate-500 text-sm font-semibold">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = users.length;
  const pendingSellers = users.filter((u) => u.sellerStatus === "pending").length;

  const todayStr = new Date().toLocaleDateString('en-CA');
  const ordersToday = orders.filter((o) => {
    if (!o.createdAt) return false;
    try {
      return new Date(o.createdAt).toLocaleDateString('en-CA') === todayStr;
    } catch {
      return false;
    }
  }).length;

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingSellersList = users.filter((u) => u.sellerStatus === "pending");
  const pendingProductsList = products.filter((p) => p.status === "pending");
  const pendingReportsList = reports.filter((r) => r.status === "pending");

  // Generate chart data for the last N days
  const numDays = parseInt(dateRange, 10);
  const chartData = [];
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-CA'); // "YYYY-MM-DD"
    const label = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }); // "DD/MM"

    const dayOrders = orders.filter((o) => {
      if (!o.createdAt) return false;
      try {
        return new Date(o.createdAt).toLocaleDateString('en-CA') === dateStr;
      } catch {
        return false;
      }
    });

    const dayRevenue = dayOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    chartData.push({
      dateStr,
      label,
      revenue: dayRevenue,
      orders: dayOrders.length,
    });
  }

  const values = chartData.map((d) => (activeMetric === "revenue" ? d.revenue : d.orders));
  const maxVal = Math.max(...values, activeMetric === "revenue" ? 100000 : 5);

  const gridLinesCount = 4;
  const gridLines = Array.from({ length: gridLinesCount + 1 }, (_, idx) => {
    const val = (maxVal / gridLinesCount) * idx;
    const y = 30 + 270 - (idx / gridLinesCount) * 270;
    return { val, y };
  });

  const formatYLabel = (val: number) => {
    if (activeMetric === "orders") {
      return val.toFixed(0);
    }
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(0)}K`;
    }
    return val.toString();
  };

  const shouldShowXLabel = (idx: number, total: number) => {
    if (total <= 7) return true;
    return idx % 5 === 0 || idx === total - 1;
  };

  let lineD = "";
  let areaD = "";
  if (chartData.length > 0) {
    const points = chartData.map((_, i) => {
      const x = 70 + (i / (chartData.length - 1)) * 700;
      const y = 30 + 270 - (values[i] / maxVal) * 270;
      return { x, y };
    });
    lineD = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    areaD = `${lineD} L ${points[points.length - 1].x} 300 L ${points[0].x} 300 Z`;
  }

  return (
    <>
      <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Tổng quan Dashboard</h2>
        <p className="text-slate-500 text-sm">Quản lý người dùng, cửa hàng và các hoạt động hệ thống.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">people</span>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tổng người dùng</p>
            <p className="text-2xl font-bold text-slate-800">{totalUsers}</p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Seller chờ</p>
            <p className="text-2xl font-bold text-slate-800">{pendingSellers}</p>
          </div>
        </div>

        {/* Orders Today */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Đơn hôm nay</p>
            <p className="text-2xl font-bold text-slate-800">{ordersToday}</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">monetization_on</span>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Doanh thu</p>
            <p className="text-2xl font-bold text-slate-800 truncate max-w-[150px]" title={formatCurrency(totalRevenue)}>
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Hiệu suất Nền tảng</h3>
            <p className="text-slate-500 text-xs mt-0.5">Biểu đồ thể hiện doanh thu và số lượng đơn hàng theo thời gian.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Metric Toggle */}
            <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
              <button
                onClick={() => {
                  setActiveMetric("revenue");
                  setHoveredIndex(null);
                }}
                className={[
                  "px-3 py-1.5 rounded-md transition-all cursor-pointer border-none",
                  activeMetric === "revenue"
                    ? "bg-[#006c49] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900",
                ].join(" ")}
              >
                Doanh thu
              </button>
              <button
                onClick={() => {
                  setActiveMetric("orders");
                  setHoveredIndex(null);
                }}
                className={[
                  "px-3 py-1.5 rounded-md transition-all cursor-pointer border-none",
                  activeMetric === "orders"
                    ? "bg-[#006c49] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900",
                ].join(" ")}
              >
                Số đơn hàng
              </button>
            </div>

            {/* Date Range Selector */}
            <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-bold">
              <button
                onClick={() => {
                  setDateRange("7");
                  setHoveredIndex(null);
                }}
                className={[
                  "px-3 py-1.5 rounded-md transition-all cursor-pointer border-none",
                  dateRange === "7"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900",
                ].join(" ")}
              >
                7 ngày
              </button>
              <button
                onClick={() => {
                  setDateRange("30");
                  setHoveredIndex(null);
                }}
                className={[
                  "px-3 py-1.5 rounded-md transition-all cursor-pointer border-none",
                  dateRange === "30"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900",
                ].join(" ")}
              >
                30 ngày
              </button>
            </div>
          </div>
        </div>

        {/* SVG Chart Container */}
        <div className="relative w-full aspect-[800/350] bg-slate-50/50 rounded-2xl border border-slate-100 p-4 select-none">
          {chartData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-semibold">
              Không có dữ liệu cho khoảng thời gian này
            </div>
          ) : (
            <>
              <svg viewBox="0 0 800 350" className="w-full h-full overflow-visible">
                <defs>
                  {/* Gradient Area Fill */}
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#006c49" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#006c49" stopOpacity="0.00" />
                  </linearGradient>

                  {/* Secondary Gradient for Orders */}
                  <linearGradient id="chartGradientOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                {gridLines.map((line, idx) => (
                  <g key={idx}>
                    <line
                      x1={70}
                      y1={line.y}
                      x2={770}
                      y2={line.y}
                      stroke="#e2e8f0"
                      strokeWidth={1}
                      strokeDasharray={idx === 0 ? "0" : "4 4"}
                    />
                    <text
                      x={60}
                      y={line.y + 4}
                      textAnchor="end"
                      className="text-[10px] font-bold fill-slate-400 font-sans"
                    >
                      {formatYLabel(line.val)}
                    </text>
                  </g>
                ))}

                {/* X-Axis line */}
                <line x1={70} y1={300} x2={770} y2={300} stroke="#cbd5e1" strokeWidth={1.5} />

                {/* X-Axis Labels */}
                {chartData.map((d, idx) => {
                  const x = 70 + (idx / (chartData.length - 1)) * 700;
                  const showLabel = shouldShowXLabel(idx, chartData.length);
                  return showLabel ? (
                    <g key={idx}>
                      <line x1={x} y1={300} x2={x} y2={305} stroke="#cbd5e1" strokeWidth={1.5} />
                      <text
                        x={x}
                        y={322}
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-slate-400 font-sans"
                      >
                        {d.label}
                      </text>
                    </g>
                  ) : null;
                })}

                {/* Gradient Area under line */}
                <path
                  d={areaD}
                  fill={activeMetric === "revenue" ? "url(#chartGradient)" : "url(#chartGradientOrders)"}
                />

                {/* Line Path */}
                <path
                  d={lineD}
                  fill="none"
                  stroke={activeMetric === "revenue" ? "#006c49" : "#3b82f6"}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Hover Indicator Vertical Line */}
                {hoveredIndex !== null && (() => {
                  const x = 70 + (hoveredIndex / (chartData.length - 1)) * 700;
                  return (
                    <line
                      x1={x}
                      y1={30}
                      x2={x}
                      y2={300}
                      stroke={activeMetric === "revenue" ? "#006c49" : "#3b82f6"}
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      className="pointer-events-none"
                    />
                  );
                })()}

                {/* Circle markers at each point */}
                {chartData.map((d, idx) => {
                  const x = 70 + (idx / (chartData.length - 1)) * 700;
                  const y = 30 + 270 - (values[idx] / maxVal) * 270;
                  const isHovered = hoveredIndex === idx;

                  return (
                    <g key={idx}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 6 : 4}
                        fill={activeMetric === "revenue" ? "#006c49" : "#3b82f6"}
                        stroke="#ffffff"
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        className="transition-all duration-150"
                      />
                    </g>
                  );
                })}

                {/* Invisible vertical rect slices for clean hover capture */}
                {chartData.map((_, idx) => {
                  const sliceWidth = 700 / (chartData.length - 1);
                  const x = 70 + (idx / (chartData.length - 1)) * 700;
                  const rectX = idx === 0 ? 70 : x - sliceWidth / 2;
                  const rectWidth = idx === 0 || idx === chartData.length - 1 ? sliceWidth / 2 : sliceWidth;

                  return (
                    <rect
                      key={idx}
                      x={rectX}
                      y={30}
                      width={rectWidth}
                      height={270}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseMove={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  );
                })}
              </svg>

              {/* Floating Tooltip HTML */}
              {hoveredIndex !== null && (() => {
                const idx = hoveredIndex;
                const d = chartData[idx];
                const x = 70 + (idx / (chartData.length - 1)) * 700;
                const y = 30 + 270 - (values[idx] / maxVal) * 270;

                // Format tooltip date: "09/06/2026"
                const parts = d.dateStr.split("-");
                const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

                return (
                  <div
                    className="absolute pointer-events-none bg-slate-900/95 text-white p-3 rounded-xl shadow-xl text-xs font-sans space-y-1 z-10 border border-slate-700/50 backdrop-blur-sm transition-all duration-150"
                    style={{
                      left: `${(x / 800) * 100}%`,
                      top: `${(y / 350) * 100}%`,
                      transform: "translate(-50%, -100%) translateY(-12px)",
                    }}
                  >
                    <p className="font-bold text-slate-300 border-b border-slate-700/50 pb-1 mb-1">
                      {formattedDate}
                    </p>
                    <div className="space-y-0.5">
                      <p className="flex items-center justify-between gap-6">
                        <span className="text-slate-400">Doanh thu:</span>
                        <span className="font-bold text-emerald-400">{formatCurrency(d.revenue)}</span>
                      </p>
                      <p className="flex items-center justify-between gap-6">
                        <span className="text-slate-400">Đơn hàng:</span>
                        <span className="font-bold text-blue-400">{d.orders} đơn</span>
                      </p>
                    </div>
                    {/* Arrow indicator */}
                    <div
                      className="absolute left-1/2 bottom-0 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700/50 rotate-45 -translate-x-1/2 translate-y-1.5"
                    />
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </div>

      {/* Grid: Approvals Queue & User Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Approvals Queue */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-100 mb-4 text-xs font-bold gap-1">
            <button
              onClick={() => setApprovalTab("sellers")}
              className={[
                "flex-1 pb-3 text-center transition-all border-b-2 cursor-pointer bg-transparent whitespace-nowrap",
                approvalTab === "sellers"
                  ? "border-[#006c49] text-[#006c49]"
                  : "border-transparent text-slate-500 hover:text-slate-700",
              ].join(" ")}
            >
              Người Bán ({pendingSellersList.length})
            </button>
            <button
              onClick={() => setApprovalTab("products")}
              className={[
                "flex-1 pb-3 text-center transition-all border-b-2 cursor-pointer bg-transparent whitespace-nowrap",
                approvalTab === "products"
                  ? "border-[#006c49] text-[#006c49]"
                  : "border-transparent text-slate-500 hover:text-slate-700",
              ].join(" ")}
            >
              Sản Phẩm ({pendingProductsList.length})
            </button>
            <button
              onClick={() => setApprovalTab("reports")}
              className={[
                "flex-1 pb-3 text-center transition-all border-b-2 cursor-pointer bg-transparent whitespace-nowrap",
                approvalTab === "reports"
                  ? "border-[#006c49] text-[#006c49]"
                  : "border-transparent text-slate-500 hover:text-slate-700",
              ].join(" ")}
            >
              Báo Cáo ({pendingReportsList.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 max-h-[420px] pr-2">
            {approvalTab === "sellers" ? (
              pendingSellersList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-4 text-center">
                  <span className="material-symbols-outlined text-3xl text-slate-400">check_circle</span>
                  <p className="text-slate-500 text-xs font-bold mt-2">Đã duyệt hết hồ sơ!</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">Không có yêu cầu đăng ký người bán mới.</p>
                </div>
              ) : (
                pendingSellersList.map((user) => (
                  <div key={user.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{user.sellerInfo?.shopName || user.name}</h4>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                        <p className="text-slate-400 text-[11px] mt-1 font-semibold">Tỉnh: {user.sellerInfo?.province}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Pending
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelectedSeller(user)}
                        className="flex-grow py-1.5 bg-[#006c49]/10 hover:bg-[#006c49]/20 text-[#006c49] rounded-lg text-xs font-bold transition-all border border-[#006c49]/20 cursor-pointer flex justify-center items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : approvalTab === "products" ? (
              pendingProductsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-4 text-center">
                  <span className="material-symbols-outlined text-3xl text-slate-400">check_circle</span>
                  <p className="text-slate-500 text-xs font-bold mt-2">Đã duyệt hết sản phẩm!</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">Không có sản phẩm mới chờ phê duyệt.</p>
                </div>
              ) : (
                pendingProductsList.map((prod) => (
                  <div key={prod.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{prod.name}</h4>
                          <p className="text-[#006c49] text-xs font-extrabold">{formatCurrency(prod.price)} / {prod.unit}</p>
                          <p className="text-slate-500 text-[10px] font-semibold truncate">Shop: {prod.shopName}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex-shrink-0">
                        Pending
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelectedProduct(prod)}
                        className="flex-grow py-1.5 bg-[#006c49]/10 hover:bg-[#006c49]/20 text-[#006c49] rounded-lg text-xs font-bold transition-all border border-[#006c49]/20 cursor-pointer flex justify-center items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))
              )
            ) : (
              pendingReportsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-4 text-center">
                  <span className="material-symbols-outlined text-3xl text-slate-400">check_circle</span>
                  <p className="text-slate-500 text-xs font-bold mt-2">Đã xử lý hết báo cáo!</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">Không có báo cáo vi phạm mới cần xử lý.</p>
                </div>
              ) : (
                pendingReportsList.map((report) => (
                  <div key={report.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold mb-1.5 uppercase ${
                          report.type === "product" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                        }`}>
                          {report.type === "product" ? "Sản phẩm" : "Cửa hàng"}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1">
                          {report.type === "product" ? report.productName : report.shopName}
                        </h4>
                        <p className="text-slate-500 text-xs mt-1 font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-slate-400">flag</span>
                          {report.reason}
                        </p>
                        <p className="text-slate-400 text-[10px] font-medium mt-1">
                          Bởi: {report.reporterName || "Ẩn danh"}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex-shrink-0 font-sans">
                        Chờ xử lý
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="flex-grow py-1.5 bg-[#006c49]/10 hover:bg-[#006c49]/20 text-[#006c49] rounded-lg text-xs font-bold transition-all border border-[#006c49]/20 cursor-pointer flex justify-center items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Xem & Xử lý
                      </button>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>

        {/* User Management */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800">Danh sách Người dùng</h3>
            <p className="text-slate-500 text-xs mt-0.5">Danh sách các tài khoản và phân quyền tương ứng trên hệ thống.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <th className="pb-3 font-semibold">Tên / Email</th>
                  <th className="pb-3 font-semibold">Vai trò</th>
                  <th className="pb-3 font-semibold">Gia nhập</th>
                  <th className="pb-3 font-semibold text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3">
                      <div className="font-semibold text-slate-800">{user.name}</div>
                      <div className="text-slate-400 text-xs">{user.email}</div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={[
                            "px-2 py-0.5 rounded-full text-xs font-bold",
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "seller"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800",
                          ].join(" ")}
                        >
                          {user.role || "buyer"}
                        </span>
                        {user.role === "seller" && user.sellerStatus === "blocked" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Đang bị khóa
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-slate-500 text-xs">{user.memberSince || "N/A"}</td>
                    <td className="py-3 text-right font-sans">
                      {user.email !== "admin@nongsach.vn" ? (
                        <div className="flex justify-end gap-1.5 items-center">
                          {user.role === "seller" ? (
                            <>
                              {user.sellerStatus === "blocked" ? (
                                <button
                                  onClick={() => handleUnblockSeller(user.id)}
                                  disabled={actionLoading === user.id + "-unblock"}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-bold border-none cursor-pointer transition-all flex items-center gap-0.5"
                                >
                                  <span className="material-symbols-outlined text-[12px]">lock_open</span>
                                  Mở khóa Shop
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleChangeRole(user.id, "buyer")}
                                  disabled={actionLoading === user.id + "-role"}
                                  className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md text-[11px] font-bold border border-blue-100 cursor-pointer transition-all"
                                >
                                  Bỏ Shop (Buyer)
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={() => handleChangeRole(user.id, "seller")}
                              disabled={actionLoading === user.id + "-role"}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-md text-[11px] font-bold border border-emerald-100 cursor-pointer transition-all"
                            >
                              Lên Shop (Seller)
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Không được chỉnh sửa</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Admin Activity Logs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800">Lịch sử Hoạt động Admin</h3>
          <p className="text-slate-500 text-xs mt-0.5">Ghi lại toàn bộ lịch sử xử lý vi phạm, duyệt thành viên và sản phẩm.</p>
        </div>

        <div className="overflow-x-auto max-h-[300px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <th className="pb-3 font-semibold">Thời gian</th>
                <th className="pb-3 font-semibold">Admin</th>
                <th className="pb-3 font-semibold">Hành động</th>
                <th className="pb-3 font-semibold">Đối tượng</th>
                <th className="pb-3 font-semibold">Chi tiết / Lý do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold italic">
                    Chưa có lịch sử hoạt động ghi nhận.
                  </td>
                </tr>
              ) : (
                adminLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 font-medium text-slate-500">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-2.5">
                      <div className="font-bold text-slate-800">{log.adminName}</div>
                      <div className="text-slate-400 text-[10px]">{log.adminEmail}</div>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        log.action === "delete" ? "bg-red-100 text-red-800" :
                        log.action === "block" ? "bg-orange-100 text-orange-800" :
                        log.action === "warn" ? "bg-amber-100 text-amber-800" :
                        log.action === "ignore" ? "bg-slate-100 text-slate-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {log.action === "delete" && "Xóa"}
                        {log.action === "block" && "Khóa"}
                        {log.action === "warn" && "Cảnh báo"}
                        {log.action === "ignore" && "Bỏ qua"}
                        {log.action === "unblock" && "Mở khóa"}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <div className="font-bold text-slate-700">
                        {log.targetType === "product" ? "Sản phẩm" : "Cửa hàng"}
                      </div>
                      <div className="text-slate-500 text-[10px]">{log.targetName} (ID: {log.targetId})</div>
                    </td>
                    <td className="py-2.5 text-slate-600 font-medium max-w-[250px] truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Seller Registration Detail Modal */}
      {selectedSeller && (
        <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.6)',padding:'1rem'}}>
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">badge</span>
                  Chi tiết hồ sơ đăng ký người bán
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Xác minh thông tin đăng ký của đối tác nông nghiệp.</p>
              </div>
              <button
                onClick={() => setSelectedSeller(null)}
                className="h-8 w-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all border-none cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              {/* Banner and Logo */}
              <div className="relative">
                <div className="w-full h-32 rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-200">
                  {selectedSeller.sellerInfo?.coverImage ? (
                    <img
                      src={selectedSeller.sellerInfo.coverImage}
                      alt="Banner shop"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-300 bg-slate-50">
                      <span className="material-symbols-outlined text-4xl">storefront</span>
                    </div>
                  )}
                </div>
                <div className="absolute left-6 -bottom-6 h-16 w-16 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-md flex items-center justify-center">
                  {selectedSeller.sellerInfo?.shopLogo ? (
                    <img
                      src={selectedSeller.sellerInfo.shopLogo}
                      alt="Logo shop"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-slate-300 text-3xl">image</span>
                  )}
                </div>
              </div>

              {/* Section 1: Shop & Contact */}
              <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin cửa hàng</h4>
                  <div className="space-y-2.5 text-sm">
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Tên shop:</span>
                      <span className="font-bold text-slate-800">{selectedSeller.sellerInfo?.shopName || selectedSeller.name}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Slogan:</span>
                      <span className="font-semibold text-slate-700">{selectedSeller.sellerInfo?.slogan || "N/A"}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5 flex-col">
                      <span className="text-slate-500 mb-0.5">Giới thiệu shop:</span>
                      <span className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs leading-normal">
                        {selectedSeller.sellerInfo?.description || "N/A"}
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Danh mục chính:</span>
                      <span className="font-semibold text-slate-700">{selectedSeller.sellerInfo?.mainCategories?.join(", ") || "N/A"}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin liên hệ</h4>
                  <div className="space-y-2.5 text-sm">
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Họ tên đại diện:</span>
                      <span className="font-bold text-slate-800">{selectedSeller.name}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Email đăng ký:</span>
                      <span className="font-semibold text-slate-700">{selectedSeller.email}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Số điện thoại:</span>
                      <span className="font-bold text-slate-800">{selectedSeller.sellerInfo?.shopPhone || selectedSeller.phone || "N/A"}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Số Zalo:</span>
                      <span className="font-bold text-slate-800">{selectedSeller.sellerInfo?.shopZalo || "N/A"}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Farm Details */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin trang trại & canh tác</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Tỉnh/Thành phố:</span>
                      <span className="font-semibold text-slate-700">{selectedSeller.sellerInfo?.province || "N/A"}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Địa chỉ cụ thể:</span>
                      <span className="font-semibold text-slate-700 text-right max-w-[200px] truncate" title={selectedSeller.sellerInfo?.farmAddress}>
                        {selectedSeller.sellerInfo?.farmAddress || "N/A"}
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Tiêu chuẩn canh tác:</span>
                      <span className="font-bold text-emerald-700">{selectedSeller.sellerInfo?.farmingStandards?.join(", ") || "N/A"}</span>
                    </p>
                    {selectedSeller.sellerInfo?.farmingStandardsDetail && (
                      <p className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Chi tiết tiêu chuẩn:</span>
                        <span className="text-slate-600 text-right">{selectedSeller.sellerInfo.farmingStandardsDetail}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Farm Images Gallery */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500">Hình ảnh thực tế nông trại (click để phóng to):</span>
                  {selectedSeller.sellerInfo?.farmImages && selectedSeller.sellerInfo.farmImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {selectedSeller.sellerInfo.farmImages.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setZoomImage(img)}
                          className="relative h-20 rounded-xl overflow-hidden border border-slate-200 cursor-zoom-in hover:brightness-90 transition-all bg-slate-50"
                        >
                          <img src={img} alt={`Farm image ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Không có ảnh thực tế nông trại nào được đăng.</p>
                  )}
                </div>
              </div>

              {/* Section 3: Identity & Bank */}
              <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Xác minh danh tính (CCCD)</h4>
                  <div className="text-sm border-b border-slate-100 pb-2">
                    <span className="text-slate-500 mr-2">Số CCCD/CMND:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedSeller.sellerInfo?.idCardNumber || "N/A"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Mặt trước CCCD (click để xem)</span>
                      <div
                        onClick={() => selectedSeller.sellerInfo?.idCardFront && setZoomImage(selectedSeller.sellerInfo.idCardFront)}
                        className="relative h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-zoom-in hover:brightness-95 transition-all flex items-center justify-center"
                      >
                        {selectedSeller.sellerInfo?.idCardFront ? (
                          <img src={selectedSeller.sellerInfo.idCardFront} alt="CCCD Front" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-slate-300">broken_image</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Mặt sau CCCD (click để xem)</span>
                      <div
                        onClick={() => selectedSeller.sellerInfo?.idCardBack && setZoomImage(selectedSeller.sellerInfo.idCardBack)}
                        className="relative h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-zoom-in hover:brightness-95 transition-all flex items-center justify-center"
                      >
                        {selectedSeller.sellerInfo?.idCardBack ? (
                          <img src={selectedSeller.sellerInfo.idCardBack} alt="CCCD Back" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-slate-300">broken_image</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin nhận thanh toán</h4>
                  <div className="space-y-2.5 text-sm">
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Ngân hàng:</span>
                      <span className="font-bold text-slate-800">{selectedSeller.sellerInfo?.bankName || "N/A"}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Số tài khoản:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedSeller.sellerInfo?.bankAccountNumber || "N/A"}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Tên thụ hưởng:</span>
                      <span className="font-bold text-slate-800 uppercase">{selectedSeller.sellerInfo?.bankAccountName || "N/A"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedSeller(null)}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setIsRejectModalOpen(true);
                }}
                className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">block</span>
                Từ chối hồ sơ
              </button>
              <button
                onClick={async () => {
                  if (confirm(`Bạn có chắc chắn muốn phê duyệt cửa hàng "${selectedSeller.sellerInfo?.shopName || selectedSeller.name}" không?`)) {
                    await handleApprove(selectedSeller.id);
                    setSelectedSeller(null);
                  }
                }}
                disabled={actionLoading === selectedSeller.id}
                className="px-5 py-2.5 bg-[#006c49] hover:bg-[#005236] text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5"
              >
                {actionLoading === selectedSeller.id ? (
                  <span className="w-4.5 h-4.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Phê duyệt đối tác
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Sub-Modal */}
      {isRejectModalOpen && selectedSeller && (
        <div style={{position:'fixed',inset:0,zIndex:60,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.6)',padding:'1rem'}}>
          <div style={{backgroundColor:'white',width:'100%',maxWidth:'28rem',borderRadius:'1.5rem',boxShadow:'0 25px 50px -12px rgba(0,0,0,0.25)',padding:'1.5rem',border:'1px solid #f1f5f9',display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div>
              <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600">report_problem</span>
                Lý do từ chối hồ sơ
              </h4>
              <p className="text-slate-500 text-xs mt-1">
                Nêu rõ lý do để nông dân biết cần điều chỉnh thông tin gì để đăng ký lại.
              </p>
            </div>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Ảnh chụp CCCD bị mờ góc dưới, không nhìn rõ số thẻ. Hoặc: Chưa đăng tải ảnh thực tế nông trại."
              rows={4}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none"
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer bg-white"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  if (!rejectReason.trim()) {
                    alert("Vui lòng nhập lý do từ chối!");
                    return;
                  }
                  await handleRejectSeller(selectedSeller.id, rejectReason.trim());
                  setIsRejectModalOpen(false);
                  setRejectReason("");
                  setSelectedSeller(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.6)',padding:'1rem'}}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">shopping_bag</span>
                  Chi tiết sản phẩm chờ duyệt
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">Xác minh thông tin sản phẩm tự đăng của seller.</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="h-8 w-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all border-none cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Gallery Preview */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-500">Hình ảnh sản phẩm:</span>
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-contain" />
                  </div>
                  {selectedProduct.images && selectedProduct.images.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {selectedProduct.images.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setZoomImage(img)}
                          className="relative h-10 rounded-lg overflow-hidden border border-slate-200 cursor-zoom-in hover:brightness-95 transition-all bg-white"
                        >
                          <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{selectedProduct.name}</h4>
                    <p className="text-[#006c49] text-base font-extrabold mt-1">
                      {formatCurrency(selectedProduct.price)} / {selectedProduct.unit}
                    </p>
                  </div>
                  <div className="space-y-2.5 text-xs text-slate-700">
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-400">Danh mục:</span>
                      <span className="font-bold text-slate-800">
                        {selectedProduct.category === "vegetables" && "Rau củ"}
                        {selectedProduct.category === "fruits" && "Trái cây"}
                        {selectedProduct.category === "grains" && "Ngũ cốc"}
                        {selectedProduct.category === "roots" && "Củ quả"}
                        {selectedProduct.category === "herbs" && "Thảo mộc"}
                        {selectedProduct.category === "other" && "Khác"}
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-400">Tồn kho:</span>
                      <span className="font-bold text-slate-800">{selectedProduct.stock} {selectedProduct.unit}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-400">Nguồn gốc:</span>
                      <span className="font-bold text-slate-800">{selectedProduct.origin}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-400">Tiêu chuẩn:</span>
                      <span className="font-bold text-emerald-700">
                        {selectedProduct.isOrganic ? "Hữu cơ (Organic)" : "Mặc định"}
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-400">Người bán (Shop):</span>
                      <span className="font-bold text-slate-800">{selectedProduct.shopName}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block">Mô tả chi tiết:</span>
                <p className="text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs leading-relaxed whitespace-pre-line">
                  {selectedProduct.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setIsRejectProductModalOpen(true);
                }}
                className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">block</span>
                Từ chối duyệt
              </button>
              <button
                onClick={async () => {
                  if (confirm(`Bạn có chắc chắn muốn phê duyệt sản phẩm "${selectedProduct.name}" không?`)) {
                    await handleApproveProduct(selectedProduct.id);
                    setSelectedProduct(null);
                  }
                }}
                disabled={actionLoading === selectedProduct.id}
                className="px-5 py-2.5 bg-[#006c49] hover:bg-[#005236] text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5"
              >
                {actionLoading === selectedProduct.id ? (
                  <span className="w-4.5 h-4.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Phê duyệt sản phẩm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Rejection Sub-Modal */}
      {isRejectProductModalOpen && selectedProduct && (
        <div style={{position:'fixed',inset:0,zIndex:60,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.6)',padding:'1rem'}}>
          <div style={{backgroundColor:'white',width:'100%',maxWidth:'28rem',borderRadius:'1.5rem',boxShadow:'0 25px 50px -12px rgba(0,0,0,0.25)',padding:'1.5rem',border:'1px solid #f1f5f9',display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div>
              <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600">report_problem</span>
                Lý do từ chối sản phẩm
              </h4>
              <p className="text-slate-500 text-xs mt-1">
                Nêu rõ lý do để người bán biết cần chỉnh sửa lại thông tin gì.
              </p>
            </div>

            <textarea
              value={rejectProductReason}
              onChange={(e) => setRejectProductReason(e.target.value)}
              placeholder="Ví dụ: Hình ảnh sản phẩm bị mờ, vui lòng bổ sung ảnh thực tế chất lượng cao."
              rows={4}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none"
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setIsRejectProductModalOpen(false);
                  setRejectProductReason("");
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer bg-white"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  if (!rejectProductReason.trim()) {
                    alert("Vui lòng nhập lý do từ chối!");
                    return;
                  }
                  await handleRejectProduct(selectedProduct.id, rejectProductReason.trim());
                  setIsRejectProductModalOpen(false);
                  setRejectProductReason("");
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div style={{position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.6)',padding:'1rem'}}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-sans">
                  <span className="material-symbols-outlined text-rose-600">flag</span>
                  Chi tiết báo cáo vi phạm
                </h3>
                <p className="text-slate-500 text-xs mt-0.5 font-sans">Xem xét nội dung phản ánh từ người dùng và đưa ra quyết định xử lý.</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="h-8 w-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all border-none cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side: Report info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Thông tin báo cáo</h4>
                  <div className="space-y-2.5 text-xs font-sans">
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Mã báo cáo:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedReport.id}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Loại đối tượng:</span>
                      <span className={`font-bold uppercase ${selectedReport.type === 'product' ? 'text-amber-700' : 'text-red-700'}`}>
                        {selectedReport.type === 'product' ? 'Sản phẩm' : 'Cửa hàng'}
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Lý do báo cáo:</span>
                      <span className="font-bold text-slate-800">{selectedReport.reason}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Người báo cáo:</span>
                      <span className="font-bold text-slate-800">{selectedReport.reporterName || "Ẩn danh"}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Mã người báo cáo (ID):</span>
                      <span className="font-mono text-slate-700">{selectedReport.reporterId}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Thời gian báo cáo:</span>
                      <span className="font-bold text-slate-800">{new Date(selectedReport.createdAt).toLocaleString('vi-VN')}</span>
                    </p>
                  </div>
                </div>

                {/* Right Side: Target Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Thông tin đối tượng bị báo cáo</h4>
                  <div className="space-y-2.5 text-xs font-sans">
                    {selectedReport.type === "product" ? (
                      <>
                        <p className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span className="text-slate-500">Tên sản phẩm:</span>
                          <span className="font-bold text-slate-800">{selectedReport.productName}</span>
                        </p>
                        <p className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span className="text-slate-500">Mã sản phẩm (ID):</span>
                          <span className="font-mono text-slate-700">{selectedReport.productId}</span>
                        </p>
                        <p className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span className="text-slate-500">Thuộc shop:</span>
                          <span className="font-bold text-slate-800">{selectedReport.shopName}</span>
                        </p>
                        <p className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span className="text-slate-500">Mã shop (ID):</span>
                          <span className="font-mono text-slate-700">{selectedReport.shopId}</span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span className="text-slate-500">Tên shop:</span>
                          <span className="font-bold text-slate-800">{selectedReport.shopName}</span>
                        </p>
                        <p className="flex justify-between border-b border-slate-100 pb-1.5">
                          <span className="text-slate-500">Mã shop (ID):</span>
                          <span className="font-mono text-slate-700">{selectedReport.shopId}</span>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Textarea View */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 block font-sans">Nội dung chi tiết phản ánh:</span>
                <div className="text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs leading-relaxed whitespace-pre-line min-h-[80px] font-sans">
                  {selectedReport.details || "Không có mô tả chi tiết đi kèm."}
                </div>
              </div>
            </div>

            {/* Modal Footer with 4 Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-2.5 justify-end font-sans">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
              >
                Đóng
              </button>
              
              <button
                onClick={async () => {
                  if (confirm(`Bạn có chắc muốn bỏ qua báo cáo này?`)) {
                    await handleIgnoreReport(selectedReport.id);
                    setSelectedReport(null);
                  }
                }}
                disabled={actionLoading === selectedReport.id}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">visibility_off</span>
                Bỏ qua
              </button>

              <button
                onClick={() => {
                  setReportActionType("warn");
                  setIsActionModalOpen(true);
                }}
                disabled={actionLoading === selectedReport.id}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">warning</span>
                Cảnh báo
              </button>

              <button
                onClick={() => {
                  setReportActionType("block");
                  setIsActionModalOpen(true);
                }}
                disabled={actionLoading === selectedReport.id}
                className="px-4 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">block</span>
                Khóa tạm
              </button>

              <button
                onClick={() => {
                  setReportActionType("delete");
                  setIsActionModalOpen(true);
                }}
                disabled={actionLoading === selectedReport.id}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Xóa vi phạm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Reason Input Sub-Modal */}
      {isActionModalOpen && selectedReport && reportActionType && (
        <div style={{position:'fixed',inset:0,zIndex:60,display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0.6)',padding:'1rem'}}>
          <div style={{backgroundColor:'white',width:'100%',maxWidth:'28rem',borderRadius:'1.5rem',boxShadow:'0 25px 50px -12px rgba(0,0,0,0.25)',padding:'1.5rem',border:'1px solid #f1f5f9',display:'flex',flexDirection:'column',gap:'1rem'}}>
            <div>
              <h4 className="text-base font-bold text-slate-800 flex items-center gap-2 font-sans">
                <span className="material-symbols-outlined text-rose-600">report_problem</span>
                {reportActionType === "warn" && "Gửi Cảnh báo tới người bán"}
                {reportActionType === "block" && "Lý do Khóa tạm đối tượng"}
                {reportActionType === "delete" && "Lý do Xóa đối tượng"}
              </h4>
              <p className="text-slate-500 text-xs mt-1 font-sans">
                {reportActionType === "warn" && "Nội dung cảnh báo sẽ được gửi trực tiếp đến hộp thư của người bán."}
                {reportActionType === "block" && "Nêu rõ lý do để ghi lại vào lịch sử và gửi thông báo tới người bán."}
                {reportActionType === "delete" && "Quyết định xóa sẽ gỡ bỏ vĩnh viễn đối tượng khỏi hệ thống nông sản sạch."}
              </p>
            </div>

            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder={
                reportActionType === "warn"
                  ? "Nhập nội dung cảnh báo vi phạm... Ví dụ: Sản phẩm của bạn có dấu hiệu sai lệch mô tả giá cả..."
                  : "Nhập lý do xử lý cụ thể..."
              }
              rows={4}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-700 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none resize-none font-sans"
            />

            <div className="flex gap-2 justify-end font-sans">
              <button
                onClick={() => {
                  setIsActionModalOpen(false);
                  setActionReason("");
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-all cursor-pointer bg-white"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  if (!actionReason.trim()) {
                    alert("Vui lòng nhập lý do xử lý!");
                    return;
                  }
                  const reasonText = actionReason.trim();
                  
                  if (reportActionType === "warn") {
                    await handleWarnReport(selectedReport, reasonText);
                  } else if (reportActionType === "block") {
                    await handleBlockReport(selectedReport, reasonText);
                  } else if (reportActionType === "delete") {
                    await handleDeleteReport(selectedReport, reasonText);
                  }
                  
                  setIsActionModalOpen(false);
                  setActionReason("");
                  setSelectedReport(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Image Overlay */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          style={{position:'fixed',inset:0,zIndex:70,backgroundColor:'rgba(0,0,0,0.9)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',cursor:'zoom-out'}}
        >
          <div className="relative max-w-full max-h-full">
            <img src={zoomImage} alt="Zoomed view" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl" />
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-2 right-2 h-9 w-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition border-none cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
