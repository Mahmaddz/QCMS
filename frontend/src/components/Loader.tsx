import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
// import Header from '../layout/Header';

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
                <CircularProgress size={80}/>
            </Box>
        );
    }

    return null;
};

export default Loader;
