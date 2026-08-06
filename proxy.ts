import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/home",
  "/transacciones",
  "/categorias",
  "/metas",
  "/recordatorios",
  "/perfil",
];

const AUTH_PREFIXES = ["/login", "/registro"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    nextUrl.pathname.startsWith(prefix)
  );
  const isAuthPage = AUTH_PREFIXES.some((prefix) =>
    nextUrl.pathname.startsWith(prefix)
  );

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
