"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signinApi, signupApi } from "@/services/auth";

interface Props {
    type: "signin" | "signup";
}

export default function AuthForm({ type }: Props) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (email: string) =>
            type === "signin" ? signinApi(email) : signupApi(email),
        onSuccess: (res) => {
            if (!res.ok) {
                setError(res.message || "Something went wrong.");
                return;
            }

            setError(null);
            router.push(
                `/verify?type=${type}&email=${encodeURIComponent(email)}`
            );
        },
    });

    const handleGithubLogin = () => {
        const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!;
        const redirectUri = `${window.location.origin}/github-callback`;
        const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&scope=user:email`;

        window.location.href = githubUrl;
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                    <span className="text-red-600 text-4xl font-bold">MT</span>
                </div>
                <h2 className="text-gray-700 mb-6">
                    {type === "signin" ? "Log in to continue" : "Create your account"}
                </h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        mutation.mutate(email);
                    }}
                    className="space-y-4"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full rounded border px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />

                    {error && (
                        <p className="text-red-500 text-sm text-left">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full rounded bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {mutation.isPending ? "Loading..." : "Continue"}
                    </button>
                </form>

                <div className="my-6 flex items-center">
                    <div className="flex-grow h-px bg-gray-300" />
                    <span className="px-2 text-sm text-gray-400">OR</span>
                    <div className="flex-grow h-px bg-gray-300" />
                </div>

                <button
                    onClick={handleGithubLogin}
                    className="w-full rounded bg-gray-800 py-2 text-white font-medium hover:bg-gray-900"
                >
                    Continue with GitHub
                </button>

                <p className="mt-6 text-sm text-gray-600">
                    {type === "signin" ? (
                        <>
                            Don’t have an account?{" "}
                            <a href="/signup" className="text-blue-600 hover:underline">
                                Sign up
                            </a>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <a href="/signin" className="text-blue-600 hover:underline">
                                Sign in
                            </a>
                        </>
                    )}
                </p>

                <p className="mt-4 text-xs text-gray-400">
                    This site is protected by reCAPTCHA and the Google Privacy Policy and
                    Terms of Service apply.
                </p>
            </div>
        </div>
    );
}
