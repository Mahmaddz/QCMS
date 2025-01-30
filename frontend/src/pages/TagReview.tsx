import React, { useEffect, useState } from "react";
import MatTable from "../components/MatTable";
import Header from "../layout/Header";
import { TagReviewCol } from "../utils/Table/TagReviewer/Columns";
import Heading from "../components/Heading";
import { getTagReviewData } from "../services/Tags/getTagReviewData.service";
import { TagDetails } from "../interfaces/TagDetails";

export default function TagReview() {

    const [tagDetails, setTagDetails] = useState<TagDetails[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const response = await getTagReviewData();
            if (response.success) {
                setIsLoading(false);
                setTagDetails(response.data);
            }
        })()
    }, [])
    
    return (
        <React.Fragment>
            <Header />
            <Heading data={"Tag Review"} horizontalPosition="left"/>
            <MatTable rowz={tagDetails} columnz={TagReviewCol(setTagDetails)} isLoading={isLoading}/>
        </React.Fragment>
    );
}