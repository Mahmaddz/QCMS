export interface SuraAyaInfo {
    suraAyaInfo?: string;
    uthmaniTextDiacritics?: string;
    englishTranslation?: string;
    conceptNameAr?: string;
    conceptNameEn?: string;
    ayaNo: number;
    suraNo: number;
    emlaeyTextNoDiacritics?: string;
    arabicWords?: string[];
    conceptArabic?: string;
    wordIds?: number[];
    tags?: Tagz[];
}

export interface Tagz {
    id?: number;
    suraNo?: number;
    ayaNo?: number;
    ar: string;
    en: string;
}
