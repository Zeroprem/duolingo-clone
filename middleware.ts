import { authMiddleware } from "@clerk/nextjs";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { isClerkConfigured } from "@/lib/clerk";

const clerkMiddleware = authMiddleware({
  publicRoutes: ["/", "/api/webhooks/stripe"],
});

export default function middleware(req: NextRequest, evt: NextFetchEvent) {
  if (!isClerkConfigured) {
    return NextResponse.next();
  }

  return clerkMiddleware(req, evt);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
