import { ErrorResponse } from "./error/error";
import { STRING } from "./types/ApiRequest";

export interface ResRegister extends ErrorResponse {
    success: boolean; token?: string; message?: string
}

export interface ReqRegister {
    (email: STRING, password: STRING, confirmedPassword: STRING, username: STRING): Promise<ResRegister>;
}