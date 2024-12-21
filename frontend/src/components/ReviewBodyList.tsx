import { useEffect, useRef, useState } from "react";
import { Box, Divider, Pagination } from "@mui/material";
import { RBL_Params } from "../interfaces/ReviewBodyList";
import uniqueID from "../utils/helper/UniqueID";
import { Tags } from "../utils/Table/ReviewTabs/Tags";
import ReviewBody from "./ReviewBody";
import { getWords } from "../services/Search/getWords.service";

const ReviewBodyList = ({ showTags, searchData }: RBL_Params) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [resolvedData, setResolvedData] = useState<any[]>([]);
    const dividerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchData]);

    const handlerFunc = async (sura: string | number, aya: string | number) => {
        const response = await getWords(sura as string, aya as string);
        return response.success ? response.data : false;
    };

    useEffect(() => {
        const fetchResolvedData = async () => {
            if (paginatedData) {
                const data = await Promise.all(
                    paginatedData.map(async (a) => ({
                        ...a,
                        aya2: (a.emlaeyTextNoDiacritics || await handlerFunc(a.suraNo, a.ayaNo)) || a.conceptNameAr || a.emlaeyTextNoDiacritics,
                    }))
                );
                setResolvedData(data);
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

            {resolvedData.map((a) => (
                <ReviewBody
                    key={uniqueID()}
                    surah={a.suraAyaInfo}
                    aya1={a.uthmaniTextDiacritics}
                    aya2={a.aya2}
                    engTrans={a.englishTranslation}
                    tags={Tags}
                    showTags={showTags}
                />
            ))}

            {/* Pagination Controls */}
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
