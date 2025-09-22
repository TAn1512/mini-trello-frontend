import { CardTitle } from "@/types/card";

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

export async function getCardsApi(boardId: string): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/boards/${boardId}/cards`, {
        headers: authHeaders(),
    });

    const data = await res.json();
    if (!res.ok) {
        return { ok: false, message: data.message || "Fetch cards failed" };
    }
    return { ok: true, data };
}

export async function createCardApi(
    boardId: string,
    payload: { title: CardTitle }
): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/boards/${boardId}/cards`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
        return { ok: false, message: data.message || "Create card failed" };
    }
    return { ok: true, data };
}

export async function getCardApi(boardId: string, id: string): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/boards/${boardId}/cards/${id}`, {
        headers: authHeaders(),
    });

    const data = await res.json();
    if (!res.ok) {
        return { ok: false, message: data.message || "Fetch card failed" };
    }
    return { ok: true, data };
}

export async function updateCardApi(
    boardId: string,
    id: string,
    payload: { title?: string }
): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/boards/${boardId}/cards/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
        return { ok: false, message: data.message || "Update card failed" };
    }
    return { ok: true, data };
}

export async function deleteCardApi(boardId: string, id: string): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/boards/${boardId}/cards/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!res.ok) {
        const data = await res.json();
        return { ok: false, message: data.message || "Delete card failed" };
    }
    return { ok: true };
}
