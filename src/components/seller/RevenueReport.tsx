"use client";

import React, { useState, useMemo } from "react";
import { Order } from "@/types/order";
import { formatCurrency } from "@/lib/format";
import { BarChart, LineChart, Download, Calendar, TrendingUp, Package, ShoppingBag, Landmark } from "lucide-react";

interface RevenueReportProps {
  sellerOrders: Order[];
}

export function RevenueReport({ sellerOrders }: RevenueReportProps) {
  const [filterDays, setFilterDays] = useState<7 | 30 | 90>(7);
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // 1. Filter orders within the selected time window (excluding cancelled)
  const filteredOrders = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - filterDays);
    cutoffDate.setHours(0, 0, 0, 0);

    return sellerOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= cutoffDate;
    });
  }, [sellerOrders, filterDays]);

  // 2. Active orders (all except cancelled) for revenue metrics
  const activeOrders = useMemo(() => {
    return filteredOrders.filter((o) => o.status !== "cancelled");
  }, [filteredOrders]);

  // 3. Delivered orders for completed revenue metrics
  const deliveredOrders = useMemo(() => {
    return filteredOrders.filter((o) => o.status === "delivered");
  }, [filteredOrders]);

  // 4. Calculate key metrics for the cards
  const metrics = useMemo(() => {
    const estimatedRevenue = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const completedRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const orderCount = activeOrders.length;
    const avgOrderValue = orderCount > 0 ? Math.round(estimatedRevenue / orderCount) : 0;

    return {
      estimatedRevenue,
      completedRevenue,
      orderCount,
      avgOrderValue,
    };
  }, [activeOrders, deliveredOrders]);

  // 5. Generate daily timeline data for the chart
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = filterDays - 1; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - i);
      
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, "0");
      const day = String(targetDate.getDate()).padStart(2, "0");
      const dateString = `${year}-${month}-${day}`;
      const label = `${day}/${month}`;

      // Aggregate revenue for this day
      const dayOrders = activeOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const oYear = orderDate.getFullYear();
        const oMonth = String(orderDate.getMonth() + 1).padStart(2, "0");
        const oDay = String(orderDate.getDate()).padStart(2, "0");
        return `${oYear}-${oMonth}-${oDay}` === dateString;
      });

      const revenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const orderCount = dayOrders.length;

      data.push({
        dateStr: dateString,
        label,
        revenue,
        orderCount,
      });
    }

    return data;
  }, [activeOrders, filterDays]);

  // 6. Calculate Top 5 best-selling products in the period
  const topProducts = useMemo(() => {
    const productMap: {
      [key: string]: {
        id: string;
        name: string;
        image: string;
        quantity: number;
        revenue: number;
      };
    } = {};

    activeOrders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.productId;
        if (!productMap[productId]) {
          productMap[productId] = {
            id: productId,
            name: item.name,
            image: item.image,
            quantity: 0,
            revenue: 0,
          };
        }
        productMap[productId].quantity += item.quantity;
        productMap[productId].revenue += item.price * item.quantity;
      });
    });

    return Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [activeOrders]);

  // Max value for scaling the SVG chart
  const maxRevenue = useMemo(() => {
    const maxVal = Math.max(...chartData.map((d) => d.revenue), 0);
    return maxVal > 0 ? maxVal : 100000; // default minimum scale to prevent division by zero
  }, [chartData]);

  // SVG Chart Layout parameters
  const svgWidth = 800;
  const svgHeight = 300;
  const paddingLeft = 70;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Generate drawing points for Line Chart
  const linePoints = useMemo(() => {
    return chartData.map((d, idx) => {
      const x = paddingLeft + (idx / (chartData.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - (d.revenue / maxRevenue) * chartHeight;
      return { x, y, ...d };
    });
  }, [chartData, maxRevenue, chartWidth, chartHeight]);

  const linePathD = useMemo(() => {
    return linePoints.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");
  }, [linePoints]);

  const lineAreaD = useMemo(() => {
    if (linePoints.length === 0) return "";
    const firstPoint = linePoints[0];
    const lastPoint = linePoints[linePoints.length - 1];
    const zeroY = paddingTop + chartHeight;
    return `${linePathD} L ${lastPoint.x} ${zeroY} L ${firstPoint.x} ${zeroY} Z`;
  }, [linePoints, linePathD, chartHeight]);

  // Generate drawing points/bars for Bar Chart
  const barData = useMemo(() => {
    const numBars = chartData.length;
    const groupWidth = chartWidth / numBars;
    const barWidth = Math.max(groupWidth * 0.6, 2); // 60% of slot width

    return chartData.map((d, idx) => {
      const x = paddingLeft + idx * groupWidth + (groupWidth - barWidth) / 2;
      const valHeight = (d.revenue / maxRevenue) * chartHeight;
      const y = paddingTop + chartHeight - valHeight;
      return {
        x,
        y,
        width: barWidth,
        height: Math.max(valHeight, 2), // min height to show a sliver for > 0 values
        ...d,
      };
    });
  }, [chartData, maxRevenue, chartWidth, chartHeight]);

  // 7. Handle CSV Export
  const handleExportCSV = () => {
    const headers = [
      "Mã Đơn Hàng",
      "Ngày Đặt Hàng",
      "Tên Khách Hàng",
      "Số Điện Thoại",
      "Địa Chỉ Giao Hàng",
      "Danh Sách Sản Phẩm",
      "Tổng Tiền (VND)",
      "Phương Thức Thanh Toán",
      "Trạng Thái Đơn Hàng",
    ];

    const rows = filteredOrders.map((order) => {
      const itemsSummary = order.items
        .map((item) => `${item.name} (x${item.quantity})`)
        .join("; ");
      
      const formattedDate = new Date(order.createdAt).toLocaleString("vi-VN");
      
      return [
        order.id,
        formattedDate,
        order.fullName,
        order.phone,
        order.address,
        itemsSummary,
        order.totalAmount,
        order.paymentMethod.toUpperCase(),
        order.status,
      ];
    });

    const csvContent =
      "\uFEFF" + // UTF-8 BOM
      [
        headers.join(","),
        ...rows.map((row) =>
          row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Bao_cao_doanh_thu_seller_${filterDays}_ngay.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header with control filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#bbcabf]/30 rounded-3xl p-6 shadow-sm">
        <div>
          <h3 className="text-base font-extrabold text-[#3c4a42] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49]">analytics</span>
            Đánh Giá & Báo Cáo Kinh Doanh
          </h3>
          <p className="text-xs text-[#3c4a42]/70 font-semibold mt-1">
            Hiển thị doanh thu, đơn hàng và các mặt hàng bán chạy trong kỳ.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Day range filters */}
          <div className="flex items-center gap-1 rounded-full bg-[#f4f6fa] p-1 text-xs font-bold w-full sm:w-auto justify-between sm:justify-start">
            {([7, 30, 90] as const).map((days) => (
              <button
                key={days}
                onClick={() => {
                  setFilterDays(days);
                  setHoveredIdx(null);
                }}
                className={`rounded-full px-4 py-2 transition-all cursor-pointer ${
                  filterDays === days
                    ? "bg-[#006c49] text-white shadow-sm"
                    : "text-[#3c4a42]/70 hover:text-[#3c4a42]"
                }`}
              >
                {days} Ngày
              </button>
            ))}
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="w-full sm:w-auto rounded-full bg-white hover:bg-gray-50 border border-[#bbcabf]/50 px-4 py-2 text-xs font-bold text-[#3c4a42] shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#006c49]" />
            Xuất Excel CSV
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Doanh thu tạm tính",
            value: formatCurrency(metrics.estimatedRevenue),
            desc: "Tổng doanh thu (trừ hủy)",
            icon: Landmark,
            color: "text-blue-600 bg-blue-50 border-blue-100",
          },
          {
            title: "Doanh thu hoàn thành",
            value: formatCurrency(metrics.completedRevenue),
            desc: "Đơn giao thành công",
            icon: TrendingUp,
            color: "text-emerald-600 bg-emerald-50 border-emerald-100",
          },
          {
            title: "Số lượng đơn hàng",
            value: metrics.orderCount,
            desc: "Đơn hàng phát sinh",
            icon: ShoppingBag,
            color: "text-amber-600 bg-amber-50 border-amber-100",
          },
          {
            title: "Giá trị trung bình đơn",
            value: formatCurrency(metrics.avgOrderValue),
            desc: "Doanh thu / số đơn hàng",
            icon: Package,
            color: "text-purple-600 bg-purple-50 border-purple-100",
          },
        ].map((stat, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-[#bbcabf]/20 bg-white shadow-sm flex flex-col justify-between h-32">
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-[#3c4a42]/60 uppercase tracking-wide">{stat.title}</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-lg font-extrabold text-[#3c4a42] tracking-tight">{stat.value}</p>
              <p className="text-[10px] text-[#3c4a42]/50 font-semibold mt-0.5">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-[#bbcabf]/30 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-sm font-bold text-[#3c4a42] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-base">monitoring</span>
            Biểu Đồ Xu Hướng Doanh Thu
          </h4>
          <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button
              onClick={() => {
                setChartType("line");
                setHoveredIdx(null);
              }}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                chartType === "line" ? "bg-white text-[#006c49] shadow-sm" : "text-[#3c4a42]/60 hover:text-[#3c4a42]"
              }`}
              title="Biểu đồ đường"
            >
              <LineChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setChartType("bar");
                setHoveredIdx(null);
              }}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                chartType === "bar" ? "bg-white text-[#006c49] shadow-sm" : "text-[#3c4a42]/60 hover:text-[#3c4a42]"
              }`}
              title="Biểu đồ cột"
            >
              <BarChart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SVG Drawing Container */}
        {activeOrders.length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center border border-dashed border-[#bbcabf]/40 rounded-2xl bg-gray-50 text-[#3c4a42]/50">
            <Calendar className="w-10 h-10 mb-2 opacity-40 text-[#3c4a42]" />
            <p className="text-xs font-bold">Không có dữ liệu đơn hàng phát sinh trong khoảng thời gian này</p>
          </div>
        ) : (
          <div className="relative w-full overflow-x-auto pt-2">
            <div className="min-w-[800px] relative">
              <svg
                width={svgWidth}
                height={svgHeight}
                className="overflow-visible select-none"
              >
                <defs>
                  {/* Gradient for Line Area fill */}
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#006c49" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#006c49" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines & Y-Axis Labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const yVal = paddingTop + chartHeight - ratio * chartHeight;
                  const labelVal = ratio * maxRevenue;

                  return (
                    <g key={index} className="opacity-40">
                      <line
                        x1={paddingLeft}
                        y1={yVal}
                        x2={svgWidth - paddingRight}
                        y2={yVal}
                        stroke="#bbcabf"
                        strokeDasharray="4 4"
                        strokeWidth={1}
                      />
                      <text
                        x={paddingLeft - 10}
                        y={yVal + 4}
                        textAnchor="end"
                        className="text-[10px] font-bold fill-[#3c4a42]/70 font-mono"
                      >
                        {labelVal >= 1000000
                          ? `${(labelVal / 1000000).toFixed(1)}M`
                          : labelVal >= 1000
                          ? `${(labelVal / 1000).toFixed(0)}k`
                          : `${labelVal}`}
                      </text>
                    </g>
                  );
                })}

                {/* Draw actual Chart data */}
                {chartType === "line" ? (
                  <>
                    {/* Area under the line */}
                    {lineAreaD && (
                      <path d={lineAreaD} fill="url(#chartGradient)" />
                    )}

                    {/* Main stroke line */}
                    {linePathD && (
                      <path
                        d={linePathD}
                        fill="none"
                        stroke="#006c49"
                        strokeWidth={3.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Interactive overlay points/circles */}
                    {filterDays <= 30 &&
                      linePoints.map((p, idx) => (
                        <circle
                          key={idx}
                          cx={p.x}
                          cy={p.y}
                          r={hoveredIdx === idx ? 6 : 4}
                          fill={hoveredIdx === idx ? "#006c49" : "#ffffff"}
                          stroke="#006c49"
                          strokeWidth={2.5}
                          className="transition-all duration-150 pointer-events-none"
                        />
                      ))}
                  </>
                ) : (
                  // Bar Chart Drawing
                  barData.map((b, idx) => (
                    <rect
                      key={idx}
                      x={b.x}
                      y={b.y}
                      width={b.width}
                      height={b.height}
                      fill={hoveredIdx === idx ? "#005338" : "#006c49"}
                      rx={b.height > 6 ? 3 : 1}
                      className="transition-all duration-150 pointer-events-none"
                    />
                  ))
                )}

                {/* X-Axis labels */}
                {chartData.map((d, idx) => {
                  // Show fewer labels for 30 and 90 days to prevent overlapping
                  const skip =
                    filterDays === 30 ? idx % 3 !== 0 : filterDays === 90 ? idx % 8 !== 0 : false;
                  if (skip) return null;

                  let x = 0;
                  if (chartType === "line") {
                    x = paddingLeft + (idx / (chartData.length - 1)) * chartWidth;
                  } else {
                    const groupWidth = chartWidth / chartData.length;
                    x = paddingLeft + idx * groupWidth + groupWidth / 2;
                  }

                  return (
                    <text
                      key={idx}
                      x={x}
                      y={svgHeight - 15}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-[#3c4a42]/70"
                    >
                      {d.label}
                    </text>
                  );
                })}

                {/* Y-Axis Line */}
                <line
                  x1={paddingLeft}
                  y1={paddingTop}
                  x2={paddingLeft}
                  y2={paddingTop + chartHeight}
                  stroke="#bbcabf"
                  strokeWidth={1.5}
                />

                {/* X-Axis Line */}
                <line
                  x1={paddingLeft}
                  y1={paddingTop + chartHeight}
                  x2={svgWidth - paddingRight}
                  y2={paddingTop + chartHeight}
                  stroke="#bbcabf"
                  strokeWidth={1.5}
                />

                {/* Hover interactions: Vertical line and invisible mouse hover areas */}
                {hoveredIdx !== null && (
                  <line
                    x1={
                      chartType === "line"
                        ? linePoints[hoveredIdx].x
                        : barData[hoveredIdx].x + barData[hoveredIdx].width / 2
                    }
                    y1={paddingTop}
                    x2={
                      chartType === "line"
                        ? linePoints[hoveredIdx].x
                        : barData[hoveredIdx].x + barData[hoveredIdx].width / 2
                    }
                    y2={paddingTop + chartHeight}
                    stroke="#006c49"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    className="opacity-70 pointer-events-none"
                  />
                )}

                {/* Invisible hover zones representing columns */}
                {chartData.map((_, idx) => {
                  const groupWidth = chartWidth / chartData.length;
                  const x = paddingLeft + idx * groupWidth;
                  return (
                    <rect
                      key={idx}
                      x={x}
                      y={paddingTop}
                      width={groupWidth}
                      height={chartHeight}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                  );
                })}
              </svg>

              {/* Absolute HTML Tooltip positioned above SVG relative container */}
              {hoveredIdx !== null && (
                <div
                  className="absolute z-10 bg-[#3c4a42] text-white p-3 rounded-xl shadow-md text-xs border border-white/10 pointer-events-none transition-all duration-150"
                  style={{
                    left: `${
                      chartType === "line"
                        ? linePoints[hoveredIdx].x + 10
                        : barData[hoveredIdx].x + barData[hoveredIdx].width / 2 + 10
                    }px`,
                    top: `${Math.min(
                      chartType === "line" ? linePoints[hoveredIdx].y - 45 : barData[hoveredIdx].y - 45,
                      svgHeight - 110
                    )}px`,
                  }}
                >
                  <p className="font-bold border-b border-white/20 pb-1 mb-1">
                    Ngày {chartData[hoveredIdx].label}
                  </p>
                  <p className="font-mono text-[#e6f4ea] font-semibold">
                    Doanh thu: {formatCurrency(chartData[hoveredIdx].revenue)}
                  </p>
                  <p className="text-[10px] text-white/75 mt-0.5">
                    Số đơn hàng: {chartData[hoveredIdx].orderCount} đơn
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Top Products Section */}
      <div className="bg-white border border-[#bbcabf]/30 rounded-3xl p-6 shadow-sm">
        <h4 className="text-sm font-bold text-[#3c4a42] flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-[#006c49] text-base">stars</span>
          Top 5 Sản Phẩm Bán Chạy Nhất
        </h4>

        {topProducts.length === 0 ? (
          <div className="py-10 text-center text-[#3c4a42]/50 text-xs font-bold border border-dashed border-[#bbcabf]/30 rounded-2xl bg-gray-50">
            Không có dữ liệu bán hàng trong kỳ
          </div>
        ) : (
          <div className="divide-y divide-[#bbcabf]/20">
            {topProducts.map((prod, index) => {
              // Calculate proportion bar scale relative to the highest selling product
              const maxQty = topProducts[0]?.quantity || 1;
              const barPercentage = (prod.quantity / maxQty) * 100;

              return (
                <div key={prod.id} className="py-4.5 flex items-center gap-4 group">
                  {/* Top Rank Badge */}
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[11px] font-extrabold shadow-sm ${
                    index === 0 ? "bg-amber-400 text-amber-950" :
                    index === 1 ? "bg-slate-300 text-slate-800" :
                    index === 2 ? "bg-amber-600/30 text-amber-950" :
                    "bg-[#f4f6fa] text-[#3c4a42]/70"
                  }`}>
                    {index + 1}
                  </div>

                  {/* Product Thumbnail */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#bbcabf]/20 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>

                  {/* Product Details & Volume Scale */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex justify-between items-start gap-3">
                      <h5 className="text-xs font-extrabold text-[#3c4a42] truncate group-hover:text-[#006c49] transition-colors">
                        {prod.name}
                      </h5>
                      <span className="text-xs font-mono font-extrabold text-[#006c49] shrink-0">
                        {formatCurrency(prod.revenue)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Bar indicator */}
                      <div className="flex-1 h-2 bg-[#f4f6fa] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#006c49] rounded-full transition-all duration-500"
                          style={{ width: `${barPercentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#3c4a42]/60 shrink-0 font-mono">
                        Đã bán: {prod.quantity} kg
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
