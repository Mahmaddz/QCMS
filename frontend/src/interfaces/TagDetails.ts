import { Tagz } from "./SurahAyaInfo";

export interface TagDetails {
    id: number;
    suraNo: number;
    ayaNo: number;
    username: string;
    actions: string;
    statuses: string;
    emlaeyTextDiacritics: string;
    details: Tagz
}