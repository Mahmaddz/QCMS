/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Box, Divider, IconButton, Pagination, Skeleton, Tooltip, Typography, CircularProgress } from "@mui/material";
import { RBL_Params } from "../interfaces/ReviewBodyList";
import uniqueID from "../utils/helper/UniqueID";
import { Tags } from "../utils/Table/ReviewTabs/Tags";
import ReviewBody from "./ReviewBody";
import { getAyaWords } from "../services/Ayaat/getAyaWords";
import { VerseWordsArr } from "../interfaces/ReviewBody";
import { ArrowBack, ArrowForward, FirstPage, LastPage } from "@mui/icons-material";
import { UniqueColorGenerator } from "../utils/functions/UniqueColorGenerator";
import { getAllLanguages } from "../services/Language/getLanguages";
import { LanguageType } from "../interfaces/Language";
import LanguageSelect from "./LanguageSelect";

const ReviewBodyList = ({ showTags, searchData, selectedKeywords, currentSearchMethod }: RBL_Params) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const dividerRef = useRef<HTMLDivElement | null>(null);
    const [verseWords, setVerseWords] = useState<VerseWordsArr[]>([]);
    const [wordsWithColor, setWordsWithColor] = useState<{word: string, color: string}[]>([]);
    const colorGenerator = new UniqueColorGenerator();


    useEffect(() => {
        setWordsWithColor(selectedKeywords.map(val => ({ 
            word: val, 
            color: colorGenerator.getSearchTypeColor(currentSearchMethod, val),
        })));
    }, [selectedKeywords])
    
    const [listOfLanguages, setListOfLanguages] = useState<LanguageType[]>([]);
    const [selectedLanguage, setSelectedLanguages] = useState<LanguageType>();

    useEffect(() => {
        (async () => {
            const resposne = await getAllLanguages();
            if (resposne.success) {
                setListOfLanguages(resposne.data);
                setSelectedLanguages(resposne.data[0]);
            }
        })()
    }, [])

    useEffect(() => {
        setCurrentPage(1);
    }, [searchData]);

    const handleGetAyaWordsAPI = async (sura: string | number, aya: string | number) => {
        const response = await getAyaWords(sura as string, [aya as string]);
        return response;
    }

    useEffect(() => {
        const time = setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            currentPage !== 1 && dividerRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 1000);
        return () => clearTimeout(time);
    }, [verseWords])

    useEffect(() => {
        setVerseWords([]);
        const fetchResolvedData = async () => {
            if (!paginatedData) {
                setVerseWords([]);
                return;
            }
        
            colorGenerator.reset();
            const uniqueVerseWords = new Map<string, VerseWordsArr>();
            const position: { [key: string]: string[] } = {};
            const words: { [key: string]: string[] } = {};
        
            const responses = await Promise.all(
                paginatedData.map((p) => handleGetAyaWordsAPI(p.suraNo, p.ayaNo))
            );
        
            for (let i = 0; i < paginatedData.length; i++) {
                const p = paginatedData[i];
                const response = responses[i];
        
                if (!response.success) continue;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const transformedAya = response.ayat.map((aya: any) => ({
                    Chapter: aya.Chapter,
                    Verse: aya.Verse,
                    PoS_tags: aya.PoS_tags,
                    Stem_pattern: aya.Stem_pattern,
                    word: aya.word,
                    wordUndiacritizedNoHamza: aya.wordUndiacritizedNoHamza,
                }));
        
                const key = `${p.suraNo}-${p.ayaNo}`;
                const uniqueKey = `${transformedAya[0].Chapter}-${transformedAya[0].Verse}`;
        
                if (!position[key]) position[key] = [];
                if (!words[key]) words[key] = [];
                if (p.wordId) position[key].push(p.wordId.toString());
                if (p.arabicWord) words[key].push(p.arabicWord.toString());
        
                const existingEntry = uniqueVerseWords.get(uniqueKey);
        
                if (existingEntry) {
                    existingEntry.wordId = position[key];
                    existingEntry.arabicWord = words[key];
                } else {
                    uniqueVerseWords.set(uniqueKey, {
                        ayat: transformedAya,
                        suraName: `${transformedAya[0].Chapter}:${transformedAya[0].Verse} - ${response.suraName}`,
                        translation: response.translation,
                        arabicWord: words[key],
                        conceptArabic: p.conceptArabic,
                        wordId: position[key],
                        tags: response.tags,
                    });
                }
            }
            setVerseWords(Array.from(uniqueVerseWords.values()));
        };

        const time = setTimeout(() => {
            fetchResolvedData();
        }, 1000);

        return () => clearTimeout(time);
    }, [currentPage, searchData]);
    

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = searchData?.slice(startIndex, endIndex) || [];
    const totalPages = searchData ? Math.ceil(searchData.length / itemsPerPage) : 0;

    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        setCurrentPage(newPage);
    };
    

    return (
        <>
            {
                searchData?.length !== 0 &&
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px', width: '85%', gap: 3, marginTop: { sm: -8, xs: -6 } }}>
                    <Typography variant="body2" sx={{ color: 'primary.main'}}>
                        {totalPages !== 0 && <><b>Verses: </b>{" "}{verseWords.length || <CircularProgress size={17}/>}</> }
                    </Typography>
                </Box>
            }

            <Box ref={dividerRef}>
                <Divider
                    sx={{ width: "80%", margin: "20px auto", height: "3px", backgroundColor: "primary.main" }}
                />
            </Box>

            <LanguageSelect listOfLanguages={listOfLanguages} handleChange={(item: LanguageType) => setSelectedLanguages(item)}/>

            {
                searchData?.length && verseWords.length === 0 &&
                Array.from({ length: 5 }).map((_, index) => (
                    <Box 
                        key={index} 
                        sx={{ 
                            marginBottom: 4, 
                            backgroundColor: "#f9f9f9",
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", 
                            borderBottom: "1px solid #E0E0E0",
                            padding: { xs: 2, sm: 4 },
                            gap: { xs: 2, sm: 4 },
                            flexDirection: { xs: "column", sm: "row" },
                            borderRadius: 2,
                            width: { xs: "90%", sm: "70%" },
                            margin: "0 auto",
                            marginTop: 4
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Skeleton
                                variant="rectangular"
                                width={80}
                                height={30}
                                sx={{
                                    alignSelf: { xs: "center", sm: "flex-start" },
                                }}
                            />
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    width: "100%",
                                    textAlign: { xs: "center", sm: "left" },
                                    marginX: { xs: 0, sm: 2 },
                                    marginTop: { xs: 2, sm: 0 },
                                }}
                            >
                                <Skeleton
                                    variant="text"
                                    width="90%"
                                    height={40}
                                    sx={{
                                        marginX: { xs: "auto", sm: 0 },
                                    }}
                                />
                                <Skeleton
                                    variant="text"
                                    width="80%"
                                    height={20}
                                    sx={{
                                    marginTop: 1,
                                        marginX: { xs: "auto", sm: 0 },
                                    }}
                                />
                            </Box>
                            <Skeleton variant="circular" width={32} height={32} />
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: { xs: 1, sm: 2 },
                                marginTop: 2,
                                justifyContent: "center",
                            }}
                        >
                            {Array.from({ length: 6 }).map((_, chipIndex) => (
                                <Skeleton
                                    key={chipIndex}
                                    variant="rounded"
                                    width={120}
                                    height={32}
                                    sx={{
                                        borderRadius: "16px",
                                        backgroundColor: "#e0e0e0",
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                ))
            }

            {verseWords.map((verse) => (
                <ReviewBody
                    key={uniqueID()}
                    verses={verse}
                    tags={Tags}
                    showTags={showTags}
                    selectedKeywords={wordsWithColor}
                    selectedLanguage={selectedLanguage?.code || 0}
                    searchMethod={currentSearchMethod}
                />
            ))}

            {searchData && searchData.length > 0 && (verseWords.length > 0) && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={3}
                    mb={10}
                >
                    <Tooltip title="First Page" arrow>
                        <span>
                            <IconButton
                                onClick={(e) => handlePageChange(e, 1)}
                                sx={{
                                    color: currentPage === 1 ? "gray" : "primary.main",
                                    transition: "transform 0.3s ease",
                                    "&:hover": { transform: "scale(1.1)" },
                                }}
                                disabled={currentPage === 1}
                            >
                                <FirstPage />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Previous Page" arrow>
                        <span>
                            <IconButton
                                onClick={(e) => handlePageChange(e, currentPage - 1)}
                                sx={{
                                    color: currentPage === 1 ? "gray" : "primary.main",
                                    transition: "transform 0.3s ease",
                                    "&:hover": { transform: "scale(1.1)" },
                                }}
                                disabled={currentPage === 1}
                            >
                                <ArrowBack />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        hideNextButton
                        hidePrevButton
                        color="primary"
                        siblingCount={1}
                        boundaryCount={1}
                        sx={{
                            "& .MuiPaginationItem-root": {
                                fontSize: "1rem",
                                fontWeight: "bold",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    backgroundColor: "primary.light",
                                    color: "white",
                                },
                            },
                            "& .Mui-selected": {
                                backgroundColor: "primary.main",
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "primary.dark",
                                },
                            },
                        }}
                    />

                    <Tooltip title="Next Page" arrow>
                        <span>
                            <IconButton
                                onClick={(e) => handlePageChange(e, currentPage + 1)}
                                sx={{
                                    color: currentPage === totalPages ? "gray" : "primary.main",
                                    transition: "transform 0.3s ease",
                                    "&:hover": { transform: "scale(1.1)" },
                                }}
                                disabled={currentPage === totalPages}
                            >
                                <ArrowForward />
                            </IconButton>
                        </span>
                    </Tooltip>
                
                    <Tooltip title="Last Page" arrow>
                        <span>
                            <IconButton
                                onClick={(e) => handlePageChange(e, totalPages)}
                                sx={{
                                    color: currentPage === totalPages ? "gray" : "primary.main",
                                    transition: "transform 0.3s ease",
                                    "&:hover": { transform: "scale(1.1)" },
                                }}
                                disabled={currentPage === totalPages}
                            >
                                <LastPage />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            )}
        </>
    );
};

export default ReviewBodyList;
