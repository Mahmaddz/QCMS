import Header from '../layout/Header';
import SearchForm from '../components/SearchForm';
import ReviewBodyList from '../components/ReviewBodyList';
import { useState } from 'react';
import { SuraAyaInfo } from '../interfaces/SurahAyaInfo';

export default function Home() {

  const [showTag, setShowTag] = useState<boolean>(false);
  const [searchedResult, setSearchedResult] = useState<SuraAyaInfo[]>();


  {/* HOME IS GONNA BE "TAG REVIEW IF USER IS IN 'ADMIN' OR 'REVIEWER' ROLE" */}

  return (
    <>
      <Header />
      <SearchForm setShowTag={setShowTag} setSearchedResult={setSearchedResult}/>
      <ReviewBodyList showTags={showTag} searchData={searchedResult}/>
    </>
  );
}
