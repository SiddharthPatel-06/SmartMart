import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select, SelectItem } from "../components/ui/Select";
import { Plus, Upload, Download, RefreshCw } from "lucide-react";
import { FiPackage } from "react-icons/fi";

// Backend base URL
const API_BASE_URL = "http://localhost:4000";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [summary, setSummary] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    expiringSoon: 0,
  });

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    }
  };

  const fetchSummary = async () => {
    try {
      const [allRes, lowRes, outRes, expiringRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/products`),
        axios.get(`${API_BASE_URL}/api/products/low-stock`),
        axios.get(`${API_BASE_URL}/api/products?stock=0`),
        axios.get(`${API_BASE_URL}/api/products/expiring-soon`),
      ]);
      const all = Array.isArray(allRes.data) ? allRes.data : [];
      setSummary({
        total: all.length,
        lowStock: Array.isArray(lowRes.data) ? lowRes.data.length : 0,
        outOfStock: Array.isArray(outRes.data) ? outRes.data.length : 0,
        expiringSoon: Array.isArray(expiringRes.data)
          ? expiringRes.data.length
          : 0,
      });
    } catch (err) {
      console.error("Failed to fetch summary:", err);
      setSummary({ total: 0, lowStock: 0, outOfStock: 0, expiringSoon: 0 });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSummary();
  }, []);

  const filtered = Array.isArray(products)
    ? products.filter(
        (p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) &&
          (!statusFilter ||
            (statusFilter === "in" && p.stock > 0) ||
            (statusFilter === "out" && p.stock === 0))
      )
    : [];

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
        <FiPackage />
        Inventory
      </h2>
      <p className="text-muted-foreground mb-6">
        Manage and track your product inventory
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 bg-transparent border border-white/10 rounded-xl">
  <div className="flex  justify-between mb-1">
    <p className="text-muted-foreground ">Total Products</p>
    <div className="bg-white/10 p-2 rounded-xl">
      <FiPackage className="w-4 h-4 text-muted-foreground" />
    </div>
  </div>

  <h3 className="text-2xl font-bold text-white">{summary.total}</h3>
  <p className="text-xs text-muted-foreground mt-1">All Inventory Items</p>
</CardContent>

        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Low Stock Items</p>
            <h3 className="text-xl font-bold">{summary.lowStock}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Out of Stock</p>
            <h3 className="text-xl font-bold">{summary.outOfStock}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Expiring Soon</p>
            <h3 className="text-xl font-bold">{summary.expiringSoon}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectItem value="">All</SelectItem>
          <SelectItem value="in">In Stock</SelectItem>
          <SelectItem value="out">Out of Stock</SelectItem>
        </Select>
        <Button
          variant="outline"
          onClick={() => {
            fetchProducts();
            fetchSummary();
          }}
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" /> Import
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Product Table */}
      <div className="rounded border overflow-x-auto mmax-h-[500px]">
        <table className="w-full text-sm table-auto">
          <thead className="bg-muted text-left sticky top-0 z-10">
            <tr>
              <th className="p-2 bg-muted">Image</th>
              <th className="p-2 bg-muted">Product Name</th>
              <th className="p-2 bg-muted">SKU</th>
              <th className="p-2 bg-muted">Category</th>
              <th className="p-2 bg-muted">Price</th>
              <th className="p-2 bg-muted">Expiry</th>
              <th className="p-2 bg-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((item) => (
              <tr key={item._id}>
                <td className="p-2">
                  <img
                    src={item.image || "/placeholder.png"}
                    alt="product"
                    className="w-10 h-10 rounded object-cover"
                  />
                </td>
                <td className="p-2 font-medium">{item.name}</td>
                <td className="p-2">{item.id}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">${item.price}</td>
                <td className="p-2">
                  {item.expiryDate ? (
                    <span className="text-sm">
                      {new Date(item.expiryDate).toLocaleDateString()}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2">
                  {item.stock === 0 ? (
                    <span className="text-red-500">Out of Stock</span>
                  ) : (
                    <span className="text-green-500">In Stock</span>
                  )}
                </td>
                <td className="p-2 text-gray-500 text-sm">...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
