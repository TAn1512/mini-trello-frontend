"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signinApi, signupApi } from "@/services/auth";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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
            router.push(`/verify?type=${type}&email=${encodeURIComponent(email)}`);
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

    const handleGoogleLogin = () => {
        const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
        const redirectUri = `${window.location.origin}/google-callback`;
        const scope = ["openid", "email", "profile"].join(" ");
        const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&response_type=code&scope=${encodeURIComponent(
            scope
        )}&access_type=offline`;
        window.location.href = googleUrl;
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8 text-center">
                <div className="flex justify-center mb-6">
                    <h1 className="text-3xl font-bold text-red-600">MT</h1>
                </div>

                <h2 className="text-gray-700 text-lg sm:text-xl font-medium mb-8">
                    {type === "signin" ? "Log in to continue" : "Create your account"}
                </h2>

                <button
                    onClick={handleGoogleLogin}
                    className="cursor-pointer flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
                >
                    <FcGoogle size={22} />
                    Continue with Google
                </button>

                <div className="my-6 flex items-center">
                    <div className="flex-grow h-px bg-gray-300" />
                    <span className="px-3 text-sm text-gray-400">OR</span>
                    <div className="flex-grow h-px bg-gray-300" />
                </div>

                <button
                    onClick={handleGithubLogin}
                    className="cursor-pointer flex w-full items-center justify-center gap-3 rounded-lg bg-gray-900 py-3 text-white font-medium hover:bg-gray-800 transition duration-200"
                >
                    <FaGithub size={20} />
                    Continue with GitHub
                </button>

                <p className="mt-8 text-xs text-gray-400 leading-relaxed">
                    This site is protected by reCAPTCHA and the Google Privacy Policy and
                    Terms of Service apply.
                </p>
            </div>
        </div>
    );
}
