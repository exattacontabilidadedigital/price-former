import { auth } from "@/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  
  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') ||
    nextUrl.pathname.startsWith('/products') ||
    nextUrl.pathname.startsWith('/costs') ||
    nextUrl.pathname.startsWith('/calculator') ||
    nextUrl.pathname.startsWith('/settings');

  // Root route is handled by the page component
  if (nextUrl.pathname === '/') {
    return null;
  }

  if (isOnDashboard) {
    if (!isLoggedIn) {
      return Response.redirect(new URL('/login', nextUrl));
    }
  } else if (isLoggedIn) {
    // Redirect authenticated users to dashboard if they try to access login/register
    // Unless forceLogin param is present (used when session is invalid/user deleted)
    const forceLogin = nextUrl.searchParams.get('forceLogin')
    if ((nextUrl.pathname === '/login' || nextUrl.pathname === '/register') && !forceLogin) {
      return Response.redirect(new URL('/dashboard', nextUrl));
    }
  }
  
  return null;
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
