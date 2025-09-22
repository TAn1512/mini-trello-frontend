const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface ApiResponse<T = any> {
    ok: boolean;
    message?: string;
    data?: T;
}

export async function signupApi(email: string): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
        return { ok: false, message: data.message || "Signup failed" };
    }

    return { ok: true, data };
}

export async function signinApi(email: string): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
        return { ok: false, message: data.message || "Signin failed" };
    }

    return { ok: true, data };
}

export async function verifyApi(
    type: "signup" | "signin",
    email: string,
    code: string
): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/auth/${type}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode: code }),
    });

    const data = await res.json();

    if (!res.ok) {
        return { ok: false, message: data.message || "Verification failed" };
    }

    return { ok: true, data };
}

export async function githubLoginApi(code: string): Promise<ApiResponse> {
    const res = await fetch(`${API_URL}/auth/github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (!res.ok) {
        return { ok: false, message: data.message || "GitHub login failed" };
    }

    return { ok: true, data };
}
