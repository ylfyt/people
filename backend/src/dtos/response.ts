export type ResponseDto<T = any> = {
    success: boolean;
    message: string;
    data?: T;
};