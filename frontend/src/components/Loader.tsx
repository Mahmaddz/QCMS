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

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

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
                {/* <Header/> */}
                <CircularProgress />
            </Box>
        );
    }

    return null;
};

export default Loader;
