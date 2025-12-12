import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from "../../config";
import { toast } from 'react-toastify';
import notificationSound from "../../assets/notification.mp3";
import { io } from "socket.io-client";
import OrderList from '../../components/orders/OrderList';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);

  // Play notification sound
  const playNotificationSound = () => {
    const audio = new Audio(notificationSound);
    audio.play();
  };

  // Fetch all orders
  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  // Update order status
  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order status updated");
        socket?.emit("update_status", { orderId, status: newStatus });

        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Initialize socket & live updates
  useEffect(() => {
    if (!token) return;

    const newSocket = io(backendUrl, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.emit("admin_join");

    newSocket.on("new_order_alert", (order) => {
      playNotificationSound();
      toast.info("🔔 New Order Arrived!");
      setOrders(prev => [order, ...prev]);
    });

    newSocket.on("admin_status_update", ({ orderId, status }) => {
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    });

    fetchAllOrders();

    return () => {
      newSocket.disconnect();
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
