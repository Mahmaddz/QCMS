export interface ErrorResponse {
    success?: boolean;
    data?: string | unknown;
    message?: string,
    isError?: boolean;
    error?: {
        message: string;
        code: number;
    };
    stack?: string; 
}