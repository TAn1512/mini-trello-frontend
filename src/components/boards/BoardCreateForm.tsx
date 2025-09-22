"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBoardApi } from "@/services/boards";

export default function BoardCreateForm() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    const payload = { name, description };
    const mutation = useMutation({
        mutationFn: () => createBoardApi(payload),
        onSuccess: (res) => {
            if (!res.ok) {
                setError(res.message || "Failed to create board");
                return;
            }
            setError("");
            setName("");
            setDescription("");
            setOpen(false);

            queryClient.setQueryData(["boards"], (old: any) => {
                if (!old?.ok) return old;
                return {
                    ...old,
                    data: [res.data, ...old.data],
                };
            });
        },
    });

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="flex items-center justify-center p-4 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:bg-gray-800 transition"
            >
                + Create a new board
            </div>

            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 text-gray-900 shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">Create Board</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setError("");
                                mutation.mutate();
                            }}
                            className="space-y-3"
                        >
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Board name"
                                required
                                className="w-full rounded px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description (optional)"
                                className="w-full rounded px-3 py-2 border focus:ring-2 focus:ring-blue-500"
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {mutation.isPending ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
