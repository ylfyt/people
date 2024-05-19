interface IHttpRequestParams {
    url: string;
    method?: 'get' | 'post' | 'patch' | 'put' | 'delete';
    payload?: any;
    abortSignal?: AbortSignal;
}

export type SuccessResponse<T = any> = {
    success: true;
    message: string;
    code: 200;
    data: T;
};

export type ErrorResponse<T = any> = {
    success: false;
    message: string;
    code: number;
    data?: T;
};

export type ResponseDto<T = null> = SuccessResponse<T> | ErrorResponse<T>;

export async function sendHttp<T = any>({
    url,
    method = 'get',
    payload,
    abortSignal
}: IHttpRequestParams): Promise<ResponseDto<T>> {
    try {
        const res = await fetch(url, {
            method,
            headers: payload instanceof FormData ? {
                Authorization: `Bearer ${localStorage.getItem("jit")}`,
            } : {
                Authorization: `Bearer ${localStorage.getItem("jit")}`,
                "Content-Type": "application/json"
            },
            signal: abortSignal,
            body: payload instanceof FormData ? payload : JSON.stringify(payload)
        });
        const response: ResponseDto<T> = await res.json();
        response.code = res.status;
        if (res.status === 401) {
            localStorage.removeItem("jit");
            window.location.reload();
        }
        return response;
    } catch (error) {
        console.log('ERR', error);
        return {
            success: false,
            message: 'Failed To Send Request, Please Try Again Later',
            code: 501,
        };
    }
}
