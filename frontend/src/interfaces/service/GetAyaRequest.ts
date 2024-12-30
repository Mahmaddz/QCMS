import { AyaTranslationWithIds } from "../ReviewBody";
import { ErrorResponse } from "./error/error";

export interface GetAyaWordsResponse extends ErrorResponse {
    suraName: string, 
    ayat: string[],
    translation: AyaTranslationWithIds[],
}

export interface GetAyaWordsRequest {
    (sura: string, aya: string[]): Promise<GetAyaWordsResponse>;
}