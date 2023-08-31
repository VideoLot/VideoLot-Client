type NameValuePair = {
    name: string,
    value: string
};

class Send {
    private _path: string;
    private _method: string;
    private _body: BodyInit | undefined;
    private _params: URLSearchParams | undefined;
    private _headers: Headers | undefined;
    private _urlBase: string;

    /**
     *
     */
    constructor(path: string, method: string, urlBase?: string) {
        this._path = path;
        this._method = method;        
        if (urlBase) {
            this._urlBase = urlBase;
        } else {
            this._urlBase = process.env.NEXT_PUBLIC_API_URL as string;
        }
    }

    withJsonBody(data: object) {
        this._body = JSON.stringify(data);
        this.withHeader('Content-Type', 'application/json');

        return this;
    }

    withOctetBody(data: string | ArrayBuffer) {
        this._body = data;
        this.withHeader('Content-Type', 'application/octet-stream');

        return this;
    }

    withStreamBody<T>(data: ReadableStream<T> | null) {
        if (!data) {
            return this;
        }
        this._body = data;

        return this;
    }

    withParam(name: string, value: string) {
        if (!this._params) {
            this._params = new URLSearchParams();
        }
        this._params.set(name, value);

        return this;
    }

    withParams(...params: NameValuePair[]) {
        for (const param of params) {
            this.withParam(param.name, param.value);
        }
        return this;
    }

    withHeader(name: string, value: string) {
        if (!this._headers) {
            this._headers = new Headers();
        }

        this._headers.set(name, value)
        return this;
    }

    withHeaders(...params: NameValuePair[]) {
        for (const param of params) {
            this.withHeader(param.name, param.value);
        }
        return this;
    }

    async send(): Promise<Response> {
        const options = {
            method: this._method
        } as RequestInit;
    
        if (this._body) {
            options.body = this._body;
        }
    
        if (this._headers) {
            options.headers = this._headers;
        }
    
        let path = this._path;
        if (this._params) {
            path = `${path}?${this._params.toString()}`;
        }
        const url = new URL(path, this._urlBase);
        return await fetch(url, options);
    }
}

export function get(path: string, urlBase?: string) {
    return new Send(path, 'GET', urlBase);
}

export function put(path: string, urlBase?: string) {
    return new Send(path, 'PUT', urlBase);
}

export function post(path: string, urlBase?: string) {
    return new Send(path, 'POST', urlBase);
}

export function del(path: string, urlBase?: string) {
    return new Send(path, 'DELETE', urlBase);
}