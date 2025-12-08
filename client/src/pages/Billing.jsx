import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FiPackage,
  FiTrash,
  FiSearch,
  FiPrinter,
  FiUser,
  FiMail,
  FiDollarSign,
  FiShoppingCart,
  FiX,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { addToCart, generateInvoice } from "../app/slices/billingSlice";
import { fetchMartByOwner } from "../app/slices/martSlice";
import axios from "axios";
import { Input } from "../components/ui/Input";
import Button from "../components/ui/Button";

const Billing = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const mart = useSelector((state) => state.mart.mart);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerEmail, setCustomerEmail] = useState("");
  const [cashierName, setCashierName] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const printRef = useRef();
  const searchInputRef = useRef();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMartByOwner(user.id));
      if (user.profile?.firstName && user.profile?.lastName) {
        setCashierName(`${user.profile.firstName} ${user.profile.lastName}`);
      } else {
        setCashierName(user.name || "");
      }
    }
  }, [user, dispatch]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.trim()) {
        try {
          const res = await axios.get(
            `https://smartmart-qno0.onrender.com/api/v1/products/search?q=${search.trim()}`
          );
          setResults(res.data);
        } catch (error) {
          toast.error("Error fetching products");
        }
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  const addToCartHandler = (product) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    searchInputRef.current.focus();
  };

  const clearSearchResults = () => {
    setResults([]);
    setSearch("");
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty < 1) return;
    setCart(
      cart.map((item) =>
        item._id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = +(total * 0.18).toFixed(2);
  const grandTotal = +(total + gst).toFixed(2);

  const printBill = () => {
    setIsPrinting(true);
    const printWindow = window.open("", "_blank", "width=600,height=800");
    const content = printRef.current.innerHTML;
    const styles = `
      <style>
        body { font-family: 'Courier New', monospace; padding: 15px; }
        .logo { width: 80px; margin: auto; display: block; }
        h2, h3 { text-align: center; margin: 8px 0; }
        .mart-info { text-align: center; margin-bottom: 10px; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border-bottom: 1px dashed #ccc; padding: 6px; font-size: 13px; text-align: left; }
        .right { text-align: right; }
        .summary { margin-top: 15px; border-top: 2px dashed #000; padding-top: 10px; text-align: right; }
        .footer { margin-top: 20px; text-align: center; font-weight: bold; font-size: 12px; }
        .grand-total { font-weight: bold; font-size: 14px; }
        .invoice-title { border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 10px; }
        .date-time { text-align: right; font-size: 12px; margin-bottom: 10px; }
      </style>
    `;

    const currentDate = new Date().toLocaleString();

    printWindow.document.write(
      `<html><head><title>Bill</title>${styles}</head><body>${content}<div class="date-time">${currentDate}</div></body></html>`
    );
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
      setIsPrinting(false);
    }, 500);
  };

  const handleCheckout = async () => {
    if (!user?.id || !mart?._id) {
      toast.error("User or Mart not found");
      return;
    }
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);
    toast.loading("Generating bill...");
    try {
      await Promise.all(
        cart.map((item) =>
          dispatch(
            addToCart({
              userId: user.id,
              productId: item._id,
              quantity: item.quantity,
            })
          ).unwrap()
        )
      );

      await dispatch(
        generateInvoice({
          userId: user.id,
          martId: mart._id,
          cashierName,
          paymentMode,
          sendEmail: !!customerEmail,
          customerEmail,
        })
      ).unwrap();

      toast.dismiss();
      toast.success("Bill generated successfully!");

      printBill();

      setCart([]);
      setCustomerEmail("");
      clearSearchResults();
    } catch (err) {
      toast.dismiss();
      toast.error(
        err?.message || "Billing failed. Check server or email config."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Section - Products and Search */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <FiPackage /> Billing
            </h2>
            {/* {mart && (
              <span className="bg-blue-900 text-blue-100 px-3 py-1 rounded-full text-sm">
                {mart.name}
              </span>
            )} */}
          </div>

          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name or scan barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 py-2 w-full rounded-lg border border-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-neutral-700"
              autoFocus
            />

            {results.length > 0 && (
              <button
                onClick={clearSearchResults}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                title="Clear search"
              >
                <FiX size={18} />
              </button>
            )}
          </div>

          {results.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-neutral-400">Search Results</h4>
                <span className="text-sm text-neutral-500">
                  {results.length} items
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {results.map((product) => (
                  <div
                    key={product._id}
                    className="border border-neutral-700 p-3 rounded-lg cursor-pointer hover:bg-neutral-800 transition-colors flex flex-col"
                    onClick={() => addToCartHandler(product)}
                  >
                    <div className="font-bold text-white truncate">
                      {product.name}
                    </div>
                    <div className="text-sm mt-1">₹{product.price}</div>
                    {product.stock && (
                      <div className="text-xs text-neutral-400 mt-1">
                        Stock: {product.stock}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Cart and Checkout */}
        <div className="md:w-96">
          <div className="bg-neutral-800 rounded-xl p-4 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiShoppingCart className="text-white" /> Cart ({cart.length})
            </h3>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center bg-neutral-700 p-3 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium truncate">{item.name}</div>
                      <div className="text-sm text-neutral-400">
                        ₹{item.price} each
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={item.quantity}
                        min={1}
                        className="w-16 p-1 border border-neutral-600 rounded bg-neutral-800 text-center"
                        onChange={(e) =>
                          updateQuantity(item._id, +e.target.value)
                        }
                      />
                      <span className="text-sm font-medium w-16 text-right">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-1 rounded-full hover:bg-neutral-600 transition-colors"
                      >
                        <FiTrash className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-lg font-semibold border-b border-neutral-700 pb-2">
                <span>Subtotal:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-400">
                <span>GST (18%):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t border-neutral-700 pt-2">
                <span>Total:</span>
                <span className="text-white">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Cashier name"
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  className="pl-10 p-2 w-full rounded border border-neutral-700 bg-neutral-800 focus:outline-none"
                />
                {user?.profile?.firstName && (
                  <span
                    className="absolute right-3 top-3 text-xs text-neutral-400 cursor-pointer"
                    onClick={() => {
                      if (user.profile?.firstName && user.profile?.lastName) {
                        setCashierName(
                          `${user.profile.firstName} ${user.profile.lastName}`
                        );
                      }
                    }}
                    title="Reset to your name"
                  >
                    Reset
                  </span>
                )}
              </div>

              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-neutral-400" />
                <input
                  type="email"
                  placeholder="Customer email (optional)"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="pl-10 p-2 w-full rounded border border-neutral-700 bg-neutral-800 focus:outline-none"
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
                  ₹
                </span>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="pl-10 p-2 w-full rounded border border-neutral-700 bg-neutral-800 focus:outline-none appearance-none flex items-center"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                </select>
              </div>

              <Button
                className={`flex items-center justify-center gap-2 px-4 py-3 mt-4 w-full rounded-lg font-medium transition-colors ${
                  loading || isPrinting
                    ? "opacity-70 cursor-not-allowed"
                    : "bg-white text-black hover:bg-neutral-200 hover:text-black"
                }`}
                onClick={handleCheckout}
                disabled={loading || isPrinting}
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <FiPrinter />
                    {isPrinting ? "Printing..." : "Generate Bill & Print"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden printable content */}
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          {mart?.logoUrl && (
            <img src={mart.logoUrl} alt="Logo" className="logo" />
          )}
          <h2 className="invoice-title">{mart?.name || "Store"}</h2>
          <div className="mart-info">
            {mart?.address?.street && <p>{mart.address.street}</p>}
            {mart?.address?.city && (
              <p>
                {mart.address.city}, {mart.address.state} -{" "}
                {mart.address.pincode}
              </p>
            )}
            {mart?.address?.contactNo && (
              <p>Contact: {mart.address.contactNo}</p>
            )}
            {mart?.gstNumber && <p>GST: {mart.gstNumber}</p>}
          </div>
          <h3>INVOICE</h3>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="summary">
            <p>Subtotal: ₹{total.toFixed(2)}</p>
            <p>GST (18%): ₹{gst.toFixed(2)}</p>
            <p className="grand-total">Grand Total: ₹{grandTotal.toFixed(2)}</p>
          </div>

          <div className="footer">
            <p>Cashier: {cashierName || "N/A"}</p>
            <p>Payment Mode: {paymentMode.toUpperCase()}</p>
            <p className="mt-4">Thank you for shopping with us!</p>
            <p>Please visit again</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
