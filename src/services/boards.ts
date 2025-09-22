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

export async function createBoardApi(payload: {
    name: string;
    description?: string;
}): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/boards`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
        return { ok: false, message: data.message || "Create board failed" };
    }
    return { ok: true, data };
}

export async function getBoardsApi(): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/boards`, {
        headers: authHeaders(),
    });

    const data = await res.json();
    if (!res.ok) {
        return { ok: false, message: data.message || "Fetch boards failed" };
    }
    return { ok: true, data };
}

export async function getBoardApi(id: string): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/boards/${id}`, {
        headers: authHeaders(),
    });

    const data = await res.json();
    if (!res.ok) {
        return { ok: false, message: data.message || "Fetch board failed" };
    }
    return { ok: true, data };
}

export async function updateBoardApi(
    id: string,
    payload: { name?: string; description?: string }
): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/boards/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
        return { ok: false, message: data.message || "Update board failed" };
    }
    return { ok: true, data };
}

export async function deleteBoardApi(id: string): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/boards/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    if (!res.ok) {
        const data = await res.json();
        return { ok: false, message: data.message || "Delete board failed" };
    }
    return { ok: true };
}

export async function inviteMemberApi(boardId: string, payload: {
    member_id: string;
    email_member?: string;
}): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/boards/${boardId}/invite`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
            invite_id: crypto.randomUUID(),
            board_owner_id: "",
            ...payload,
            status: "pending",
        }),
    });

    const data = await res.json();
    if (!res.ok) {
        return { ok: false, message: data.message || "Invite member failed" };
    }
    return { ok: true, data };
}

export async function respondInviteApi(
    boardId: string,
    payload: { invite_id: string; status: "accepted" | "denied"; notificationId?: string }
): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/boards/${boardId}/respond-invite`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
        return { ok: false, message: data?.message || "Respond invite failed" };
    }
    return { ok: true, data };
}

export async function acceptInviteApi(boardId: string, inviteId: string, notificationId: string): Promise<ApiResponse> {
    return respondInviteApi(boardId, {
        invite_id: inviteId,
        status: "accepted",
        notificationId: notificationId,
    });
}

export async function denyInviteApi(boardId: string, inviteId: string, notificationId: string): Promise<ApiResponse> {
    return respondInviteApi(boardId, {
        invite_id: inviteId,
        status: "denied",
        notificationId: notificationId,

    });
}
