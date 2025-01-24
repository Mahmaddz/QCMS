export interface SuraAyaInfo {
    suraAyaInfo?: string;
    uthmaniTextDiacritics?: string;
    englishTranslation?: string;
    conceptNameAr?: string;
    conceptNameEn?: string;
    ayaNo: number;
    suraNo: number;
    emlaeyTextNoDiacritics?: string;
    arabicWord?: string;
    conceptArabic?: string;
    wordId?: number | string;
    tags?: Tagz[];
}

export interface Tagz {
    id: number;
    suraNo?: number;
    ayaNo?: number;
    ar: string;
    en: string;
}
