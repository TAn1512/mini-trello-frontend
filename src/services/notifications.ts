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

export interface Notification {
    id: string;
    userId: string;
    type: "invite" | "task_update" | "comment";
    message: string;
    boardId?: string;
    fromUser?: string;
    read: boolean;
    createdAt: string;
    inviteId?: string;
    status?: "pending" | "accepted" | "denied";
}

export async function getNotificationsApi(userId: string): Promise<ApiResponse<Notification[]>> {
    const res = await fetch(`${API_URL}/users/${userId}/notifications`, {
        headers: authHeaders(),
    });
    const data = await res.json();

    if (!res.ok) {
        return { ok: false, message: data.message || "Fetch notifications failed" };
    }
    return { ok: true, data };
}

export async function createNotificationApi(
    userId: string,
    payload: { type: string; message: string; boardId?: string; fromUser?: string }
): Promise<ApiResponse<Notification>> {
    const res = await fetch(`${API_URL}/users/${userId}/notifications`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
        return { ok: false, message: data.message || "Create notification failed" };
    }
    return { ok: true, data };
}
