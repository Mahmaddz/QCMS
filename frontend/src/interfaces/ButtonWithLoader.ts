import { SxProps, Theme } from "@mui/material";

export interface LoadingButtonProps {
    text: string;
    loading: boolean;
    onClick?: () => void;
    fullWidth?: boolean;
    sx?: SxProps<Theme>;
}