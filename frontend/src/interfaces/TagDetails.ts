import { Tagz } from "./SurahAyaInfo";

export interface TagDetails {
    id: number;
    suraNo: number;
    ayaNo: number;
    userId: number;
    actions: string;
    statuses: string;
    emlaeyTextDiacritics: string;
    details: Tagz
}