import { SuraAyaInfo } from "../SurahAyaInfo";
import { ErrorResponse } from "./error/error";

export interface GetQuranaResponse extends ErrorResponse {
    success: boolean; 
    message?: string;
    data: SuraAyaInfo[]
}

export interface GetQuranaRequest {
    (concept: string, ayaNo: string | null, suraNo: string | null): Promise<GetQuranaResponse>;
}