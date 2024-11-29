import { ErrorResponse } from "./error/error";

export interface User {
    id: number;
    email: string;
    roleID?: number;
    role?: {roleName?: string}
}

export interface Response extends ErrorResponse {
    success: boolean,
    message: string,
    length: number,
    users: User[]
}

export interface GetUserResponse extends ErrorResponse {
    (): Promise<Response>
}