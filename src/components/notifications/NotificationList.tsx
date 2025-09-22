"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
    Notification,
    getNotificationsApi,
} from "@/services/notifications";
import NotificationInviteItem from "./NotificationInviteItem";
import { io, Socket } from "socket.io-client";

export default function NotificationList() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    useEffect(() => {
        if (!currentUser?.email) return;
        getNotificationsApi(currentUser.email).then((res) => {
            if (res.ok && res.data) {
                setNotifications(res.data);
                console.log("📨 Fetched notifications:", res.data);

            }
        });
    }, [currentUser?.email]);

    useEffect(() => {
        if (!currentUser?.email) return;

        const socket: Socket = io(
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
            { transports: ["websocket"] }
        );

        socket.on("connect", () => {
            console.log("✅ Connected:", socket.id);
            socket.emit("register", currentUser.email);
        });

        socket.on("notification", (notification: Notification) => {
            console.log("📩 New notification:", notification);
            setNotifications((prev) => [notification, ...prev]);
        });

        // cleanup
        return () => {
            socket.disconnect();
        };
    }, [currentUser?.email]);

    if (!currentUser) {
        return (
            <p className="text-gray-400 text-sm">
                Please log in to see notifications.
            </p>
        );
    }

    if (notifications.length === 0) {
        return (
            <p className="text-gray-400 text-sm">No Notification yet!!</p>
        );
    }

    return (
        <ul className="space-y-2 overflow-y-auto">
            {notifications.map((n) => {
                if (n.type === "invite") {
                    return <NotificationInviteItem key={n.id} notification={n} />;
                }
                return (
                    <li key={n.id} className="p-3 bg-gray-700 rounded">
                        <p className="text-sm">{n.message}</p>
                    </li>
                );
            })}
        </ul>
    );
}
