import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { componentRoutes } from '../routes/AllRoutes';
import { useAuth } from '../context/Auth/useAuth';

const PageNotFound = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const { userRole } = useAuth();

    useEffect(() => {

        // if (location.pathname === '/login') {
        //     // window.location.reload();
        // }

        console.log(userRole);
        const val = componentRoutes.filter(c => c.path === location.pathname);
        console.log(val);

        const timer = setTimeout(() => {
            setLoading(false);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            location.pathname === '/login' && window.location.reload();
        }, 3000);

        return () => clearTimeout(timer);
    }, [location.pathname, userRole]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                textAlign: 'center',
                backgroundColor: '#f0f4f7',
                padding: '2rem',
            }}
        >
            {loading ? (
                <CircularProgress size={80} color="primary" />
            ) : (
                <>
                    <Typography variant="h1" component="h1" sx={{ fontSize: '4rem', color: '#4285f4', fontWeight: 'bold' }}>
                        404
                    </Typography>

                    <Typography variant="h5" component="h2" sx={{ marginBottom: '1rem', color: '#666' }}>
                        Oops! Page not found.
                    </Typography>

                    <Typography variant="body1" component="p" sx={{ marginBottom: '2rem', color: '#999' }}>
                        It seems like the page you're looking for doesn't exist.
                    </Typography>

                    <Button variant="contained" color="primary" component={Link} to="/">
                        Go Back to Home
                    </Button>
                </>
            )}
        </Box>
    );
};

export default PageNotFound;
