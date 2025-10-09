"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { queryClient } from "@/lib/queryClient";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function useTaskRealtime(boardId: string, cardId: string) {
    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on("connect", () => {
            // console.log("Connected to socket:", socket.id);
        });

        socket.on("taskUpdated", (task) => {
            if (task.boardId === boardId) {
                queryClient.invalidateQueries({
                    queryKey: ["tasks", boardId, cardId],
                });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [boardId, cardId]);
}
