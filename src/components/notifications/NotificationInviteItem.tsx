"use client";

import { Notification } from "@/services/notifications";
import { acceptInviteApi, denyInviteApi } from "@/services/boards";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface NotificationInviteItemProps {
    notification: Notification;
}

export default function NotificationInviteItem({ notification }: NotificationInviteItemProps) {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const queryClient = useQueryClient();
    const router = useRouter();

    const [localNotif, setLocalNotif] = useState(notification);

    const updateLocalNotification = (status: "accepted" | "denied") => {
        const updated = { ...localNotif, read: true, status };
        setLocalNotif(updated);

        queryClient.setQueryData<Notification[]>(["notifications"], (old) => {
            if (!old) return old;
            return old.map((n) => (n.id === notification.id ? updated : n));
        });
    };

    const acceptMutation = useMutation({
        mutationFn: () => {
            if (!currentUser?.email || !localNotif.boardId) {
                return Promise.reject(new Error("Missing user or board info"));
            }
            return acceptInviteApi(localNotif.boardId, localNotif.inviteId!, localNotif.id);
        },
        onSuccess: (res) => {
            if (res.ok) {
                updateLocalNotification("accepted");
                queryClient.invalidateQueries({ queryKey: ["boards"] });
            }
        },
    });

    const denyMutation = useMutation({
        mutationFn: () => {
            if (!currentUser?.email || !localNotif.boardId) {
                return Promise.reject(new Error("Missing user or board info"));
            }
            return denyInviteApi(localNotif.boardId, localNotif.inviteId!, localNotif.id);
        },
        onSuccess: (res) => {
            if (res.ok) {
                updateLocalNotification("denied");
            }
        },
    });

    return (
        <li className="p-3 bg-gray-700 rounded">
            <p className="text-sm">
                {localNotif.message} from <b>{localNotif.fromUser}</b>
            </p>

            {!localNotif.read ? (
                <div className="flex gap-2 mt-2">
                    <button
                        disabled={acceptMutation.isPending}
                        onClick={() => acceptMutation.mutate()}
                        className="px-2 py-1 text-xs bg-green-600 hover:bg-green-500 rounded disabled:opacity-50"
                    >
                        {acceptMutation.isPending ? "Processing..." : "Accept"}
                    </button>
                    <button
                        disabled={denyMutation.isPending}
                        onClick={() => denyMutation.mutate()}
                        className="px-2 py-1 text-xs bg-red-600 hover:bg-red-500 rounded disabled:opacity-50"
                    >
                        {denyMutation.isPending ? "Processing..." : "Deny"}
                    </button>
                </div>
            ) : (
                <p className="mt-2 text-xs text-gray-300">
                    Status:{" "}
                    {localNotif.status === "accepted" ? (
                        <span
                            onClick={() => router.push(`/boards/${localNotif.boardId}`)}
                            className="cursor-pointer text-green-400 underline hover:text-green-300"
                        >
                            accepted → Go to board
                        </span>
                    ) : (
                        <span className="text-red-400">{localNotif.status}</span>
                    )}
                </p>
            )}
        </li>
    );
}
