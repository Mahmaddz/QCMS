import React, { useState, useCallback } from 'react';
import TranslateIcon from '@mui/icons-material/Translate';
import CircularProgress from '@mui/material/CircularProgress';
import { LanguageType } from '../interfaces/Language';
import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

const LanguageSelect = React.memo(({ listOfLanguages = [], handleChange }: { listOfLanguages: LanguageType[]; handleChange: (item: LanguageType) => void; }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleButtonClick = useCallback(() => {
        setIsOpen((prevState) => !prevState);
    }, []);

    const handleLanguageChange = useCallback(
        (_event: unknown, value: string | null) => {
            setIsLoading(true);
            const selectedLanguage = listOfLanguages?.find((val) => val.code === value?.split(':')[0]);
            if (selectedLanguage) {
                handleChange(selectedLanguage);
            }
            setTimeout(() => setIsLoading(false), 500);
        },
        [listOfLanguages, handleChange]
    );

    return (
        <Box
            sx={{
                position: 'fixed',
                marginTop: 10,
                left: 20,
                top: 20,
                padding: 3,
                backgroundColor: isOpen ? '#ffffff' : '',
                background: '',
                borderRadius: 2,
                boxShadow: isOpen ? 3 : '',
                width: 250,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                transition: 'all 0.3s ease',
                transform: isOpen ? 'translateX(0)' : 'translateX(-240px)',
            }}
        >
            <Autocomplete
                disablePortal
                options={listOfLanguages?.filter((item) => [1, 2, 3, 4, 5].includes(item.id)).map((item) => `${item.code}: ${item.name}`)}
                onChange={handleLanguageChange}
                sx={{
                    width: 300,
                    marginRight: 1,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: isOpen ? '8px' : '',
                        border: 'none',
                        backgroundColor: '#f5f5f5',
                        '&:hover': {
                            backgroundColor: '#e0e0e0',
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                            borderColor: '#1976d2',
                            boxShadow: '0 0 5px rgba(25, 118, 210, 0.5)',
                        },
                    },
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Language"
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    {isLoading ? (
                                        <CircularProgress style={{ color: '#1976d2' }} size={20} />
                                    ) : (
                                        <TranslateIcon style={{ color: '#1976d2' }} />
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
            />

            <Box
                onClick={handleButtonClick}
                sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    marginTop: 1,
                    borderRadius: '50%',
                    backgroundColor: isOpen ? '#1976d2' : '#f5f5f5',
                    color: isOpen ? '#ffffff' : '#1976d2',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    border: isOpen ? 'none' : '2px solid #1976d2',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: isOpen ? '#145a9e' : '#e0e0e0',
                        transform: 'scale(1.1)',
                    },
                }}
            >
                {isOpen ? <KeyboardArrowLeftIcon fontSize="large" /> : <KeyboardArrowRightIcon fontSize="large" />}
            </Box>
        </Box>
    );
});

export default LanguageSelect;
