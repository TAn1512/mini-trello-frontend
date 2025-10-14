"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { googleLoginApi } from "@/services/auth";

function GoogleCallbackInner() {
    const router = useRouter();
    const params = useSearchParams();
    const dispatch = useDispatch();

    const mutation = useMutation({
        mutationFn: googleLoginApi,
        onSuccess: (res) => {
            if (res.ok && res.data?.accessToken) {
                localStorage.setItem("token", res.data.accessToken);
                const user = {
                    email: res.data.email,
                    accessToken: res.data.accessToken,
                };
                Cookies.set("user", JSON.stringify(user), { expires: 1 });
                dispatch(setUser(user));
                router.push("/boards");
            } else {
                alert(res.message || "Google login failed");
                router.push("/signin");
            }
        },
        onError: () => {
            alert("Network error. Please try again.");
            router.push("/signin");
        },
    });

    useEffect(() => {
        const code = params.get("code");
        if (code) mutation.mutate(code);
    }, [params]);

    return (
        <div className="flex h-screen items-center justify-center">
            <p className="text-gray-700 text-lg">
                {mutation.isPending
                    ? "Signing in with Google..."
                    : mutation.isError
                        ? "Something went wrong."
                        : "Redirecting..."}
            </p>
        </div>
    );
}

export default function GoogleCallback() {
    return (
        <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
            <GoogleCallbackInner />
        </Suspense>
    );
}
