import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const userCookie = req.cookies.get("user")?.value;
    const { pathname } = req.nextUrl;

    const publicPaths = ["/signin", "/signup", "/verify", "/github-callback"];

    let user: { email: string; accessToken: string } | null = null;
    if (userCookie) {
        try {
            user = JSON.parse(userCookie);
        } catch {
            user = null;
        }
    }

    if (!user && !publicPaths.some((p) => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (user && publicPaths.some((p) => pathname.startsWith(p))) {
        return NextResponse.redirect(new URL("/boards", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
