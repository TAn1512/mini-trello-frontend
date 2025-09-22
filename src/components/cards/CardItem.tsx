"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCardApi, deleteCardApi } from "@/services/cards";
import { Menu, Dialog } from "@headlessui/react";
import TaskList from "../tasks/TaskList";
import { useDrop } from "react-dnd";
import { updateTaskApi } from "@/services/tasks";
import { MoreVertical, Loader2 } from "lucide-react";


interface CardItemProps {
    boardId: string;
    card: {
        id: string;
        title: string;
        createdAt?: string;
    };
}

export default function CardItem({ boardId, card }: CardItemProps) {
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(card.title);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [updatingTask, setUpdatingTask] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);


    const queryClient = useQueryClient();

    const [, dropRef] = useDrop(() => ({
        accept: "TASK",
        drop: async (item: { taskId: string; fromCardId: string }) => {
            if (item.fromCardId !== card.id) {
                try {
                    setUpdatingTask(true);
                    await updateTaskApi(boardId, item.fromCardId, item.taskId, {
                        status: card.title,
                    });
                    await Promise.all([
                        queryClient.invalidateQueries({ queryKey: ["cards", boardId] }),
                        queryClient.invalidateQueries({
                            queryKey: ["tasks", boardId, card.id],
                        }),
                        queryClient.invalidateQueries({
                            queryKey: ["tasks", boardId, item.fromCardId],
                        }),
                    ]);
                } finally {
                    setUpdatingTask(false);
                }
            }
        },
    }));
    dropRef(divRef);

    const updateMutation = useMutation({
        mutationFn: (payload: { title: string }) =>
            updateCardApi(boardId, card.id, payload),
        onSuccess: (res) => {
            if (res.ok) queryClient.invalidateQueries({ queryKey: ["cards", boardId] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteCardApi(boardId, card.id),
        onSuccess: (res) => {
            if (res.ok) queryClient.invalidateQueries({ queryKey: ["cards", boardId] });
        },
    });





    return (
        <div
            ref={divRef}
            className="bg-gray-900 rounded-lg p-3 shadow w-64 sm:w-72 lg:w-64 flex-shrink-0">

            {updatingTask && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg z-10">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                    <span className="ml-2 text-sm text-white">Updating...</span>
                </div>
            )}

            {/* Header */}
            {editing ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateMutation.mutate({ title: editTitle });
                        setEditing(false);
                    }}
                    className="flex flex-col gap-2"
                >
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="rounded bg-gray-700 p-2 text-sm text-white w-full"
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 bg-green-600 hover:bg-green-700 rounded py-1 text-sm"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 rounded py-1 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-white truncate">{card.title}</h3>
                    <Menu as="div" className="relative inline-block text-left">
                        <Menu.Button className="p-1 rounded hover:bg-gray-700">
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                        </Menu.Button>
                        <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-gray-800 border border-gray-700 rounded-md shadow-lg focus:outline-none z-20">
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => setEditing(true)}
                                            className={`${active ? "bg-gray-700" : ""} w-full text-left px-4 py-2 text-sm text-gray-200`}
                                        >
                                            Update
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => setConfirmOpen(true)}
                                            className={`${active ? "bg-gray-700" : ""} w-full text-left px-4 py-2 text-sm text-red-400`}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Menu>
                </div>
            )}

            <div className="mt-3 space-y-2">
                <TaskList boardId={boardId} cardId={card.id} />
            </div>


            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-sm rounded bg-gray-800 p-6 shadow-lg">
                        <Dialog.Title className="text-lg font-semibold text-white">
                            Confirm Delete
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 text-sm text-gray-400">
                            Are you sure you want to delete this card? This action cannot be undone.
                        </Dialog.Description>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteMutation.mutate();
                                    setConfirmOpen(false);
                                }}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
