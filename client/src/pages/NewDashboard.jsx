import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { fetchAnalytics } from "../app/slices/analyticsSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Button from "../components/ui/Button";
import FilterDropdown from "../components/FilterDropdown";

const COLORS = [
  "#818CF8",
  "#34D399",
  "#FBBF24",
  "#F472B6",
  "#A78BFA",
  "#60A5FA",
  "#2DD4BF",
  "#FCD34D",
];

const StatCard = ({ title, value, change, icon }) => (
  <div className="bg-neutral-950 py-2 px-4 rounded-xl border border-neutral-700 shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-neutral-400 text-sm font-medium">{title}</p>
        <p className="text-xl font-bold text-white mt-1">{value}</p>
        {change && (
          <p
            className={`text-sm mt-1 ${
              change.startsWith("+") ? "text-green-400" : "text-red-400"
            }`}
          >
            {change} from last period
          </p>
        )}
      </div>
      <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-700">{icon}</div>
    </div>
  </div>
);

const ProductTable = ({
  title,
  data,
  colorClass,
  filterType,
  currentFilter,
  onFilterChange,
}) => {
  const rangeOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-700 shadow-lg relative">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-neutral-200">{title}</h3>
        {filterType === "range" ? (
          <FilterDropdown
            type="range"
            options={rangeOptions}
            currentValue={currentFilter.range}
            onFilterChange={onFilterChange}
            label="Time Range"
          />
        ) : (
          <FilterDropdown
            type={filterType}
            currentValue={currentFilter[filterType]}
            onFilterChange={onFilterChange}
            label={title}
            min={1}
            max={20}
          />
        )}
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-neutral-700 last:border-0"
          >
            <div>
              <p className="font-medium text-neutral-300">{item.name}</p>
              <p className="text-xs text-neutral-400">{item.category}</p>
            </div>
            <p className={`font-semibold ${colorClass}`}>
              {item.totalSold} sold
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const NewDashboard = () => {
  const dispatch = useDispatch();
  const { sales, top, least, expiring, loading, error, params } = useSelector(
    (state) => state.analytics
  );

  const handleFilterChange = (type, value) => {
    const newParams = {
      ...params,
      [type]: value,
    };
    dispatch(fetchAnalytics(newParams));
  };

  const handleExport = () => {
    try {
      // Create CSV content
      let csvContent = "Analytics Report\n\n";

      // 1. Add Report Parameters
      csvContent += "Report Parameters\n";
      csvContent += `Time Range,${params.range}\n`;
      csvContent += `Top Products Limit,${params.topLimit}\n`;
      csvContent += `Least Products Limit,${params.leastLimit}\n`;
      csvContent += `Expiring Within,${params.days} days\n\n`;

      // 2. Add Summary Statistics
      csvContent += "Summary Statistics\n";
      csvContent += "Metric,Value\n";
      csvContent += `Total Sales,₹${totalSales.toLocaleString()}\n`;
      csvContent += `Total Transactions,${sales.reduce(
        (sum, item) => sum + item.count,
        0
      )}\n`;
      csvContent += `Top Selling Product,${top[0]?.name || "N/A"}\n`;
      csvContent += `Products Expiring Soon,${expiring.length}\n\n`;

      // 3. Add Sales Data
      csvContent += "Sales Trend\n";
      csvContent += "Date,Total Sales,Number of Transactions\n";
      sales.forEach((item) => {
        csvContent += `${item._id},₹${item.totalSales.toLocaleString()},${
          item.count
        }\n`;
      });
      csvContent += "\n";

      // 4. Add Top Products
      csvContent += "Top Selling Products\n";
      csvContent += "Rank,Product Name,Category,Units Sold\n";
      top.forEach((item, index) => {
        csvContent += `${index + 1},${item.name},${item.category},${
          item.totalSold
        }\n`;
      });
      csvContent += "\n";

      // 5. Add Least Selling Products
      csvContent += "Least Selling Products\n";
      csvContent += "Rank,Product Name,Category,Units Sold\n";
      least.forEach((item, index) => {
        csvContent += `${index + 1},${item.name},${item.category},${
          item.totalSold
        }\n`;
      });
      csvContent += "\n";

      // 6. Add Expiring Products
      csvContent += "Products Expiring Soon (Within ${params.days} days)\n";
      csvContent += "Product Name,Expiry Date,Quantity,Days Remaining\n";
      expiring.forEach((product) => {
        const expiryDate = new Date(product.expiryDate);
        const today = new Date();
        const diffDays = Math.ceil(
          (expiryDate - today) / (1000 * 60 * 60 * 24)
        );

        csvContent += `${product.name},${expiryDate.toLocaleDateString()},${
          product.quantity
        },${diffDays}\n`;
      });

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `analytics-report-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting report:", error);
      alert("Failed to export report. Please try again.");
    }
  };

  useEffect(() => {
    dispatch(fetchAnalytics(params));
  }, [dispatch]);

  const totalSales = sales.reduce((sum, item) => sum + item.totalSales, 0);
  const salesChartData = sales.map((item) => ({
    name: item._id,
    sales: item.totalSales,
  }));
  const topProductsChartData = top.map((item) => ({
    name: item.name,
    value: item.totalSold,
  }));

  if (loading)
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
          <p className="font-bold">Error loading analytics:</p>
          <p>{error}</p>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <Button onClick={handleExport}>Export Report</Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Sales"
            value={`₹${totalSales.toLocaleString()}`}
            change="+12.5%"
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatCard
            title="Transactions"
            value={sales.reduce((sum, item) => sum + item.count, 0)}
            change="+8.2%"
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
          />
          <StatCard
            title="Top Selling Product"
            value={top[0]?.name || "N/A"}
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            }
          />
          <StatCard
            title="Expiring Soon"
            value={expiring.length}
            icon={
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sales Trend */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-700 shadow-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Sales Trend</h3>
              <FilterDropdown
                type="range"
                options={[
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                ]}
                currentValue={params.range}
                onFilterChange={handleFilterChange}
                label="Time Range"
              />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                    }}
                    itemStyle={{ color: "#FFFFFF" }}
                    labelStyle={{ color: "#9CA3AF" }}
                  />
                  <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-700 shadow-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Top Products</h3>
              <FilterDropdown
                type="topLimit"
                currentValue={params.topLimit}
                onFilterChange={handleFilterChange}
                label="Top Products"
                min={1}
                max={20}
              />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {topProductsChartData.map((entry, index) => (
                      <linearGradient
                        key={`gradient-${index}`}
                        id={`gradient-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={COLORS[index % COLORS.length]}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor={COLORS[index % COLORS.length]}
                          stopOpacity={0.3}
                        />
                      </linearGradient>
                    ))}
                  </defs>

                  <Pie
                    data={topProductsChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {topProductsChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#gradient-${index})`}
                        stroke="#1F2937"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    itemStyle={{
                      color: "#FFFFFF",
                      fontSize: "14px",
                      padding: "2px 0",
                    }}
                    formatter={(value, name, props) => [`${value} units`, name]}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "12px",
                    }}
                    formatter={(value, entry, index) => (
                      <span className="text-neutral-300">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Products Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ProductTable
            title="Top Selling Products"
            data={top}
            colorClass="text-neutral-300"
            filterType="topLimit"
            currentFilter={params}
            onFilterChange={handleFilterChange}
          />

          <ProductTable
            title="Least Selling Products"
            data={least}
            colorClass="text-neutral-300"
            filterType="leastLimit"
            currentFilter={params}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Expiring Products */}
        <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-700 shadow-lg relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-neutral-200">
              Products Expiring Soon
            </h3>
            <FilterDropdown
              type="days"
              currentValue={params.days}
              onFilterChange={handleFilterChange}
              label="Expiring Products"
              min={1}
              max={365}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Days Left
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {expiring.map((product, index) => {
                  const expiryDate = new Date(product.expiryDate);
                  const today = new Date();
                  const diffTime = expiryDate - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  return (
                    <tr
                      key={index}
                      className={diffDays <= 7 ? "bg-red-900/20" : ""}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-300">
                        {expiryDate.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-300">
                        {product.quantity}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold">
                        <span
                          className={
                            diffDays <= 7 ? "text-red-600" : "text-red-400"
                          }
                        >
                          {diffDays} {diffDays === 1 ? "day" : "days"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewDashboard;
