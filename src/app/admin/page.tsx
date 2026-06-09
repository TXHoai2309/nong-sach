"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@/types/user";
import { useAuthStore } from "@/store/auth-store";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [productsCount, setProductsCount] = useState(0);
  const [shopsCount, setShopsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const approveSeller = useAuthStore((s) => s.approveSeller);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersCol = collection(db, "users");
      const usersSnap = await getDocs(usersCol);
      const fetchedUsers: User[] = [];
      usersSnap.forEach((doc) => {
        fetchedUsers.push({ id: doc.id, ...doc.data() } as User);
      });
      setUsers(fetchedUsers);

      // Fetch products count
      const productsCol = collection(db, "products");
      const productsSnap = await getDocs(productsCol);
      setProductsCount(productsSnap.size);

      // Fetch shops count
      const shopsCol = collection(db, "shops");
      const shopsSnap = await getDocs(shopsCol);
      setShopsCount(shopsSnap.size);
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


  const pendingSellersList = users.filter((u) => u.sellerStatus === "pending");

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
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Chờ duyệt</p>
            <p className="text-2xl font-bold text-slate-800">{pendingSellers}</p>
          </div>
        </div>

        {/* Total Sellers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">store</span>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Số nhà vườn (Shop)</p>
            <p className="text-2xl font-bold text-slate-800">{shopsCount}</p>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">inventory_2</span>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tổng sản phẩm</p>
            <p className="text-2xl font-bold text-slate-800">{productsCount}</p>
          </div>
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
