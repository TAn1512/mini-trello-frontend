"use client";

import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { setUser } from "@/store/userSlice";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function HydrateUser() {
    useEffect(() => {
        const cookieUser = Cookies.get("user");
        if (cookieUser) {
            try {
                const user = JSON.parse(cookieUser);
                if (user?.email && user?.accessToken) {
                    store.dispatch(setUser(user));
                }
            } catch (err) {
                console.error("Invalid user cookie", err);
            }
        }
    }, []);

    return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProvider store={store}>
            <QueryClientProvider client={queryClient}>
                <DndProvider backend={HTML5Backend}>

                    <HydrateUser />
                    {children}
                </DndProvider>
            </QueryClientProvider>
        </ReduxProvider>
    );
}
