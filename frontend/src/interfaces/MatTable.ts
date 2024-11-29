import { GridColDef, GridValidRowModel } from "@mui/x-data-grid";

export interface MatTableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowz: any[] | undefined, columnz: GridColDef<GridValidRowModel>[], widthIn?: number
}