import React from "react";
import MatTable from "../components/MatTable";
import Header from "../layout/Header";
import { TagReviewCol } from "../utils/Table/TagReviewer/Columns";
import { TagReviewRows } from "../utils/Table/TagReviewer/Rows";
import Heading from "../components/Heading";

// SAMPLE DATA FOR ROWS
const rows = TagReviewRows;

// interface ActivityType {
//     id: number;
//     ayatText: string;
//     sura: string;
//     ayatNo: number;
//     actType: number | string;
//     userId: number;
//     details: string | { Ar: string; En: string; Type: string };
// }

export default function TagReview() {

    // const [activity, setActivity] = useState<ActivityType[]>();

    return (
        <React.Fragment>
            <Header />
            <Heading data={"Tag Review"} horizontalPosition="left"/>
            <MatTable rowz={rows} columnz={TagReviewCol()}/>
        </React.Fragment>
    );
}