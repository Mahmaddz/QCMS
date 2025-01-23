import Header from '../layout/Header';
import SearchForm from '../components/SearchForm';
import ReviewBodyList from '../components/ReviewBodyList';
import { useState } from 'react';
import { SuraAyaInfo } from '../interfaces/SurahAyaInfo';
import { useSearchParams } from 'react-router-dom';

export default function Home() {

  const [searchParam] = useSearchParams();

  const [showTag, setShowTag] = useState<boolean>(true);
  const [searchedResult, setSearchedResult] = useState<SuraAyaInfo[]>();
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [currentSearch, setCurrentSearch] = useState({
    method: "isDefault",
    search: ""
  });


  {/* HOME IS GONNA BE "TAG REVIEW IF USER IS IN 'ADMIN' OR 'REVIEWER' ROLE" */}

  return (
    <>
      <Header />
      <SearchForm setCurrentSearchMethod={setCurrentSearch} showTag={showTag} setShowTag={setShowTag} setSearchedResult={setSearchedResult} toSearch={searchParam.get('search') || ""} selectedKeywords={selectedKeywords} setSelectedKeywords={setSelectedKeywords}/>
      <ReviewBodyList currentSearchMethod={currentSearch} showTags={showTag} searchData={searchedResult} selectedKeywords={selectedKeywords}/>
    </>
  );
}
