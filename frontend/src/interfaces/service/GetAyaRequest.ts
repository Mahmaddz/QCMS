import { AyaTranslationWithIds } from "../ReviewBody";
import { Tagz } from "../SurahAyaInfo";
import { ErrorResponse } from "./error/error";

export interface GetAyaWordsResponse extends ErrorResponse {
    tags?: Tagz[];
    suraName: string; 
    ayat: string[];
    translation: AyaTranslationWithIds[];
}

export interface GetAyaWordsRequest {
    (sura: string, aya?: string[]): Promise<GetAyaWordsResponse>;
}