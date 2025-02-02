import { CurrentSearch } from "./SearchForm";
import { Tagz } from "./SurahAyaInfo";

export interface ReviewBodyProps {
    isSelectedAya?: boolean;
    verses: VerseWordsArr; //\\
    tags?: Tagz[];
    id?: number;
    role?: number;
    showTags?: boolean;
    selectedKeywords?: string[]; //\\
    selectedLanguage: number | string | undefined; //\\
    searchMethod?: CurrentSearch;
    displayNumbers?: boolean;
    verseNumber?: number;
}

export interface VerseWords {
    Chapter: number | string;
    Verse: number | string;
    PoS_tags: string;
    Stem_pattern: string;
    word: string;
    wordUndiacritizedNoHamza: string;
}

export interface AyaTranslationWithIds {
    sura: string,
    aya: number,
    text: string,
    language: {
        name: string,
        code: string
    }
    tags?: Tagz[];
} 

export interface VerseWordsArr {
    suraName?: string;
    ayat: VerseWords[];
    translation: AyaTranslationWithIds[];
    conceptArabic?: string;
    arabicWord?: string[];
    wordId?: number[];
    tags?: Tagz[]
}