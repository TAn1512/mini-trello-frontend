"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { githubLoginApi } from "@/services/auth";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";


function GithubCallbackInner() {
    const router = useRouter();
    const params = useSearchParams();
    const dispatch = useDispatch();


    useEffect(() => {
        const code = params.get("code");

        if (!code) return;

        (async () => {
            const res = await githubLoginApi(code);
            if (res.ok && res.data?.accessToken) {
                localStorage.setItem("token", res.data.accessToken);

                const user = {
                    email: res.data.email,
                    accessToken: res.data.accessToken,
                };

                Cookies.set("user", JSON.stringify(user), { expires: 1 });
                dispatch(
                    setUser(user)
                );
                router.push("/boards");
            } else {
                alert(res.message || "GitHub login failed");
                router.push("/signin");
            }
        })();
    }, [params, router]);

    return <p className="text-center mt-10">Signing in with GitHub...</p>;
}

export default function GithubCallback() {
    return (
        <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
            <GithubCallbackInner />
        </Suspense>
    );
}
