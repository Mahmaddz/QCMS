import { useEffect, useState, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../layout/Header';
import { Box, Typography, Skeleton } from '@mui/material';
// import { getCompleteSura } from '../services/Ayaat/getCompleteSura';
import { CompleteSurah } from '../interfaces/SurahAyaList';
import StatusBar from '../components/Statusbar';
import LanguageSelect from '../components/LanguageSelect';
import { LanguageType } from '../interfaces/Language';
import { getAllLanguages } from '../services/Language/getLanguages';
import { getAyaWords } from '../services/Ayaat/getAyaWords';
import Toaster from '../utils/helper/Toaster';
import { AyaTranslationWithIds, VerseWords, VerseWordsArr } from '../interfaces/ReviewBody';
import { Tagz } from '../interfaces/SurahAyaInfo';
import uniqueID from '../utils/helper/UniqueID';
import ReviewBody from '../components/ReviewBody';

const SurahAyahList = () => {
    const [searchParam] = useSearchParams();
    const targetRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [surahInfo, setSurahInfo] = useState<CompleteSurah>({ araNm: '', aya: '', engNm: '', sura: ""  });
    const [listOfLanguages, setListOfLanguages] = useState<LanguageType[]>([]);
    const [selectedLanguage, setSelectedLanguages] = useState<LanguageType | undefined>();

    useEffect(() => {
        // EXTRACTING VALUES
        const sura = searchParam.get('sura') || "";
        const aya = searchParam.get('aya') || "";

        const suraNum = Number.parseInt(sura);
        const ayaNum = Number.parseInt(aya);
        if ((suraNum < 1 || suraNum > 114) || (ayaNum < 1 || ayaNum > 286)) {
            Toaster("INVALID Search Params", 'error');
            return;
        }

        // FETCHING DATA
        (async () => {
            const response = await getAyaWords(sura as string);
            const data: VerseWords[] = response.ayat as unknown as VerseWords[] || [];
            const groupedByVerse = data.reduce<Record<string, { ayat: VerseWords[]; translation: AyaTranslationWithIds[], tags: Tagz[] }>>(
                (acc, item: VerseWords) => {
                    if (!acc[item.Verse]) {
                        acc[item.Verse] = { ayat: [], translation: [], tags: [] };
                    }
                    acc[item.Verse].ayat.push(item);
                    return acc;
                }, {}
            );
            response.translation.forEach((trans: AyaTranslationWithIds) => {
                const verse = trans.aya.toString();
                if (groupedByVerse[verse]) {
                    groupedByVerse[verse].translation.push(trans);
                }
            });
            response.tags?.forEach((tag: Tagz) => {
                const verse = tag?.ayaNo?.toString();
                if (verse && groupedByVerse[verse]) {
                    groupedByVerse[verse].tags.push(tag);
                }
            });
            setSurahInfo({
                aya, 
                sura, 
                araNm: response.suraName.split(' - ')[0] || "404", 
                engNm: response.suraName.split(' - ')[1] || "Not Such Data Found", 
                verses: Object.values(groupedByVerse) as VerseWordsArr[]
            })
        })();

    }, [searchParam]);

    useEffect(() => {
        const time = setTimeout(() => {
            if (targetRef.current) {
                targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 1500);
        (async () => {
            const response = await getAllLanguages();
            if (response.success) {
                setListOfLanguages(response.data);
                setSelectedLanguages(response.data[0]);
                setIsLoading(false);
            }
        })()
        return () => clearTimeout(time);
    }, [surahInfo.aya]);

    const handleLanguageChange = (selectedLanguage: LanguageType) => {
        setSelectedLanguages(selectedLanguage)
    }

    const verses = useMemo(() => surahInfo?.verses || [], [surahInfo]);

    return (
        <>
            <Header/>
            <StatusBar/>

            <LanguageSelect listOfLanguages={listOfLanguages} handleChange={handleLanguageChange}/>

            <Box
                key={uniqueID()}
                sx={{
                    padding: 3,
                    backgroundColor: '#ffffff',
                    borderRadius: 4,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                }}
            >
                {surahInfo?.araNm ? (
                    <Typography
                        key={uniqueID()}
                        variant="h3"
                        sx={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: '#2e3b55',
                            marginBottom: 2,
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        سُورَة {surahInfo.araNm}
                    </Typography>
                ) : (
                    <Skeleton
                        key={uniqueID()}
                        variant="text"
                        width="20%"
                        height={70}
                        sx={{ margin: '0 auto 2rem' }}
                    />
                )}

                {surahInfo?.engNm ? (
                    <Typography
                        key={uniqueID()}
                        variant="h4"
                        sx={{
                            textAlign: 'center',
                            color: '#607d8b',
                            marginBottom: 4,
                            fontStyle: 'italic',
                        }}
                    >
                        {surahInfo.engNm}
                    </Typography>
                ) : (
                    <Skeleton
                        key={uniqueID()}
                        variant="text"
                        width="10%"
                        height={40}
                        sx={{ margin: '0 auto 2rem' }}
                    />
                )}

                {
                    isLoading ? (
                        Array.from({ length: 5 }).map(() => (
                            <Box
                                key={uniqueID()}
                                sx={{
                                    width: '60%',
                                    margin: '0 auto',
                                    height: 'auto',
                                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: '#f5f5f5',
                                    '@media (max-width:600px)': {
                                        width: '90%',
                                        padding: 2,
                                    },
                                }}
                            >
                                <Box
                                    key={uniqueID()}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: { sm: 'row', xs: 'column' },
                                        alignItems: 'center',
                                        padding: 3,
                                        margin: '0 auto',
                                        borderRadius: 4,
                                    }}
                                >
                                    <Skeleton
                                        key={uniqueID()}
                                        variant="circular"
                                        width={50}
                                        height={50}
                                        sx={{ marginRight: 3 }}
                                    />
                                    <Box sx={{ flex: 1, margin: '0 auto', justifyItems: 'center' }} key={uniqueID()}>
                                        <Skeleton
                                            key={uniqueID()}
                                            width="50%"
                                            height={50}
                                            sx={{ marginBottom: 1 }}
                                        />
                                        <Skeleton width="30%" height={20} />
                                    </Box>
                                </Box>
                                <Box display={'flex'} width={'90%'} marginTop={0} marginBottom={3} key={uniqueID()}>
                                    {Array.from({ length: 3 }).map(() => (
                                        <Skeleton
                                            key={uniqueID()}
                                            variant="rounded"
                                            width={120}
                                            height={32}
                                            sx={{
                                                gap: 3,
                                                borderRadius: "16px",
                                                backgroundColor: "#e0e0e0",
                                                marginBottom: 4,
                                                marginLeft: 2,
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        ))
                    ) : (
                        verses?.map((verse, index) => {
                            const isTarget = (index + 1) === Number.parseInt(surahInfo.aya as string);
                            return (
                                <Box
                                    key={uniqueID()}
                                    ref={isTarget ? targetRef : null}
                                >
                                    <ReviewBody
                                        key={uniqueID()}
                                        verseNumber={index+1}
                                        verses={verse}
                                        tags={verse.tags || []}
                                        showTags={true}
                                        selectedKeywords={[]}
                                        selectedLanguage={selectedLanguage?.id || 0}
                                        isSelectedAya={isTarget}
                                    />
                                </Box>
                            )
                        })
                    )
                }
            </Box>
        </>
    );
};

export default SurahAyahList;
