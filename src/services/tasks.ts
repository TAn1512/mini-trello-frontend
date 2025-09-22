const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface ApiResponse<T = any> {
    ok: boolean;
    message?: string;
    data?: T;
}

function getAccessToken(): string | null {
    const match = document.cookie.match(/(?:^|;\s*)user=([^;]*)/);
    if (!match) return null;

    try {
        const user = JSON.parse(decodeURIComponent(match[1]));
        return user.accessToken || null;
    } catch {
        return null;
    }
}

function authHeaders() {
    const token = getAccessToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export interface Task {
    id: string;
    boardId: string;
    cardId: string;
    title: string;
    description?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export async function getTasksApi(boardId: string, cardId: string): Promise<ApiResponse<Task[]>> {
    const res = await fetch(`${API_URL}/boards/${boardId}/cards/${cardId}/tasks`, {
        headers: authHeaders(),
    });

    const data = await res.json();
    if (!res.ok) {
        return { ok: false, message: data.message || "Fetch tasks failed" };
    }
    return { ok: true, data };
}

export async function createTaskApi(
    boardId: string,
    cardId: string,
    payload: { title: string; description?: string; status?: string }
): Promise<ApiResponse<Task>> {
    const res = await fetch(`${API_URL}/boards/${boardId}/cards/${cardId}/tasks`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
        return { ok: false, message: data.message || "Create task failed" };
    }
    return { ok: true, data };
}

export async function updateTaskApi(
    boardId: string,
    cardId: string,
    id: string,
    payload: { title?: string; description?: string; status?: string }
): Promise<ApiResponse<Task>> {
    const res = await fetch(`${API_URL}/boards/${boardId}/cards/${cardId}/tasks/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
        return { ok: false, message: data.message || "Update task failed" };
    }
    return { ok: true, data };
}

export async function deleteTaskApi(boardId: string, cardId: string, id: string): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/boards/${boardId}/cards/${cardId}/tasks/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!res.ok) {
        const data = await res.json();
        return { ok: false, message: data.message || "Delete task failed" };
    }
    return { ok: true };
}

export async function assignMemberApi(
    boardId: string,
    cardId: string,
    taskId: string,
    memberId: string
) {
    const res = await fetch(`${API_URL}/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ memberId }),
    });
    if (!res.ok) throw new Error("Failed to assign member");
    return res.json();
}

export async function getAssigneesApi(
    boardId: string,
    cardId: string,
    taskId: string
) {
    const res = await fetch(`${API_URL}/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`, {
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to get assignees");
    return res.json();
}

export async function removeAssigneeApi(
    boardId: string,
    cardId: string,
    taskId: string,
    memberId: string
) {
    const res = await fetch(`${API_URL}/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign/${memberId}`, {
        method: "DELETE",
        headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Failed to remove assignee");
    return true;
}