"use client";

import { useState, useEffect, useRef } from "react";
import { Task } from "@/services/tasks";
import TaskDetailModal from "./TaskDetailModal";
import { useDrag } from "react-dnd";


interface TaskItemProps {
    boardId: string;
    cardId: string;
    task: Task;
}

export default function TaskItem({ boardId, cardId, task }: TaskItemProps) {
    const [open, setOpen] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: "TASK",
        item: { taskId: task.id, fromCardId: cardId },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    dragRef(divRef);


    return (
        <>
            <div
                ref={divRef}
                onClick={() => setOpen(true)}
                className={`bg-gray-700 text-white text-sm p-2 rounded cursor-pointer hover:bg-gray-600 ${isDragging ? "opacity-50" : ""
                    }`}
            >
                <span className="truncate tracking-tight block w-full">
                    {task.title}
                </span>
            </div>

            {open && <TaskDetailModal
                task={task}
                boardId={boardId}
                onClose={() => {
                    setOpen(false);
                }}
            />}
        </>
    );
}
