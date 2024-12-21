import React from 'react';
import { LinearProgress, Box } from '@mui/material';

export default function StatusBar() {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const computeProgress = () => {
            const scrolled = document.documentElement.scrollTop;
            const scrollLength = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (100 * scrolled) / scrollLength;
            setProgress(progress);
        };
        window.addEventListener('scroll', computeProgress);
        return () => window.removeEventListener('scroll', computeProgress);
    }, []);

    return (
        <Box
            style={{
                position: 'fixed',
                width: '100%',
            }}
        >
            <LinearProgress variant="determinate" value={progress} color='success'/>
        </Box>
    );
}
