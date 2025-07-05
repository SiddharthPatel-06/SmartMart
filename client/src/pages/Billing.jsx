import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiPackage, FiTrash } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { addToCart, generateInvoice } from "../app/slices/billingSlice";
import { fetchMartByOwner } from "../app/slices/martSlice";
import axios from "axios";

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

  const printRef = useRef();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMartByOwner(user.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (search.trim()) {
        try {
          const res = await axios.get(
            `http://localhost:4000/api/v1/products/search?q=${search.trim()}`
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
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, qty) => {
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
    const printWindow = window.open("", "_blank", "width=600,height=800");
    const content = printRef.current.innerHTML;
    const styles = `
      <style>
        body { font-family: monospace; padding: 10px; }
        .logo { width: 60px; margin: auto; display: block; }
        h2, h3 { text-align: center; margin: 5px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 4px; font-size: 12px; text-align: left; }
        .right { text-align: right; }
        .summary { margin-top: 10px; text-align: right; }
        .footer { margin-top: 20px; text-align: center; font-weight: bold; }
      </style>
    `;

    printWindow.document.write(
      `<html><head><title>Bill</title>${styles}</head><body>${content}</body></html>`
    );
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleCheckout = async () => {
    if (!user?.id || !mart?._id) {
      toast.error("User or Mart not found");
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
      <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <FiPackage /> Billing
      </h2>

      <input
        type="text"
        placeholder="Search by name or scan barcode..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 w-full rounded border border-neutral-700 focus:outline-none"
      />

      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          {results.map((product) => (
            <div
              key={product._id}
              className="border border-neutral-700 p-3 rounded cursor-pointer hover:bg-muted"
              onClick={() => addToCartHandler(product)}
            >
              <div className="font-bold">{product.name}</div>
              <div className="text-sm">Price: ₹{product.price}</div>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-xl font-semibold mt-6">Cart</h3>
      {cart.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center border-b border-neutral-700 py-2"
        >
          <div className="font-medium">{item.name}</div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={item.quantity}
              min={1}
              className="w-16 p-1 border border-neutral-700 rounded"
              onChange={(e) => updateQuantity(item._id, +e.target.value)}
            />
            <span className="text-sm">₹{item.price * item.quantity}</span>
            <button onClick={() => removeFromCart(item._id)}>
              <FiTrash className="text-red-500" />
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 bg-muted p-4 rounded shadow">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal:</span>
          <span>₹{total}</span>
        </div>
        <div className="flex justify-between">
          <span>GST (18%):</span>
          <span>₹{gst}</span>
        </div>
        <div className="flex justify-between text-xl font-bold">
          <span>Total:</span>
          <span>₹{grandTotal}</span>
        </div>

        <input
          type="email"
          placeholder="Customer email (optional)"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          className="mt-4 p-2 w-full rounded border border-neutral-700 focus:outline-none"
        />

        <button
          className={`bg-white text-black px-4 py-2 mt-4 w-full rounded hover:bg-neutral-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? "Processing..." : "Generate Bill"}
        </button>
      </div>

      {/* Hidden printable content */}
      <div style={{ display: "none" }}>
        <div ref={printRef}>
          <img src={mart?.logoUrl} alt="Logo" className="logo" />
          <h2>{mart?.name}</h2>
          <p>
            {mart?.address?.street}, {mart?.address?.city},{" "}
            {mart?.address?.state} - {mart?.address?.pincode},{" "}
            {mart?.address?.country}
          </p>
          <p>Contact: {mart?.address?.contactNo}</p>
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
                  <td>₹{item.price}</td>
                  <td>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="summary">
            <p>Total: ₹{total}</p>
            <p>GST (18%): ₹{gst}</p>
            <p className="grand-total">Grand Total: ₹{grandTotal}</p>
          </div>

          <div className="footer">
            <p>Cashier: {cashierName || "N/A"}</p>
            <p>Payment Mode: {paymentMode}</p>
            <p>Thank you for shopping with {mart?.name}!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
