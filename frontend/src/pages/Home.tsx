import Header from "../layout/Header";
import SearchForm from "../components/SearchForm";
import ReviewBodyList from "../components/ReviewBodyList";
import { useState } from "react";
import { SuraAyaInfo } from "../interfaces/SurahAyaInfo";
import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [searchParam, setSearchParams] = useSearchParams();

  const [showTag, setShowTag] = useState<boolean>(true);
  const [searchedResult, setSearchedResult] = useState<SuraAyaInfo[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [currentSearch, setCurrentSearch] = useState({
    method: searchParam.get('chkbox') || 'isWord',
    search: ""
  });

  return (
    <>
      <Header />
      <SearchForm
        setSearchParams={setSearchParams}
        setCurrentSearchMethod={setCurrentSearch}
        showTag={showTag}
        setShowTag={setShowTag}
        setSearchedResult={setSearchedResult}
        searchParam={searchParam}
        selectedKeywords={selectedKeywords}
        setSelectedKeywords={setSelectedKeywords}
        searchData={searchedResult}
      />
      <ReviewBodyList
        setSearchParams={setSearchParams}
        searchParam={searchParam}
        currentSearchMethod={currentSearch}
        showTags={showTag}
        searchData={searchedResult}
        selectedKeywords={selectedKeywords}
      />
    </>
  );
}
