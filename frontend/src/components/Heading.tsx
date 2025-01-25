import { Box, CircularProgress, Typography } from "@mui/material";
import { HeadingProps } from "../interfaces/Heading";

export default function Heading ({data, horizontalPosition='center', isLoading=false}: HeadingProps) {
    return (
        <Box sx={{ padding: '30px', display: 'flex', justifyContent: horizontalPosition, width: '85%', margin: 'auto' }}>
            <Typography
                variant='h4'
                sx={{
                    fontWeight: 600,
                    color: '#1a73e8',
                    fontSize: { xs: '24px', md: '32px' },
                }}
            >
                {data}
            </Typography>
            {
                isLoading && <CircularProgress size={30} sx={{ ml: 2 }} />
            }
        </Box>
    );
}