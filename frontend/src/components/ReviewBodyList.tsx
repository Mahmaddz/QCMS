import { useEffect, useRef, useState } from "react";
import { Box, Divider, Pagination } from "@mui/material";
import { RBL_Params } from "../interfaces/ReviewBodyList";
import uniqueID from "../utils/helper/UniqueID";
import { Tags } from "../utils/Table/ReviewTabs/Tags";
import ReviewBody from "./ReviewBody";
import { getAyaWords } from "../services/Ayaat/getAyaWords";
import { VerseWordsArr } from "../interfaces/ReviewBody";

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

        fetchResolvedData();
    }, [currentPage, searchData]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = searchData?.slice(startIndex, endIndex);
    const totalPages = searchData ? Math.ceil(searchData.length / itemsPerPage) : 0;

    const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        setCurrentPage(newPage);
        dividerRef.current?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
            window.scrollBy({ top: -100, behavior: "smooth" }); 
        }, 700);
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
                    isLoading={false}
                />
            ))}

            {searchData && searchData.length > 0 && (
                <Box display="flex" justifyContent="center" alignItems="center" mt={3} marginBottom={10}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        showFirstButton
                        showLastButton
                        color="primary"
                    />
                </Box>
            )}
        </>
    );
};

export default ReviewBodyList;
