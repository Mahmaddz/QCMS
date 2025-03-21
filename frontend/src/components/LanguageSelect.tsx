import React, { useState, useCallback } from 'react';
import TranslateIcon from '@mui/icons-material/Translate';
import CircularProgress from '@mui/material/CircularProgress';
import { LanguageType } from '../interfaces/Language';
import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import uniqueID from '../utils/helper/UniqueID';

const LanguageSelect = React.memo(({ listOfLanguages = [], handleChange }: { listOfLanguages: LanguageType[]; handleChange: (item: LanguageType) => void; }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    const handleButtonClick = useCallback(() => {
        setIsOpen((prevState) => !prevState);
        setSelectedValue(`${listOfLanguages[1].language.code} - ${listOfLanguages[1].authorName} [${listOfLanguages[1].language.name}]`);
    }, [listOfLanguages]);

    const handleLanguageChange = useCallback(
        (_event: unknown, value: string | null) => {
            setIsLoading(true);
            if (!value) return;
            const selectedLanguage = listOfLanguages?.find((val) => val.id === Number.parseInt(value[0]));
            if (selectedLanguage) {
                handleChange(selectedLanguage);
                setSelectedValue(value);
            }
            else {
                setSelectedValue(`${listOfLanguages[1].language.code} - ${listOfLanguages[1].authorName} [${listOfLanguages[1].language.name}]`);
            }
            setTimeout(() => setIsLoading(false), 500);
        },
        [listOfLanguages, handleChange]
    );

    return (
        <Box
            sx={{
                position: 'fixed',
                marginTop: 20,
                left: 20,
                top: 20,
                padding: 3,
                backgroundColor: isOpen ? '#ffffff' : '',
                background: '',
                borderRadius: 2,
                boxShadow: isOpen ? 3 : '',
                // width: ,
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
                key={uniqueID()}
                options={listOfLanguages?.map(({ id, authorName, language }) => `${id} : ${id === 0 ? authorName : `${language.code} - ${authorName} [${language.name}]`}`)}
                value={selectedValue?.slice(4)}
                onChange={handleLanguageChange}
                sx={{
                    width: 300,
                    marginRight: 1,
                    fontSize: '16px',
                    maxWidth: '100%',
                    '@media (max-width: 600px)': {
                        width: 200,
                    },
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
                        '@media (max-width: 600px)': {
                            fontSize: '14px',
                            padding: '8px',
                            height: '36px',
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
                                        <CircularProgress
                                            style={{ color: '#1976d2' }}
                                            size={20}
                                        />
                                    ) : (
                                        <TranslateIcon
                                            sx={{
                                                fontSize: '24px',
                                                '@media (max-width: 600px)': {
                                                    fontSize: '18px',
                                                },
                                            }}
                                        />
                                    )}
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiInputLabel-root': {
                                fontSize: '16px',
                                '@media (max-width: 600px)': {
                                    fontSize: '14px',
                                },
                            },
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
                    '@media (max-width: 600px)': {
                        width: 30,
                        height: 30,
                    },
                }}
            >
                {isOpen ? (
                    <KeyboardArrowLeftIcon
                        sx={{
                            fontSize: 'large',
                            '@media (max-width: 600px)': {
                                fontSize: 'small',
                            },
                        }}
                    />
                ) : (
                    <KeyboardArrowRightIcon
                        sx={{
                            fontSize: 'large',
                            '@media (max-width: 600px)': {
                                fontSize: 'small',
                            },
                        }}
                    />
                )}
            </Box>
        </Box>
    );
});

export default LanguageSelect;