import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasksApi, createTaskApi, Task } from "@/services/tasks";
import TaskItem from "./TaskItem";
import { useTaskRealtime } from "@/lib/useTaskRealtime";

interface TaskListProps {
    boardId: string;
    cardId: string;
}

export default function TaskList({ boardId, cardId }: TaskListProps) {
    useTaskRealtime(boardId, cardId);

    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ["tasks", boardId, cardId],
        queryFn: () => getTasksApi(boardId, cardId),
    });

    const createMutation = useMutation({
        mutationFn: (payload: { title: string }) =>
            createTaskApi(boardId, cardId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks", boardId, cardId] });
            setNewTitle("");
            setAdding(false);
        },
    });

    const [adding, setAdding] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    if (isLoading) return <div className="text-gray-400 text-sm">Loading tasks...</div>;
    if (!data?.ok) return <div className="text-red-400 text-sm">{data?.message}</div>;

    return (
        <div className="mt-3 space-y-2">
            {data.data?.map((task: Task) => (
                <div key={task.id} onClick={() => setSelectedTask(task)}>
                    <TaskItem boardId={boardId} cardId={cardId} task={task} />
                </div>
            ))}

            {adding ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (newTitle.trim()) {
                            createMutation.mutate({ title: newTitle });
                        }
                    }}
                    className="flex gap-2"
                >
                    <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Task name"
                        className="flex-1 bg-gray-700 rounded px-2 py-1 text-sm text-white"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded px-3 text-sm">
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={() => setAdding(false)}
                        className="bg-gray-600 hover:bg-gray-700 rounded px-3 z-50 text-sm"
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <button
                    onClick={() => setAdding(true)}
                    className="mt-2 text-sm text-gray-300 hover:text-white text-left w-full"
                >
                    + Add a task
                </button>
            )}


        </div>
    );
}
