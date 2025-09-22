"use client";

import { CardTitle } from "@/types/card";
import { useState } from "react";



interface UpdateTaskFormProps {
    initialValues: {
        title?: string;
        description?: string;
        status?: string;
    };
    onSubmit: (payload: {
        title?: string;
        description?: string;
        status?: string;
    }) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function UpdateTaskForm({
    initialValues,
    onSubmit,
    onCancel,
    isLoading,
}: UpdateTaskFormProps) {
    const [form, setForm] = useState({
        title: initialValues.title || "",
        description: initialValues.description || "",
        status: initialValues.status || CardTitle.Icebox,
    });


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[999]">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCancel} />
            <div
                className="relative bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 text-white"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold mb-4">Update Task</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-800 text-sm"
                            placeholder="Enter task title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-800 text-sm min-h-[80px]"
                            placeholder="Enter task description"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full p-2 rounded bg-gray-800 text-sm"
                        >
                            {Object.values(CardTitle).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isLoading}
                        onClick={() => onSubmit(form)}
                        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm disabled:opacity-50"
                    >
                        {isLoading ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
}
