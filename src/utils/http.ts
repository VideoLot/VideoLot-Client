
export function updateHeaders(reqHeaders: Headers): Headers {
    const responseHeaders = new Headers(reqHeaders);
    responseHeaders.delete('Content-Length');
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return responseHeaders;
}