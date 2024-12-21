export interface Ayaat {
    ayaNo: number;
    uthmani: string;
    noDiaEmlaye: string;
    emlaye: string;
    english: string;    
    suraNameAr: string;
    suraNameEn: string;
}

export interface CompleteSurah {
    sura: string; 
    aya: string; 
    araNm: string;
    engNm: string;
    verses?: Ayaat[]
}