import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { LoadingButtonProps } from "../interfaces/ButtonWithLoader";


const LoadingButton: React.FC<LoadingButtonProps> = ({ text, loading, onClick, fullWidth, sx }) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            disabled={loading}
            fullWidth={fullWidth}
            sx={{
                backgroundColor: "#0083B0",
                "&:hover": {
                    backgroundColor: "#005f6b",
                },
                textTransform: "none",
                fontSize: "1.1rem",
                py: 1.5,
                ...(sx && sx), // Allow passing custom styles via sx prop
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} // Loader icon when loading
        >
            {!loading ? text : null} {/* Show text only when not loading */}
        </Button>
    );
};

export default LoadingButton;
