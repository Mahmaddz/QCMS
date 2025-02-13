import { SetURLSearchParams } from "react-router-dom";
import { CurrentSearch, FilterStateParams } from "./SearchForm";
import { SuraAyaInfo } from "./SurahAyaInfo";

export interface RBL_Params {
    setSearchParams?: SetURLSearchParams;
    searchParam?: URLSearchParams;
    filter?: FilterStateParams;
    showTags: boolean;
    searchData: SuraAyaInfo[] | undefined;
    selectedKeywords: string[];
    currentSearchMethod: CurrentSearch;
}