import { Response } from 'express';
import { ResponseDto } from '../dtos/response.js';

export const sendErrorResponse = (res: Response, status: number, message: string) => {
    const response: ResponseDto = {
        success: false,
        message: message
    };
    res.status(status).json(response);
};

export function sendSuccessResponse<T = any>(res: Response, data: T) {
    const response: ResponseDto<T> = {
        success: true,
        message: "",
        data
    };
    res.status(200).json(response);
};