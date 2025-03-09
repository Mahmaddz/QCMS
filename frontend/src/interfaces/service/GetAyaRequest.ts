import { AyaTranslationWithIds, VerseWordsArr } from "../ReviewBody";
import { Tagz } from "../SurahAyaInfo";
import { ErrorResponse } from "./error/error";

export interface GetAyaWordsResponse extends ErrorResponse {
    tags?: Tagz[];
    suraName: string; 
    ayat: VerseWordsArr[];
    translation: AyaTranslationWithIds[];
}

export interface GetAyaWordsRequest {
    (sura: string, aya?: string[]): Promise<GetAyaWordsResponse>;
}