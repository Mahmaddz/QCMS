import { SuraAyaInfo } from "../SurahAyaInfo";
import { ErrorResponse } from "./error/error";

export interface SimpleSearchResponse extends ErrorResponse {
    success: boolean; 
    message?: string;
    data: SuraAyaInfo[];
    searchedFor: string[];
    suggestions?: string[];
}

export interface SimpleSearchRequest {
    (term: string, words?: string[]): Promise<SimpleSearchResponse>;
}