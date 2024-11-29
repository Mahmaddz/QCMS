import { Tokens } from "./common/token";
import { User } from "./common/user";
import { ErrorResponse } from "./error/error";
import { STRING } from "./types/ApiRequest";

export interface Response extends ErrorResponse{
    success: boolean; 
    message?: string;
    user?: User;
    tokens?: Tokens;
}

export interface Request {
    (email: STRING, password: STRING): Promise<Response>;
}