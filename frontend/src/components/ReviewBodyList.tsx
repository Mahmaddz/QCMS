import { useEffect, useRef, useState } from "react";
import { Box, Divider, IconButton, Pagination, Tooltip } from "@mui/material";
import { RBL_Params } from "../interfaces/ReviewBodyList";
import uniqueID from "../utils/helper/UniqueID";
import { Tags } from "../utils/Table/ReviewTabs/Tags";
import ReviewBody from "./ReviewBody";
import { getAyaWords } from "../services/Ayaat/getAyaWords";
import { VerseWordsArr } from "../interfaces/ReviewBody";
import { ArrowBack, ArrowForward, FirstPage, LastPage } from "@mui/icons-material";

const ReviewBodyList = ({ showTags, searchData }: RBL_Params) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const dividerRef = useRef<HTMLDivElement | null>(null);

    const [verseWords, setVerseWords] = useState<VerseWordsArr[]>([]);

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
                paginatedData.forEach(async (p) => {
                    const response = await handleGetAyaWordsAPI(p.suraNo, p.ayaNo);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const transformedAya = response.ayat.map((aya: any) => ({
                        Chapter: aya.Chapter,
                        Verse: aya.Verse,
                        PoS_tags: aya.PoS_tags,
                        Stem_pattern: aya.Stem_pattern,
                        word: aya.word,
                        wordUndiacritizedNoHamza: aya.wordUndiacritizedNoHamza,
                    }));
                    setVerseWords((prev) => ([
                        ...prev,
                        { ayat: transformedAya, suraName: `${transformedAya[0].Chapter}:${transformedAya[0].Verse} - ${response.suraName}` },
                    ]));
                });
            }
        };
        const time = setTimeout(() => {
            fetchResolvedData();
        }, 1000);
        return () => clearTimeout(time);
    }, [currentPage, searchData]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = searchData?.slice(startIndex, endIndex);
    const totalPages = searchData ? Math.ceil(searchData.length / itemsPerPage) : 0;

    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        setCurrentPage(newPage);
    };
    

    return (
        <>
            <Box ref={dividerRef}>
                <Divider
                    sx={{ width: "80%", margin: "20px auto", height: "3px", backgroundColor: "primary.main" }}
                />
            </Box>

            {verseWords.map((a) => (
                <ReviewBody
                    key={uniqueID()}
                    verses={a}
                    tags={Tags}
                    showTags={showTags}
                    isLoading={paginatedData?.length !== verseWords.length}
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
                        showFirstButton
                        showLastButton
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
