"use client";

import { useState } from "react";
import {
    Task,
    updateTaskApi,
    deleteTaskApi,
} from "@/services/tasks";
import {
    assignMemberApi,
    getAssigneesApi,
    removeAssigneeApi,
} from "@/services/tasks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import UpdateTaskForm from "./UpdateTaskForm";
import ConfirmModal from "../globals/ConfirmModal";
import { getBoardApi } from "@/services/boards";




interface TaskDetailModalProps {
    task: Task & { boardMembers?: { id: string; name: string }[] };
    onClose: () => void;
    boardId: string;
}

// ----- Main Modal -----
export default function TaskDetailModal({ task, onClose, boardId }: TaskDetailModalProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
    const [showMemberSelect, setShowMemberSelect] = useState(false);

    const boardQuery = useQuery({
        queryKey: ["board", boardId],
        queryFn: () => getBoardApi(boardId),
    });

    if (boardQuery.isLoading) {
        return <div className="text-gray-400 p-4">Loading board...</div>;
    }

    if (!boardQuery.data?.ok) {
        return (
            <div className="text-red-400 p-4">
                {boardQuery.data?.message || "Error loading board"}
            </div>
        );
    }

    const board = boardQuery.data.data;

    const { data: assignees = [], refetch } = useQuery({
        queryKey: ["assignees", task.id],
        queryFn: () => getAssigneesApi(task.boardId, task.cardId, task.id),
    });

    const updateMutation = useMutation({
        mutationFn: (payload: { title?: string; description?: string; status?: string }) =>
            updateTaskApi(task.boardId, task.cardId, task.id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", task.boardId] });
            setShowUpdateConfirm(false);
            onClose();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteTaskApi(task.boardId, task.cardId, task.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", task.boardId, task.cardId] });
            setShowDeleteConfirm(false);
            onClose();
        },
    });

    const assignMutation = useMutation({
        mutationFn: (memberId: string) => assignMemberApi(task.boardId, task.cardId, task.id, memberId),
        onSuccess: () => refetch(),
    });

    const removeMutation = useMutation({
        mutationFn: (memberId: string) => removeAssigneeApi(task.boardId, task.cardId, task.id, memberId),
        onSuccess: () => refetch(),
    });

    // lọc member chưa assign
    const assignedIds = assignees.map((a: any) => a.memberId);
    const unassigned = (board.members || []).filter((m: string) => !assignedIds.includes(m));

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />

                <div className="relative bg-gray-900 rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] p-6 z-50 text-white overflow-y-auto">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-white z-[60] cursor-pointer"
                    >
                        ✕
                    </button>

                    <h2 className="text-2xl font-semibold">{task.title}</h2>
                    <p className="text-sm text-gray-400">in list {task.status}</p>

                    <div className="grid grid-cols-3 gap-6 mt-6">
                        <div className="col-span-2 space-y-6">
                            {/* Members */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Members</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {assignees.map((a: any) => (
                                        <div
                                            key={a.memberId}
                                            className="relative group w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold cursor-pointer"
                                            onClick={() => removeMutation.mutate(a.memberId)}
                                        >
                                            {a.memberId.slice(0, 2).toUpperCase()}
                                            <span className="absolute hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded -top-8 left-1/2 -translate-x-1/2">
                                                Remove
                                            </span>
                                        </div>
                                    ))}
                                    <button
                                        className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-lg"
                                        onClick={() => setShowMemberSelect(true)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Description</h3>
                                <textarea
                                    placeholder="Add a more detailed description"
                                    defaultValue={task.description}
                                    className="w-full bg-gray-800 rounded p-2 text-sm text-white min-h-[100px]"
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold mb-2">Add to card</h3>
                                <button
                                    className="w-full text-left px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-sm"
                                    onClick={() => setShowMemberSelect(true)}
                                >
                                    Members
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            disabled={updateMutation.isPending}
                            onClick={() => setShowUpdateConfirm(true)}
                            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm disabled:opacity-50"
                        >
                            Update Task
                        </button>
                        <button
                            disabled={deleteMutation.isPending}
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-sm disabled:opacity-50"
                        >
                            Delete Task
                        </button>
                    </div>
                </div>
            </div>

            {/* Select Member Modal */}
            {showMemberSelect && (
                <div className="fixed inset-0 flex items-center justify-center z-[999]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowMemberSelect(false)} />
                    <div className="relative bg-gray-900 rounded-lg p-6 w-full max-w-sm">
                        <h3 className="text-white font-semibold mb-3">Assign Member</h3>
                        <ul className="space-y-2">
                            {unassigned.map((email: string) => (
                                <li key={email}>
                                    <button
                                        onClick={() => assignMutation.mutate(email)}
                                        className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-gray-700 text-white"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                            {email.slice(0, 2).toUpperCase()}
                                        </div>
                                        <span>{email}</span>
                                    </button>
                                </li>
                            ))}
                            {unassigned.length === 0 && (
                                <p className="text-sm text-gray-400">All members already assigned</p>
                            )}
                        </ul>
                    </div>
                </div>
            )}

            {/* Delete confirm */}
            {showDeleteConfirm && (
                <ConfirmModal
                    title="Delete Task"
                    message="Are you sure you want to delete this task? This action cannot be undone."
                    confirmLabel="Delete"
                    confirmColor="bg-red-600 hover:bg-red-500"
                    onConfirm={() => deleteMutation.mutate()}
                    onCancel={() => setShowDeleteConfirm(false)}
                />
            )}

            {/* Update form */}
            {showUpdateConfirm && (
                <UpdateTaskForm
                    initialValues={{
                        title: task.title,
                        description: task.description,
                        status: task.status,
                    }}
                    isLoading={updateMutation.isPending}
                    onSubmit={(payload) => updateMutation.mutate(payload)}
                    onCancel={() => setShowUpdateConfirm(false)}
                />
            )}
        </>
    );
}
