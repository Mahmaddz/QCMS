import { LanguageType } from "../Language";
import { ErrorResponse } from "./error/error";

export interface GetLanguagesResponse extends ErrorResponse {
    data: LanguageType[]
}

export interface GetLanguagesRequest {
    (): Promise<GetLanguagesResponse>;
}