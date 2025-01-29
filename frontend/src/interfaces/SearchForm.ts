import { Dispatch, SetStateAction } from "react";
import { SuraAyaInfo } from "./SurahAyaInfo";
import { SetURLSearchParams } from "react-router-dom";

export interface FilterStateParams {
    surah: number | string | null | undefined; aya: number | string | null | undefined;
}

export interface SearchParams {
    isAya: boolean,
    isQurana: boolean,
    isQurany: boolean,
    isTag: boolean,
    search: string,
}

export interface CurrentSearch {
    method: string;
    search: string;
}

export interface SearchFormParam {
    showTag: boolean;
    setShowTag: Dispatch<SetStateAction<boolean | undefined>> | Dispatch<React.SetStateAction<boolean>>;
    filter?: FilterStateParams;
    setFilter?: Dispatch<SetStateAction<FilterStateParams>>;
    setSearchedResult: Dispatch<SetStateAction<SuraAyaInfo[]>>
    searchParam?: URLSearchParams;
    selectedKeywords: string[];
    setSelectedKeywords: Dispatch<SetStateAction<string[]>>;
    setCurrentSearchMethod: Dispatch<SetStateAction<CurrentSearch>>;
    setSearchParams: SetURLSearchParams;
    searchData: SuraAyaInfo[] | undefined;
}