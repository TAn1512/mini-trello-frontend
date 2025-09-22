"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBoardsApi, deleteBoardApi, updateBoardApi } from "@/services/boards";
import { Menu, Dialog } from "@headlessui/react";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";


export default function BoardList() {
    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["boards"],
        queryFn: getBoardsApi,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteBoardApi(id),
        onSuccess: (res, id) => {
            if (res.ok) {
                queryClient.setQueryData(["boards"], (old: any) => {
                    if (!old?.ok) return old;
                    return { ...old, data: old.data.filter((b: any) => b.id !== id) };
                });
            }
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, board }: { id: string; board: any }) =>
            updateBoardApi(id, board),
        onSuccess: (res) => {
            if (res.ok) {
                queryClient.invalidateQueries({ queryKey: ["boards"] });
            }
        },
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDesc, setEditDesc] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const router = useRouter();

    if (isLoading) return <p>Loading boards...</p>;
    if (isError || !data?.ok) return <p className="text-red-400">Failed to load boards</p>;

    const boards = [...data.data].sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return (
        <>
            {boards.map((board: any) => (
                <div
                    key={board.id}
                    onClick={() => router.push(`/boards/${board.id}`)}
                    className="p-4 bg-white text-gray-900 rounded-lg shadow hover:shadow-lg transition flex flex-col relative"
                >
                    {editingId === board.id ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                updateMutation.mutate({
                                    id: board.id,
                                    board: { name: editName, description: editDesc },
                                });
                                setEditingId(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col gap-2"
                        >
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="rounded border px-2 py-1"
                            />
                            <input
                                type="text"
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                className="rounded border px-2 py-1"
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    type="submit"
                                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingId(null)}
                                    className="px-3 py-1 rounded bg-gray-300 text-gray-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h3 className="font-semibold truncate">{board.name}</h3>
                            {board.description && (
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                    {board.description}
                                </p>
                            )}

                            <div className="absolute top-2 right-2">
                                <Menu onClick={(e) => e.stopPropagation()} as="div" className="relative inline-block text-left">
                                    <Menu.Button className="p-1 rounded hover:bg-gray-100">
                                        <MoreVertical className="w-5 h-5 text-gray-600" />
                                    </Menu.Button>
                                    <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-20">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingId(board.id);
                                                            setEditName(board.name);
                                                            setEditDesc(board.description || "");
                                                        }}
                                                        className={`${active ? "bg-gray-100" : ""
                                                            } w-full text-left px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        Update
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => {
                                                            setDeleteId(board.id);
                                                            setConfirmOpen(true);
                                                        }}
                                                        className={`${active ? "bg-gray-100" : ""
                                                            } w-full text-left px-4 py-2 text-sm text-red-600`}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Menu>
                            </div>
                        </>
                    )}
                </div>
            ))}

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6 shadow-lg">
                        <Dialog.Title className="text-lg font-semibold text-gray-800">
                            Confirm Delete
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 text-sm text-gray-600">
                            Are you sure you want to delete this board? This action cannot be undone.
                        </Dialog.Description>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (deleteId) {
                                        deleteMutation.mutate(deleteId);
                                    }
                                    setConfirmOpen(false);
                                    setDeleteId(null);
                                }}
                                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
}
