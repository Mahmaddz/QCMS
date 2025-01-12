import { CurrentSearch } from "./SearchForm";

export interface ReviewBodyProps {
    verses: VerseWordsArr; //\\
    tags?: ({ en: string; ar: string; type: string } | { label: string })[];
    id?: number;
    role?: number;
    showTags?: boolean;
    selectedKeywords?: { word: string, color: string }[]; //\\
    selectedLanguage: number | string | undefined; //\\
    searchMethod?: CurrentSearch
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
} 

export interface VerseWordsArr {
    suraName?: string;
    ayat: VerseWords[];
    translation: AyaTranslationWithIds[];
    conceptArabic?: string;
    arabicWord?: string[];
    wordId?: string | string[];
}