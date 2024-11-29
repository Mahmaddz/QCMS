import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loader = ({ duration = 3000 }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (loading) {
        return (
            <Box
                sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return null;
};

export default Loader;
