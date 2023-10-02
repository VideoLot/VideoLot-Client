import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const response = NextResponse.next({request: req});
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
}

export const config = {
    matcher: '/api/:path*'
}