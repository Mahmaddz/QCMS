import { FilterStateParams } from "./SearchForm";
import { SuraAyaInfo } from "./SurahAyaInfo";

export interface RBL_Params {
    filter?: FilterStateParams;
    showTags: boolean;
    searchData: SuraAyaInfo[] | undefined;
    selectedKeywords: string[];
}