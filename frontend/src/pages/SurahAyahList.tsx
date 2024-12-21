import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../layout/Header';
import { Box, Typography, Skeleton } from '@mui/material';
import { getCompleteSura } from '../services/Ayaat/getCompleteSura';
import { CompleteSurah } from '../interfaces/SurahAyaList';
import StatusBar from '../components/Statusbar';

const SurahAyahList = () => {
    const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const [searchParam] = useSearchParams();

    const [surahInfo, setSurahInfo] = useState<CompleteSurah>({ sura: "", aya: "", araNm: "", engNm: "", verses: [] });

    useEffect(() => {
        // EXTRACTING VALUES
        const sura = searchParam.get('sura') || "";
        const aya = searchParam.get('aya') || "";

        // FETCHING DATA
        (async () => {
            const response = await getCompleteSura(sura as string);
            setSurahInfo({
                aya, 
                sura,
                araNm: response.result?.ayaat[0]?.suraNameAr || "404", 
                engNm: response.result?.ayaat[0]?.suraNameEn || "Not Such Data Found", 
                verses: response.result.ayaat || [],
            })
        })();

    }, [searchParam]);

    useEffect(() => {
        const targetAyaNo = Number.parseInt(surahInfo.aya);
        if (targetAyaNo && ayahRefs.current[targetAyaNo]) {
            ayahRefs.current[targetAyaNo]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [surahInfo]);

    return (
        <>
            <Header/>
            <StatusBar/>

            <Box sx={{ padding: 2, backgroundColor: '#f9f9f9', marginTop: 5 }}>
                {surahInfo.araNm ? (
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            textAlign: 'center', 
                            fontWeight: 'bold', 
                            color: '#4a4a4a', 
                            marginBottom: 2 
                        }}
                    >
                        سُورَة {surahInfo.araNm}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width="60%" height={50} sx={{ marginBottom: 2 }} />
                )}

                {surahInfo.engNm ? (
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            textAlign: 'center', 
                            color: '#6a6a6a', 
                            marginBottom: 4 
                        }}
                    >
                        {surahInfo.engNm}
                    </Typography>
                ) : (
                    <Skeleton variant="text" width="40%" height={40} sx={{ marginBottom: 4 }} />
                )}

                {surahInfo.verses && surahInfo.verses.length > 0 ? (
                    surahInfo.verses.map(verse => (
                        <Box 
                            ref={(el: HTMLDivElement | null) => (ayahRefs.current[verse.ayaNo] = el)}
                            key={verse.ayaNo} 
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
                                backgroundColor: verse.ayaNo === Number.parseInt(surahInfo.aya) ? '#a1d4e3' : '',
                                '@media (max-width:600px)': {
                                    width: '90%',
                                    padding: 2,
                                }
                            }}
                        >
                            <Box 
                                sx={{ 
                                    flex: '0 0 10%', 
                                    textAlign: 'center', 
                                    fontWeight: 'bold', 
                                    fontSize: '1.5rem', 
                                    borderRight: '2px blue solid'
                                }}
                            >
                                <Typography sx={{ color: 'secondary.main' }}>
                                    {verse.ayaNo}
                                </Typography>
                            </Box>

                            <Box sx={{ flex: 1, paddingLeft: 3 }}>
                                <Typography 
                                    sx={{ 
                                        textAlign: 'right', 
                                        fontSize: '2.5rem', 
                                        color: '#1b5e20', 
                                        marginBottom: 1,
                                        '@media (max-width:600px)': {
                                            fontSize: '2rem',
                                        }
                                    }}
                                >
                                    {verse.uthmani}
                                </Typography>
                                <Typography 
                                    sx={{ 
                                        textAlign: 'left', 
                                        fontSize: '1.3rem', 
                                        color: '#37474f',
                                        '@media (max-width:600px)': {
                                            fontSize: '1.1rem',
                                        }
                                    }}
                                >
                                    {verse.english}
                                </Typography>
                            </Box>
                        </Box>
                    ))
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
                                '@media (max-width:600px)': {
                                    width: '90%',
                                    padding: 2,
                                }
                            }}
                        >
                            <Skeleton
                                variant="rectangular"
                                width="10%"
                                height={50}
                                sx={{ marginRight: 3 }}
                            />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton width="90%" height={30} sx={{ marginBottom: 1 }} />
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
