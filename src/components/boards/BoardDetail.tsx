"use client";

import { useQuery } from "@tanstack/react-query";
import { getBoardApi } from "@/services/boards";
import CardList from "../cards/CardList";
import { useRouter } from "next/navigation";
import { useState } from "react";
import InviteMemberModal from "./InviteMemberModal";
import { Menu, X } from "lucide-react";




interface BoardDetailProps {
    id: string;
}

export default function BoardDetail({ id }: BoardDetailProps) {
    const [showInvite, setShowInvite] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const router = useRouter();

    const boardQuery = useQuery({
        queryKey: ["board", id],
        queryFn: () => getBoardApi(id),
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

    return (
        <div className="flex h-screen relative">
            <aside className="hidden md:flex w-64 bg-gray-900 text-gray-200 flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h2
                        onClick={() => router.push("/boards")}
                        className="font-bold text-lg cursor-pointer"
                    >
                        Your Boards
                    </h2>
                    <h2 className="font-bold text-lg mt-2 text-gray-500">
                        {board.name}
                    </h2>

                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <p className="text-sm text-gray-400">Members</p>
                    {board.members?.map((m: string) => (
                        <div key={m} className="flex items-center gap-2 text-sm">
                            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                                {m[0].toUpperCase()}
                            </div>
                            {m}
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">
                        You can’t find and reopen closed boards if close the board
                    </p>
                    <button onClick={() => router.push("/boards")} className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-sm font-semibold">
                        Close
                    </button>
                </div>
            </aside>

            {showSidebar && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="w-64 bg-gray-900 text-gray-200 flex flex-col h-full">
                        <div className="flex justify-between items-center p-4 border-b border-gray-700">
                            <h2 className="font-bold text-lg">Your Boards</h2>
                            <button
                                onClick={() => setShowSidebar(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4">
                            <h2 className="font-bold text-lg text-gray-500">{board.name}</h2>
                            <p className="text-sm text-gray-400">Members</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {board.members?.map((m: string) => (
                                <div key={m} className="flex items-center gap-2 text-sm">
                                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                                        {m[0].toUpperCase()}
                                    </div>
                                    {m}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div
                        className="flex-1 bg-black/30"
                        onClick={() => setShowSidebar(false)}
                    />
                </div>
            )}

            <div className="flex-1 flex flex-col">
                <header className="flex justify-between items-center bg-purple-900 text-white p-4">
                    <div className="flex items-center gap-2">
                        <button
                            className="md:hidden"
                            onClick={() => setShowSidebar(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="font-bold text-xl">{board.name}</h1>
                    </div>
                    <button
                        onClick={() => setShowInvite(true)}
                        className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                    >
                        Invite member
                    </button>
                </header>

                <CardList boardId={id} />
            </div>

            {showInvite && (
                <InviteMemberModal
                    boardId={id}
                    onClose={() => setShowInvite(false)}
                />
            )}
        </div>
    );
}
