"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/types/user";
import { useAuthStore } from "@/store/auth-store";
import { Order } from "@/types/order";
import { formatCurrency } from "@/lib/format";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filters for chart
  const [dateRange, setDateRange] = useState<"7" | "30">("30");
  const [activeMetric, setActiveMetric] = useState<"revenue" | "orders">("revenue");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const approveSeller = useAuthStore((s) => s.approveSeller);

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

  const handleRejectSeller = async (userId: string) => {
    if (!confirm("Bạn có chắc chắn muốn từ chối hồ sơ này không?")) return;
    setActionLoading(userId);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        sellerStatus: "rejected",
      });
      await fetchData();
    } catch (error) {
      console.error("Error rejecting seller:", error);
      alert("Từ chối thất bại!");
    } finally {
      setActionLoading(null);
    }
  };

  const handleChangeRole = async (userId: string, newRole: "buyer" | "seller" | "admin") => {
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
    <div className="space-y-8 page-enter">
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
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">notifications_active</span>
              Hồ sơ chờ duyệt ({pendingSellersList.length})
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Duyệt nông dân đăng ký bán hàng.</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 max-h-[420px] pr-2">
            {pendingSellersList.length === 0 ? (
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
                      onClick={() => handleApprove(user.id)}
                      disabled={!!actionLoading}
                      className="flex-grow py-1.5 bg-[#006c49] hover:bg-[#005236] disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all border-none cursor-pointer flex justify-center items-center gap-1"
                    >
                      {actionLoading === user.id ? (
                        <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Duyệt"
                      )}
                    </button>
                    <button
                      onClick={() => handleRejectSeller(user.id)}
                      disabled={!!actionLoading}
                      className="flex-grow py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 disabled:opacity-50 rounded-lg text-xs font-bold transition-all border border-rose-100 cursor-pointer flex justify-center items-center gap-1"
                    >
                      {actionLoading === user.id ? (
                        <span className="w-3 h-3 border-2 border-rose-600/40 border-t-rose-600 rounded-full animate-spin" />
                      ) : (
                        "Từ chối"
                      )}
                    </button>
                  </div>
                </div>
              ))
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
                    </td>
                    <td className="py-3 text-slate-500 text-xs">{user.memberSince || "N/A"}</td>
                    <td className="py-3 text-right">
                      {user.role !== "admin" ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleChangeRole(user.id, "admin")}
                            disabled={actionLoading === user.id + "-role"}
                            className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-md text-[11px] font-bold border border-purple-100 cursor-pointer transition-all"
                          >
                            Lên Admin
                          </button>
                          {user.role === "seller" ? (
                            <button
                              onClick={() => handleChangeRole(user.id, "buyer")}
                              disabled={actionLoading === user.id + "-role"}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md text-[11px] font-bold border border-blue-100 cursor-pointer transition-all"
                            >
                              Bỏ Shop (Buyer)
                            </button>
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
    </div>
  );
}
