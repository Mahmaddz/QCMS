export interface ReviewBodyProps {
    verses: VerseWordsArr;
    tags?: ({ en: string; ar: string; type: string } | { label: string })[];
    id?: number;
    role?: number;
    showTags: boolean;
    selectedKeywords: { word: string, color: string }[];
}

export interface VerseWords {
    Chapter: number | string;
    Verse: number | string;
    PoS_tags: string;
    Stem_pattern: string;
    word: string;
    wordUndiacritizedNoHamza: string;
}

export interface VerseWordsArr {
    suraName: string;
    ayat: VerseWords[];
}