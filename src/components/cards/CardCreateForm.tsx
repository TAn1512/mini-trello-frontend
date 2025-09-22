"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCardApi } from "@/services/cards";
import { CardTitle } from "@/types/card";

interface CardCreateFormProps {
    boardId: string;
    availableTitles: CardTitle[];
}

export default function CardCreateForm({ boardId, availableTitles }: CardCreateFormProps) {
    const [open, setOpen] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState<CardTitle | "">("");
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (title: CardTitle) => createCardApi(boardId, { title }),
        onSuccess: (res) => {
            if (res.ok) {
                queryClient.invalidateQueries({ queryKey: ["cards", boardId] });
                setSelectedTitle("");
                setOpen(false);
            }
        },
    });

    if (!availableTitles.length) return null;

    return (
        <div className="w-64 flex-shrink-0">
            {!open ? (
                <button
                    onClick={() => setOpen(true)}
                    className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 text-sm font-semibold py-3"
                >
                    + Add another list
                </button>
            ) : (
                <div className="bg-gray-800 rounded-lg p-3">
                    <select
                        value={selectedTitle}
                        onChange={(e) => setSelectedTitle(e.target.value as CardTitle)}
                        className="w-full rounded bg-gray-700 p-2 mb-2 text-sm text-white"
                    >
                        <option value="">-- Select list --</option>
                        {availableTitles.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                    <div className="flex gap-2">
                        <button
                            className="flex-1 bg-purple-600 hover:bg-purple-700 rounded py-1 text-sm"
                            disabled={!selectedTitle || mutation.isPending}
                            onClick={() => mutation.mutate(selectedTitle as CardTitle)}
                        >
                            Add
                        </button>
                        <button
                            onClick={() => {
                                setOpen(false);
                                setSelectedTitle("");
                            }}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 rounded py-1 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
