"use client";

import { useState } from "react";
import NotificationList from "@/components/notifications/NotificationList";
import BoardList from "@/components/boards/BoardList";
import BoardCreateForm from "@/components/boards/BoardCreateForm";

export default function Menu() {
    const [activeTab, setActiveTab] = useState<"boards" | "notifications">("boards");

    return (
        <div className="flex min-h-screen flex-col bg-gray-900 text-white md:flex-row">
            {/* Sidebar */}
            <div className="w-full bg-gray-800 p-4 md:w-60">
                <h2 className="text-lg font-bold mb-4">Menu</h2>
                <ul className="space-y-2">
                    <li
                        className={`p-2 rounded cursor-pointer ${activeTab === "boards" ? "bg-gray-700" : "hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveTab("boards")}
                    >
                        Boards
                    </li>
                    <li
                        className={`p-2 rounded cursor-pointer ${activeTab === "notifications" ? "bg-gray-700" : "hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveTab("notifications")}
                    >
                        Notifications
                    </li>
                </ul>
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
                {activeTab === "boards" && (
                    <>
                        <h1 className="text-2xl font-bold mb-6">Your Workspaces</h1>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <BoardList />
                            <BoardCreateForm />
                        </div>
                    </>
                )}

                {activeTab === "notifications" && (
                    <>
                        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
                        <NotificationList />
                    </>
                )}
            </div>
        </div>
    );
}
