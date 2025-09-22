"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { verifyApi } from "@/services/auth";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import Cookies from "js-cookie";

export default function VerifyForm() {
    const router = useRouter();
    const params = useSearchParams();
    const type = (params.get("type") as "signin" | "signup") || "signup";
    const email = params.get("email") || "";

    const dispatch = useDispatch();

    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: () => verifyApi(type, email, code),
        onSuccess: (res) => {
            if (!res.ok) {
                setError(res.message!);
                return;
            }
            const user = {
                email: res.data.email,
                accessToken: res.data.accessToken,
            };

            Cookies.set("user", JSON.stringify(user), { expires: 1 });
            dispatch(
                setUser(user)
            );
            setError("");
            router.push("/boards");
        },
    });

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Email Verification
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Please enter the code sent to <b>{email}</b>
                </p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setError("");
                        mutation.mutate();
                    }}
                    className="space-y-2"
                >
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter code verification"
                        required
                        className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full rounded bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 mt-2"
                    >
                        {mutation.isPending ? "Verifying..." : "Submit"}
                    </button>
                </form>

                <p className="mt-4 text-xs text-gray-400">
                    This site is protected by reCAPTCHA and the Google Privacy Policy and
                    Terms of Service apply.
                </p>
            </div>
        </div>
    );
}
