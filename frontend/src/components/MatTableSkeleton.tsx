import { Box, Skeleton, TableCell, TableRow } from "@mui/material";
// import uniqueID from "../utils/helper/UniqueID";

const MatTableSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => {
    console.log(rows, columns);
    return (
        <Box
            sx={{
                height: "max-content",
                width: '70%',
                margin: '0 auto',
                display: 'grid',
                placeContent: 'center'
            }}
        >
            {
                [...Array(rows)].map((row, index) => (
                    <TableRow key={index}>
                        <TableCell component="th" scope="row">
                            <Skeleton animation="wave" variant="text" />
                        </TableCell>
                        <TableCell>
                            <Skeleton animation="wave" variant="text" />
                        </TableCell>
                        <TableCell>
                            <Skeleton animation="wave" variant="text" />
                        </TableCell>
                        <TableCell>
                            <Skeleton animation="wave" variant="text" />
                        </TableCell>
                    </TableRow>
                ))
            }
        </Box>
        // <Box
        //     sx={{
        //         padding: { xs: "10px", md: "20px" },
        //         display: "flex",
        //         justifyContent: "center",
        //         marginTop: -5,
        //         flexGrow: 1,
        //     }}
        // >
        //     <Paper
        //         sx={{
        //             height: { xs: "400px", md: "600px" },
        //             width: "100%",
        //             maxWidth: "90%",
        //             padding: { xs: "15px", md: "25px" },
        //             boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
        //             borderRadius: "15px",
        //             backgroundColor: "#fafafa",
        //             overflow: "auto",
        //         }}
        //     >
        //         <Box
        //             sx={{
        //                 display: "grid",
        //                 gridTemplateColumns: `repeat(${columns}, 1fr)`,
        //                 gap: 1,
        //                 border: "2px solid #1a73e8",
        //                 borderRadius: "10px",
        //                 backgroundColor: "#fff",
        //                 padding: { xs: "8px", md: "12px" },
        //             }}
        //         >
        //             <Box
        //                 sx={{
        //                     display: "grid",
        //                     gridTemplateColumns: `repeat(${columns}, 1fr)`,
        //                     gap: 1,
        //                     backgroundColor: "#1a73e8",
        //                     padding: { xs: "8px", md: "12px" },
        //                     color: "#fff",
        //                     fontWeight: "bold",
        //                 }}
        //             >
        //                 {Array.from({ length: columns }).map((_, index) => (
        //                     <Skeleton
        //                         key={`${index}`}
        //                         variant="text"
        //                         width="80%"
        //                         height={24}
        //                         sx={{ backgroundColor: "#ffffff33", margin: "auto" }}
        //                     />
        //                 ))}
        //             </Box>

        //             {Array.from({ length: rows }).map((_, rowIndex) => (
        //                 <Box
        //                     key={`${rowIndex}`}
        //                     sx={{
        //                         display: "grid",
        //                         gridTemplateColumns: `repeat(${columns}, 1fr)`,
        //                         gap: 1,
        //                         padding: { xs: "8px", md: "12px" },
        //                         borderBottom: "1px solid #e0e0e0",
        //                     }}
        //                 >
        //                     {Array.from({ length: columns }).map((_, colIndex) => (
        //                         <Skeleton
        //                             key={`${rowIndex}-${colIndex}`}
        //                             variant="rectangular"
        //                             width="100%"
        //                             height={20}
        //                         />
        //                     ))}
        //                 </Box>
        //             ))}
        //         </Box>
        //     </Paper>
        // </Box>
    );
};

export default MatTableSkeleton;
