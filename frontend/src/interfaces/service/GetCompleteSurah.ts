import { Ayaat } from "../SurahAyaList";
import { ErrorResponse } from "./error/error";
import { STRING } from "./types/ApiRequest";

export interface SurahWithAyaatResponse extends ErrorResponse {
    success: boolean; 
    result: {
        totalAyats: number;
        ayaat: Ayaat[]
    };
}

export interface SurahWithAyaatRequest {
    (suraNo: STRING): Promise<SurahWithAyaatResponse>;
}