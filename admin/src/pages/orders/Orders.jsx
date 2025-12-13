import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../config";
import { toast } from "react-toastify";
import notificationSound from "../../assets/notification.mp3";
import { io } from "socket.io-client";
import OrderList from "../../components/orders/OrderList";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const socketRef = useRef(null);

  // Play notification sound (safe)
  const playNotificationSound = () => {
    const audio = new Audio(notificationSound);
    audio.play().catch(() => { });
  };

  // Fetch all orders
  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  // Update order status
  const statusHandler = async (e, orderId) => {
    const status = e.target.value;

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Order status updated");

        socketRef.current?.emit("update_status", {
          orderId,
          status,
        });

        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status } : o
          )
        );
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Socket init
  useEffect(() => {
    if (!token) return;

    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current.emit("admin_join");

    socketRef.current.on("new_order_alert", (order) => {
      playNotificationSound();
      toast.info("🔔 New Order Arrived!");
      setOrders((prev) => [order, ...prev]);
    });

    socketRef.current.on("admin_status_update", ({ orderId, status }) => {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status } : o
        )
      );
    });

    fetchAllOrders();

    return () => {
      socketRef.current.disconnect();
    };
  }, [token]);

  return (
    <div className="p-4">
      <h3 className="mb-4 text-xl font-bold">Orders</h3>
      <OrderList orders={orders} onStatusChange={statusHandler} />
    </div>
  );
};

export default Orders;