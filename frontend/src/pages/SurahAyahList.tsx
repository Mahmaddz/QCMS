import { useEffect, useState, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../layout/Header';
import { Box, Typography, Skeleton, } from '@mui/material';
// import { getCompleteSura } from '../services/Ayaat/getCompleteSura';
import { CompleteSurah } from '../interfaces/SurahAyaList';
import StatusBar from '../components/Statusbar';
import LanguageSelect from '../components/LanguageSelect';
import { LanguageType } from '../interfaces/Language';
import { getAllLanguages } from '../services/Language/getLanguages';
import { getAyaWords } from '../services/Ayaat/getAyaWords';
import Toaster from '../utils/helper/Toaster';
import VersePart from '../components/VersePart';
import { AyaTranslationWithIds, VerseWords, VerseWordsArr } from '../interfaces/ReviewBody';

const SurahAyahList = () => {
    const [searchParam] = useSearchParams();
    const targetRef = useRef<HTMLDivElement | null>(null);

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
            const groupedByVerse = data.reduce<Record<string, { ayat: VerseWords[]; translation: AyaTranslationWithIds[] }>>(
                (acc, item: VerseWords) => {
                    if (!acc[item.Verse]) {
                        acc[item.Verse] = { ayat: [], translation: [] };
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
                        variant="text"
                        width="20%"
                        height={50}
                        sx={{ margin: '0 auto 2rem' }}
                    />
                )}

                {surahInfo?.engNm ? (
                    <Typography
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
                        variant="text"
                        width="10%"
                        height={40}
                        sx={{ margin: '0 auto 2rem' }}
                    />
                )}

                {surahInfo?.verses ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            padding: 4,
                            borderRadius: 2,
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {verses.map((verse, index) => {
                            const isTarget = (index + 1) === Number.parseInt(surahInfo.aya as string);
            
                            return (
                                <Box
                                    key={index}
                                    ref={isTarget ? targetRef : null}
                                    sx={{
                                        width: '100%',
                                        maxWidth: 900,
                                        padding: 3,
                                        borderRadius: 2,
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        background: isTarget
                                            ? 'linear-gradient(135deg, #bbdefb,  #81d4fa)'
                                            : 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.03)',
                                            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                                        },
                                    }}
                                >
                                    <VersePart 
                                        selectedLanguage={selectedLanguage?.code || 'en'} 
                                        verses={verse} 
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                ) : (
                    Array.from({ length: 5 }).map((_, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 3,
                                width: '70%',
                                margin: '0 auto',
                                marginBottom: 2,
                                borderRadius: 4,
                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#f5f5f5',
                                '@media (max-width:600px)': {
                                    width: '90%',
                                    padding: 2,
                                },
                            }}
                        >
                            <Skeleton
                                variant="rectangular"
                                width="10%"
                                height={50}
                                sx={{ marginRight: 3 }}
                            />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton
                                    width="90%"
                                    height={30}
                                    sx={{ marginBottom: 1 }}
                                />
                                <Skeleton width="80%" height={20} />
                            </Box>
                        </Box>
                    ))
                )}
            </Box>
        </>
    );
};

export default SurahAyahList;
