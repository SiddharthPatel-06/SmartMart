import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrderAsync } from "../app/slices/orderSlice";
import { getLatestInvoice } from "../app/slices/billingSlice";
import { fetchMartByOwner } from "../app/slices/martSlice";
import { toast } from "react-hot-toast";
import { Input } from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  FiPackage,
  FiPhone,
  FiMapPin,
  FiShoppingCart,
  FiLoader,
  FiPlus,
  FiUser,
  FiCreditCard,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";
import moment from "moment";

const CreateOrder = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mart } = useSelector((state) => state.mart);
  const { latestInvoice } = useSelector((state) => state.billing);
  const { loading } = useSelector((state) => state.order);

  const [form, setForm] = useState({
    phone: "",
    customerAddressText: "",
    items: [],
  });

  useEffect(() => {
    if (!user?.id) return;

    dispatch(fetchMartByOwner(user.id))
      .unwrap()
      .then(() => {
        dispatch(getLatestInvoice(user.id));
      })
      .catch((err) => {
        toast.error("Mart fetch failed");
        console.error("Mart error:", err);
      });
  }, [user, dispatch]);

  useEffect(() => {
    if (!latestInvoice?.items?.length) return;

    const mappedItems = latestInvoice.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      name: item.productName,
    }));

    setForm((prev) => ({ ...prev, items: mappedItems }));
  }, [latestInvoice]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.phone.trim() || !form.customerAddressText.trim()) {
      toast.error("Phone and address are required");
      return;
    }

    if (!form.items.length) {
      toast.error("Invoice is empty");
      return;
    }

    const broken = form.items.find((i) => !i.productId);
    if (broken) {
      toast.error("Missing productId in item");
      console.log("Broken item:", broken);
      return;
    }

    const payload = {
      phone: form.phone,
      customerAddressText: form.customerAddressText,
      martId: mart?._id,
      items: form.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
      })),
    };

    dispatch(createOrderAsync(payload))
      .unwrap()
      .then(() => {
        toast.success("Order created successfully!");
        setForm({
          phone: "",
          customerAddressText: "",
          items: [],
        });
      })
      .catch((err) => {
        toast.error("Order creation failed");
        console.error("Order error:", err);
      });
  };

  const calculateTotal = () => {
    return form.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-neutral-800 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <FiPackage className="text-2xl" />
        <h2 className="text-2xl font-bold text-white">Create New Order</h2>
      </div>

      {latestInvoice && (
        <div className="mb-6 bg-neutral-700/50 rounded-lg p-4 border border-neutral-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center gap-2 text-blue-300">
              <FiFileText /> Invoice Details
            </h3>
            <span className="text-xs bg-neutral-600 px-2 py-1 rounded">
              #{latestInvoice._id.slice(-6).toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FiUser className="text-neutral-400" />
              <span>Cashier: {latestInvoice.cashierName || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCreditCard className="text-neutral-400" />
              <span>Payment: {latestInvoice.paymentMode.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-neutral-400" />
              <span>
                Date:{" "}
                {moment(latestInvoice.createdAt).format("DD MMM YYYY, hh:mm A")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">GST (18%):</span>
              <span>₹{latestInvoice.gstAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-700 flex justify-between items-center">
            <span className="font-bold">Grand Total:</span>
            <span className="font-bold text-lg text-white">
              ₹{latestInvoice.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <FiPhone className="absolute left-3 top-3 text-neutral-400" />
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Customer Phone Number"
              required
              className="w-full pl-10"
            />
          </div>

          <div className="relative">
            <FiMapPin className="absolute left-3 top-3 text-neutral-400" />
            <Input
              name="customerAddressText"
              value={form.customerAddressText}
              onChange={handleChange}
              placeholder="Full Delivery Address"
              required
              className="w-full pl-10"
            />
          </div>
        </div>

        {mart && (
          <div className="bg-blue-900/20 text-blue-300 px-4 py-2 rounded-lg text-sm">
            Order will be assigned to:{" "}
            <span className="font-medium">{mart.name}</span>
          </div>
        )}

        <div className="border border-neutral-700 rounded-lg overflow-hidden">
          <div className="bg-neutral-700 px-4 py-3 flex items-center justify-between">
            <h3 className="font-medium flex items-center gap-2">
              <FiShoppingCart /> Order Items ({form.items.length})
            </h3>
          </div>

          {form.items.length > 0 ? (
            <div className="divide-y divide-neutral-700">
              {form.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-4 hover:bg-neutral-700/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-neutral-400">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center p-4 bg-neutral-700/30">
                <p className="font-bold">Subtotal</p>
                <p className="font-bold">₹{calculateTotal().toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-400">
              No items in this order yet
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !mart?._id}
          className={`w-full flex items-center justify-center gap-2 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FiPlus />
              Create Order
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateOrder;
