import { ErrorResponse } from "./error/error";

export interface GetAyaWordsResponse extends ErrorResponse {
    suraName: string, 
    ayat: string[],
}

export interface GetAyaWordsRequest {
    (sura: string, aya: string[]): Promise<GetAyaWordsResponse>;
}