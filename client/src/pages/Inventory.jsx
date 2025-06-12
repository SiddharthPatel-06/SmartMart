import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select, SelectItem } from "../components/ui/Select";
import Modal from "../components/ui/Modal";
import { FiPackage } from "react-icons/fi";
import { AiOutlineStock } from "react-icons/ai";
import { FcExpired } from "react-icons/fc";
import { TbCategory } from "react-icons/tb";

const API_BASE_URL = "http://localhost:4000";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expiryFilter, setExpiryFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);

  const [summary, setSummary] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    expiringSoon: 0,
  });

  const [showAddModal, setShowAddModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    id: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    reorderLevel: 5,
    expiryDate: "",
    supplier: "",
    barcode: "",
    imageUrl: "",
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

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/products/categories`
      );
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSummary();
    fetchCategories();
  }, []);

  const filtered = Array.isArray(products)
    ? products.filter((p) => {
        const matchesSearch = p.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

        const matchesStatus =
          !statusFilter ||
          (statusFilter === "in" && p.quantity > 0) ||
          (statusFilter === "out" && p.quantity === 0);

        const matchesExpiry =
          !expiryFilter ||
          (expiryFilter === "expiring-soon" &&
            p.expiryDate &&
            new Date(p.expiryDate) <=
              new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

        const matchesCategory =
          !categoryFilter ||
          p.category?.toLowerCase() === categoryFilter.toLowerCase();

        return (
          matchesSearch && matchesStatus && matchesExpiry && matchesCategory
        );
      })
    : [];

  const handleAddProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/products`, {
        ...newProduct,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
        reorderLevel: parseInt(newProduct.reorderLevel),
        expiryDate: newProduct.expiryDate
          ? new Date(newProduct.expiryDate)
          : null,
      });
      setShowAddModal(false);
      setNewProduct({
        name: "",
        id: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        reorderLevel: 5,
        expiryDate: "",
        supplier: "",
        barcode: "",
        imageUrl: "",
      });
      fetchProducts();
      fetchSummary();
    } catch (err) {
      console.error("Failed to add product", err);
      alert("Failed to add product");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
        <FiPackage />
        Inventory
      </h2>
      <p className="text-muted-foreground mb-6">
        Manage and track your product inventory
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 bg-transparent border border-white/10 rounded-xl">
            <div className="flex justify-between mb-1">
              <p className="text-muted-foreground">Total Products</p>
              <div className="bg-white/10 p-2 rounded-xl">
                <FiPackage className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">{summary.total}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              All Inventory Items
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 bg-yellow-800/10 border border-white/10 rounded-xl">
            <div className="flex justify-between mb-1">
              <p className="text-muted-foreground">Low Stock Items</p>
              <div className="bg-white/10 p-2 rounded-xl">
                <AiOutlineStock className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">
              {summary.lowStock}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Needs Reordering
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 bg-red-800/10 border border-white/10 rounded-xl">
            <div className="flex justify-between mb-1">
              <p className="text-muted-foreground">Out Of Stock</p>
              <div className="bg-white/10 p-2 rounded-xl">
                <FiPackage className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">
              {summary.outOfStock}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Currently Unavailable
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 bg-orange-800/10 border border-white/10 rounded-xl">
            <div className="flex justify-between mb-1">
              <p className="text-muted-foreground">Expiring Soon</p>
              <div className="bg-white/10 p-2 rounded-xl">
                <FcExpired className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white">
              {summary.expiringSoon}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Expiring Soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectItem value="">All Stock</SelectItem>
            <SelectItem value="in">In Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
          </Select>

          <Select value={expiryFilter} onValueChange={setExpiryFilter}>
            <SelectItem value="">All Expiry</SelectItem>
            <SelectItem value="expiring-soon">
              Expiring Soon (7 days)
            </SelectItem>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="shrink-0">
          <Button onClick={() => setShowAddModal(true)}>+ Add Product</Button>
        </div>
      </div>

      {/* Product Table */}
      <div className="rounded border overflow-x-auto max-h-[500px]">
        <table className="w-full text-sm table-auto">
          <thead className="bg-muted text-left sticky top-0 z-10 bg-neutral-900">
            <tr>
              <th className="p-2 bg-muted">Image</th>
              <th className="p-2 bg-muted">Product Name</th>
              <th className="p-2 bg-muted">SKU</th>
              <th className="p-2 bg-muted">Category</th>
              <th className="p-2 bg-muted">Price</th>
              <th className="p-2 bg-muted">Expiry</th>
              <th className="p-2 bg-muted">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((item) => (
              <tr key={item._id}>
                <td className="p-2">
                  <img
                    src={item.imageUrl || "/placeholder.png"}
                    alt="product"
                    className="w-10 h-10 rounded object-cover"
                  />
                </td>
                <td className="p-2 font-medium">{item.name}</td>
                <td className="p-2">{item.id}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2">${item.price.toFixed(2)}</td>
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
                  {item.quantity === 0 ? (
                    <span className="text-red-500">Out of Stock</span>
                  ) : (
                    <span className="text-green-500">In Stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)} title="Add New Product">
          <form onSubmit={handleAddProductSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={handleAddProductChange}
              required
            />
            <Input
              name="id"
              placeholder="SKU / Product ID"
              value={newProduct.id}
              onChange={handleAddProductChange}
              required
            />
            <Input
              name="description"
              placeholder="Description"
              value={newProduct.description}
              onChange={handleAddProductChange}
            />
            <Input
              name="category"
              placeholder="Category"
              value={newProduct.category}
              onChange={handleAddProductChange}
              required
            />
            <Input
              name="price"
              placeholder="Price"
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={handleAddProductChange}
              required
            />
            <Input
              name="quantity"
              placeholder="Quantity"
              type="number"
              value={newProduct.quantity}
              onChange={handleAddProductChange}
              required
            />
            <Input
              name="reorderLevel"
              placeholder="Reorder Level"
              type="number"
              value={newProduct.reorderLevel}
              onChange={handleAddProductChange}
            />
            <Input
              name="expiryDate"
              placeholder="Expiry Date"
              type="date"
              value={newProduct.expiryDate}
              onChange={handleAddProductChange}
            />
            <Input
              name="supplier"
              placeholder="Supplier"
              value={newProduct.supplier}
              onChange={handleAddProductChange}
            />
            <Input
              name="barcode"
              placeholder="Barcode"
              value={newProduct.barcode}
              onChange={handleAddProductChange}
            />
            <Input
              name="imageUrl"
              placeholder="Image URL"
              value={newProduct.imageUrl}
              onChange={handleAddProductChange}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setShowAddModal(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button type="submit">Add Product</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
