// src/hooks/useOrdersSocket.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import notificationSound from "../assets/notification.mp3";
import { addOrderRealtime, updateOrderRealtime, removeOrderRealtime } from "../redux/slices/OrderSlice";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export default function useOrdersSocket(enabled = true, opts = {}) {
    const dispatch = useDispatch();
    const socketRef = useRef(null);

    useEffect(() => {
        if (!enabled) return;
        const socket = io(SOCKET_URL, {
            transports: ["websocket"],
            autoConnect: true,
            ...opts,
        });
        socketRef.current = socket;

        // backend should emit these events: 'newOrder', 'orderUpdated', 'orderDeleted'
        socket.on("connect", () => {
            console.log("Orders socket connected:", socket.id);
        });

        socket.on("newOrder", (order) => {
            dispatch(addOrderRealtime(order));
        });

        socket.on("orderUpdated", (order) => {
            dispatch(updateOrderRealtime(order));
        });

        socket.on("orderDeleted", (id) => {
            dispatch(removeOrderRealtime(id));
        });

        socket.on("disconnect", () => {
            console.log("Orders socket disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, [dispatch, enabled, ...Object.values(opts || {})]);

    return socketRef;
}
