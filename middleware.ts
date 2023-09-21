import { authMiddleware } from "@clerk/nextjs";


export default authMiddleware({
  debug: true,
  publicRoutes: ['/', '/api/webhook/clerk'],
  ignoredRoutes: ['/api/webhook/clerk'],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
