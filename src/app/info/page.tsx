"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import Cookies from "js-cookie";

export default function UserInfo() {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const logout = () => {
        // Xóa tất cả cookie
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/");
        });

        // Điều hướng ra ngoài
        window.location.href = "/signin";
    };
    return (
        <div className="p-4">
            {currentUser ? (
                <>
                    <p>Email: {currentUser.email}</p>
                    <p>Token: {currentUser.accessToken}</p>
                </>
            ) : (
                <p>No user logged in</p>
            )}
            <button
                onClick={logout}>Logout</button>
        </div>
    );
}
