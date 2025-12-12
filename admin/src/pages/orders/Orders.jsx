import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from "../../config";
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import notificationSound from "../../assets/notification.mp3";
import { io } from "socket.io-client";


const dummyOrders = [
  {
    _id: "order1",
    items: [
      { name: "Product A", quantity: 2, size: "M" },
      { name: "Product B", quantity: 1, size: "L" },
    ],
    address: {
      firstName: "John",
      lastName: "Doe",
      street: "123 Main St",
      city: "Metropolis",
      state: "NY",
      country: "USA",
      zipcode: "10001",
      phone: "123-456-7890",
    },
    paymentMethod: "Credit Card",
    payment: "Paid",
    date: "2024-10-01T10:00:00Z",
    amount: 150.0,
    status: "Order Placed",
  },
  // Add more dummy orders as needed
];

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);

  // Play notification sound
  const playNotificationSound = () => {
    const audio = new Audio(notificationSound);
    audio.play();
  };

  // Fetch all orders from API
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

        // Emit socket event to notify other admins
        socket?.emit("update_status", { orderId, status: newStatus });

        // Update local orders
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

    // Initialize socket
    const newSocket = io(backendUrl, { transports: ["websocket"] });
    setSocket(newSocket);

    // Join admin room
    newSocket.emit("admin_join");

    // Listen for new orders
    newSocket.on("new_order_alert", (order) => {
      playNotificationSound();
      toast.info("🔔 New Order Arrived!");
      setOrders(prev => [order, ...prev]);
    });

    // Listen for order status updates from other admins
    newSocket.on("admin_status_update", ({ orderId, status }) => {
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status } : order
        )
      );
    });

    // Fetch orders initially
    fetchAllOrders();

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  return (
    <div className="p-4">
      <h3 className="mb-4 text-xl font-bold">Orders timeline</h3>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid items-start grid-cols-1 gap-3 p-4 bg-white border border-gray-300 shadow-sm sm:grid-cols-4"
          >
            <img className="w-12" src={assets.parcel_icon} alt="Parcel Icon" />
            <div>
              {order.items.map((item, idx) => (
                <p key={idx} className="py-0.5">
                  {item.name} x {item.quantity} {idx === order.items.length - 1 ? item.size : ','}
                </p>
              ))}
              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName} {order.address.lastName}
              </p>
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p>Items: {order.items.length}</p>
              <p>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p>{currency}{order.amount}</p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
