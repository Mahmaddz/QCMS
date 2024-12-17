import { MAP } from "../../types/map";
import { RootLemmaWords } from "../RootLemmaWord";
import { SuraAyaInfo } from "../SurahAyaInfo";
import { ErrorResponse } from "./error/error";

export interface SuccessResponse {
    success: true;
    message?: string;
    data: SuraAyaInfo[];
    words: {
        lemmas: MAP;
        roots: MAP;
    };
    otherWords: { 
        lemmasWords: MAP;
        rootsWords: RootLemmaWords[];
    };
    searchedFor?: string[];
    suggestions?: string[];
}
export interface FailureResponse extends ErrorResponse {
    success: false;
}

export type SimpleSearchResponse = SuccessResponse | FailureResponse;

export interface SimpleSearchRequest {
    (term: string, words?: string[]): Promise<SimpleSearchResponse>;
}