import type { NextRequest } from 'next/server'
export function middleware(request: NextRequest) {


  const currentUser = request.cookies.get('next-auth.session-token');

  //hidden login and signup pages
  if (currentUser && request.nextUrl.pathname === '/login') {
    return Response.redirect(new URL('/', request.url))
  }
  if (currentUser && request.nextUrl.pathname ==='/signup' ) {
    return Response.redirect(new URL('/', request.url))
  }
  //******************* */

  if (!currentUser && request.nextUrl.pathname ==='/dashboard') {
    return Response.redirect(new URL('/login', request.url))
  }
  if (!currentUser && request.nextUrl.pathname ==='/appointment') {
    return Response.redirect(new URL('/login', request.url))
  }
 
  if ( request.nextUrl.pathname==='/home') {
    return Response.redirect(new URL('/', request.url))
  }

}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}