export interface AyatTranslation {
    text: string; 
    langCode: string
}

export interface Ayaat {
    ayaNo: number;
    uthmani: string;
    noDiaEmlaye: string;
    emlaye: string;  
    suraNameAr: string;
    suraNameEn: string;
    translation: AyatTranslation[]
}

export interface CompleteSurah {
    sura: string; 
    aya: string; 
    araNm: string;
    engNm: string;
    verses?: Ayaat[]
}