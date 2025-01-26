import { Box, Paper, Skeleton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MatTableProps } from "../interfaces/MatTable";

const paginationModel = { page: 0, pageSize: 5 };
const pageSizeOption = [5,10,15,20,30,50]

export default function MatTable({rowz, columnz, isLoading=false}: MatTableProps) {
    return (
        <Box
            sx={{
                padding: { xs: "10px", md: "20px" },
                display: "flex",
                justifyContent: "center",
                flexGrow: 1,
                margin: '0 auto',
                marginTop: -5,
            }}
        >
            <Paper
                sx={{
                    height: { xs: "400px", md: "600px" },
                    width: '100%',
                    maxWidth: "90%",
                    padding: { xs: "15px", md: "25px" },
                    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
                    borderRadius: "15px",
                    backgroundColor: "#fafafa",
                    overflow: "auto"
                }}
            >
                {
                    isLoading ? (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                height: "100%",
                                justifyContent: "center"
                            }}
                        >
                            {Array.from({ length: 8 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    variant="rectangular"
                                    height={40}
                                    animation="wave"
                                    sx={{
                                        width: "100%",
                                        maxWidth: "100%",
                                        borderRadius: "8px"
                                    }}
                                />
                            ))}
                        </Box>
                    ) : (
                        <DataGrid
                            rows={rowz}
                            columns={columnz}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={pageSizeOption}
                            checkboxSelection
                            getRowHeight={() => "auto"}
                            sx={{
                                border: "2px solid #1a73e8",
                                borderRadius: "10px",
                                backgroundColor: "#fff",
                                "& .MuiDataGrid-cell": {
                                    padding: { xs: "8px", md: "12px" },
                                    borderBottom: "2px solid #1a73e8",
                                    textAlign: "center",
                                    color: "#444",
                                    fontSize: { xs: "12px", md: "14px" },
                                    whiteSpace: "normal",
                                    wordWrap: "break-word"
                                },
                                "& .MuiDataGrid-columnHeader": {
                                    borderRight: "2px solid #1a73e8",
                                    backgroundColor: "#1a73e8",
                                    color: "#fff",
                                    fontSize: { xs: "12px", md: "16px" },
                                    fontWeight: 700,
                                    borderBottom: "3px solid #1a73e8",
                                    whiteSpace: "normal"
                                },
                                "& .MuiDataGrid-row": {
                                    borderBottom: "1px solid #e0e0e0",
                                    "&:hover": {
                                        backgroundColor: "#f1f9ff"
                                    }
                                },
                                "& .MuiDataGrid-cellCheckbox": {
                                    borderRight: "2px solid #1a73e8"
                                },
                                "& .MuiDataGrid-cell--withRenderer": {
                                    borderRight: "2px solid #1a73e8"
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                    overflowX: "auto"
                                }
                            }}
                        />
                    )
                }
            </Paper>
        </Box>
    );
}
