import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/questions/new",
    "/questions/:path*/edit",
    "/admin/:path*",
  ],
}; 