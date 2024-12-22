import { Fab } from '@mui/material';
import { useState, useEffect } from 'react'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollUpButton = () => {
    const [showScrollButton, setShowScrollButton] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {showScrollButton && (
                <Fab
                    color="primary"
                    size="small"
                    onClick={scrollToTop}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.1)',
                        },
                    }}
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            )}
        </>
    )
}

export default ScrollUpButton;