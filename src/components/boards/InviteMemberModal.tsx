"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { inviteMemberApi } from "@/services/boards";

interface InviteMemberModalProps {
    boardId: string;
    onClose: () => void;
}

export default function InviteMemberModal({ boardId, onClose }: InviteMemberModalProps) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    const inviteMutation = useMutation({
        mutationFn: (payload: { member_id: string; email_member?: string }) =>
            inviteMemberApi(boardId, payload),
        onSuccess: (res) => {
            if (!res.ok) {
                setError(res.message || "Something went wrong.");
                return;
            }
            setError(null);
            onClose();
        },
        onError: (err: any) => {
            setError(err.message || "Failed to invite member");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        inviteMutation.mutate({ member_id: email, email_member: email });
    };

    return (
        <div className="fixed inset-0 bg-gray-200/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-lg font-bold mb-4">Invite Member</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter member email"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500"
                        required
                    />

                    {error && (
                        <p className="text-red-500 text-sm text-left">{error}</p>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={inviteMutation.isPending}
                            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                        >
                            {inviteMutation.isPending ? "Sending..." : "Send Invite"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
