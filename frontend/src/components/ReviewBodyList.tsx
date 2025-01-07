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

const ReviewBodyList = ({ showTags, searchData, selectedKeywords }: RBL_Params) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const dividerRef = useRef<HTMLDivElement | null>(null);
    const [verseWords, setVerseWords] = useState<VerseWordsArr[]>([]);
    const [wordsWithColor, setWordsWithColor] = useState<{word: string, color: string}[]>([]);
    const colorGenerator = new UniqueColorGenerator();


    useEffect(() => {
        setWordsWithColor(selectedKeywords.map(val => ({ 
            word: val, 
            color: colorGenerator.generateUniqueColor() 
        })));
    }, [selectedKeywords])
    
    const [listOfLanguages, setListOfLanguages] = useState<LanguageType[]>([]);
    const [selectedLanguage, setSelectedLanguages] = useState<LanguageType>();

    useEffect(() => {
        (async () => {
            const resposne = await getAllLanguages();
            setListOfLanguages(resposne.data);
            setSelectedLanguages(resposne.data[0]);
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
            if (paginatedData) {
                colorGenerator.reset();
                const newVerseWords: VerseWordsArr[] = [];
                for (const p of paginatedData) {
                    const response = await handleGetAyaWordsAPI(p.suraNo, p.ayaNo);
                    if (!response.success) return;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const transformedAya = response.ayat.map((aya: any) => ({
                        Chapter: aya.Chapter,
                        Verse: aya.Verse,
                        PoS_tags: aya.PoS_tags,
                        Stem_pattern: aya.Stem_pattern,
                        word: aya.word,
                        wordUndiacritizedNoHamza: aya.wordUndiacritizedNoHamza,
                    }));
                    newVerseWords.push({
                        ayat: transformedAya,
                        suraName: `${transformedAya[0].Chapter}:${transformedAya[0].Verse} - ${response.suraName}`,
                        translation: response.translation,
                    });
                }
                setVerseWords(newVerseWords);
            } else {
                setVerseWords([]);
            }
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
                verseWords.length !== paginatedData.length && 
                Array.from({ length: 5 }).map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: { xs: 2, sm: 4 },
                            gap: { xs: 1, sm: 2 },
                            borderBottom: '1px solid #E0E0E0',
                            flexDirection: { xs: 'column', sm: 'row' },
                            backgroundColor: '#f9f9f9',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                            borderRadius: 2,
                            width: '70%',
                            margin: '0 auto'
                        }}
                    >
                        <Skeleton variant="rectangular" width={120} height={30} />
                        <Box
                            sx={{
                                flexGrow: 1,
                                paddingRight: 9,
                                textAlign: { xs: 'center', sm: 'center' },
                                marginLeft: { sm: 2, xs: 6 },
                                marginRight: { sm: 2 },
                            }}
                        >
                            <Skeleton variant="text" width="100%" height={40} />
                            <Skeleton variant="text" width="90%" height={20} />
                        </Box>
                        <Skeleton variant="circular" width={32} height={32} />
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
                />
            ))}

            {searchData && searchData.length > 0 && (paginatedData?.length === verseWords.length) && (
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
