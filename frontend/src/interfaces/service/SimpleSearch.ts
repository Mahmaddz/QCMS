import { SuraAyaInfo } from "../SurahAyaInfo";
import { ErrorResponse } from "./error/error";

export interface SuccessResponse {
    success: true; // Explicitly indicates success
    message?: string;
    data: SuraAyaInfo[]; // Expected data on success
    searchedFor: string[]; // Keywords or terms searched for
    suggestions?: string[]; // Suggestions for the search
}

// Failure Response explicitly inherits ErrorResponse
export interface FailureResponse extends ErrorResponse {
    success: false; // Explicitly indicates failure
}

// Use a discriminated union to differentiate between success and failure cases
export type SimpleSearchResponse = SuccessResponse | FailureResponse;

export interface SimpleSearchRequest {
    (term: string, words?: string[]): Promise<SimpleSearchResponse>;
}