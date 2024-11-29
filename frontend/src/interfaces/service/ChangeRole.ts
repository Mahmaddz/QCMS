import { ErrorResponse } from "./error/error";

export interface FnChangeRole extends ErrorResponse {
    (userId: number, newRole: string | number): Promise<ErrorResponse>
}