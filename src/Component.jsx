import React, { useEffect, useState } from "react";
import { productFind } from "./api/api.js";

export default function Component() {
  let userData = null;
  try {
    userData = JSON.parse(localStorage.getItem("userData"));
  } catch (e) {
    userData = null;
  }

  const responseCode = userData?.response_code;
  if (responseCode !== "100") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-100">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-10 border-l-8 border-indigo-400 max-w-md w-full text-center">
          <h2 className="text-2xl font-extrabold text-indigo-700 mb-4 font-sans">Login Error</h2>
          <p className="text-indigo-500 text-lg font-medium mb-2">There was a problem with your login.</p>
          <p className="text-gray-600">Please check your credentials and try again.</p>
        </div>
      </div>
    );
  }

  const customerId = userData?.customer_ids;
  const customer = userData?.data?.[customerId] || {};

  const name = customer.first_name || customer.customer_name || "Customer";
  const orderList = customer.order_list;
  const orderIds = orderList ? orderList.split(",") : [];
  const totalOrders = customer.order_count || 0;

  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  let nextPaymentDays = "-";
  let nextPaymentDate = "-";
  let nextPaymentAmount = "-";
  if (orderDetails && orderDetails.length > 0) {
    const now = new Date();
    let soonestDate = null;
    let soonestAmount = null;
    orderDetails.forEach(order => {
      if (order && order.products && order.products.length > 0) {
        order.products.forEach(product => {
          if (product.recurring_date && product.recurring_date !== "0000-00-00") {
            const recurDate = new Date(product.recurring_date);
            if (recurDate > now && (!soonestDate || recurDate < soonestDate)) {
              soonestDate = recurDate;
              soonestAmount = product.next_subscription_product_price || product.price || "-";
            }
          }
        });
      }
    });
    if (soonestDate) {
      nextPaymentDate = soonestDate.toLocaleDateString();
      const diffTime = soonestDate - now;
      nextPaymentDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      nextPaymentAmount = soonestAmount;
    }
  }

  useEffect(() => {
    let isMounted = true;
    async function fetchOrderDetails() {
      setLoading(true);
      try {
        const details = await Promise.all(orderIds.map(id => productFind(id)));
        if (isMounted) setOrderDetails(details);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (orderIds.length > 0) fetchOrderDetails();
    else setLoading(false);
    return () => { isMounted = false; };
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-100 to-indigo-100 py-10 px-2 font-sans">
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex flex-col items-center gap-4 bg-white/80 rounded-2xl shadow-xl p-8 border-t-8 border-blue-300">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-1 tracking-tight">Welcome, <span className="text-blue-600">{name}</span>!</h1>
          <p className="text-gray-400 text-base mb-2">Your account summary and recent orders are below.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-100 via-white to-gray-100 rounded-2xl shadow p-6 flex flex-col items-center border-l-4 border-blue-400">
          <div className="text-blue-700 text-xs mb-1 uppercase tracking-wider">Customer ID</div>
          <div className="text-2xl font-bold text-blue-900">{customerId}</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-100 via-white to-blue-100 rounded-2xl shadow p-6 flex flex-col items-center border-l-4 border-indigo-400">
          <div className="text-indigo-700 text-xs mb-1 uppercase tracking-wider">Total Orders</div>
          <div className="text-2xl font-bold text-indigo-900">{totalOrders}</div>
        </div>
        <div className="bg-gradient-to-br from-gray-100 via-white to-blue-100 rounded-2xl shadow p-6 flex flex-col items-center border-l-4 border-gray-400">
          <div className="text-gray-700 text-xs mb-1 uppercase tracking-wider">Next Payment</div>
          <div className="text-lg font-bold text-blue-700 mb-1">{nextPaymentDays} days</div>
          <div className="text-gray-400 text-sm">{nextPaymentDate} - {nextPaymentAmount}</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-8 border-l-8 border-indigo-200">
        <h2 className="text-xl font-extrabold text-blue-700 mb-4">Order History</h2>
        {loading ? (
          <div className="text-center text-indigo-400 py-8">Loading order details...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 via-gray-100 to-indigo-100 text-indigo-700 text-sm">
                  <th className="py-2 px-3 font-semibold rounded-l-lg">#</th>
                  <th className="py-2 px-3 font-semibold">Product</th>
                  <th className="py-2 px-3 font-semibold">Date</th>
                  <th className="py-2 px-3 font-semibold">Price</th>
                  <th className="py-2 px-3 font-semibold rounded-r-lg">Type</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.length > 0 ? orderDetails.map((detail, idx) => {
                  if (!detail || detail.error) {
                    return (
                      <tr key={idx} className="bg-red-50">
                        <td colSpan={5} className="text-red-400 py-4 text-center">Failed to load order</td>
                      </tr>
                    );
                  }
                  const order = detail;
                  return order.products && order.products.length > 0 ? (
                    order.products.map((product, pidx) => (
                      <tr key={pidx} className={((idx + pidx) % 2 === 0 ? "bg-blue-50" : "bg-gray-50") + " hover:bg-indigo-50 rounded-xl shadow-sm transition-all duration-200"}>
                        <td className="py-2 px-3 font-semibold text-blue-700">{idx + 1}.{pidx + 1}</td>
                        <td className="py-2 px-3">
                          <div className="font-medium text-indigo-900">{product.name}</div>
                          <div className="text-xs text-gray-400">Order #{order.order_id}</div>
                        </td>
                        <td className="py-2 px-3 text-indigo-800">{order.acquisition_date?.split(" ")[0] || "-"}</td>
                        <td className="py-2 px-3 text-indigo-800">{product.price || "-"}</td>
                        <td className="py-2 px-3">
                          {product.billing_model?.name === "Monthly Subscription" ? (
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">Monthly Subscription</span>
                          ) : (
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">One Time Purchase</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key={idx}>
                      <td colSpan={5} className="text-center text-indigo-400 py-8">No products found for this order.</td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={5} className="text-center text-indigo-400 py-8">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
