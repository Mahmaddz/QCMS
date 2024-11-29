import { Box, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MatTableProps } from "../interfaces/MatTable";

const paginationModel = { page: 0, pageSize: 5 };
const pageSizeOption = [5,10,15,20,30,50]

export default function MatTable({rowz, columnz, widthIn=100}: MatTableProps) {
    return (
        <Box
            sx={{
                padding: { xs: "10px", md: "20px" },
                display: "flex",
                justifyContent: widthIn === 100 ? "center" : "left",
                marginTop: -5,
                flexGrow: 1
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
                            padding: { xs: "8px", md: "12px" }, // Reduced padding for mobile view
                            borderBottom: "2px solid #1a73e8",
                            textAlign: "center",
                            color: "#444",
                            fontSize: { xs: "12px", md: "14px" }, // Smaller font on mobile
                            whiteSpace: "normal", // Allow text to wrap
                            wordWrap: "break-word"
                        },
                        "& .MuiDataGrid-columnHeader": {
                            borderRight: "2px solid #1a73e8",
                            backgroundColor: "#1a73e8",
                            color: "#fff",
                            fontSize: { xs: "12px", md: "16px" }, // Adjust column header font size
                            fontWeight: 700,
                            borderBottom: "3px solid #1a73e8",
                            whiteSpace: "normal" // Wrap header text on mobile
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
                            overflowX: "auto" // Allow horizontal scrolling on mobile
                        }
                    }}
                />
            </Paper>
        </Box>
    );
}
