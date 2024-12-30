import { useState } from 'react';
import TranslateIcon from '@mui/icons-material/Translate';
import CircularProgress from '@mui/material/CircularProgress';
import { LanguageType } from '../interfaces/Language';
import { Autocomplete, Box, InputAdornment, TextField } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

const LanguageSelect = ({ listOfLanguages, handleChange }: { listOfLanguages: LanguageType[]; handleChange: (item: LanguageType) => void; }) => {
    const [isOpen, setIsOpen] = useState(false); // State to manage pop-up visibility

    const handleButtonClick = () => {
        setIsOpen(!isOpen); // Toggle pop-up visibility
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                marginTop: 10,
                left: 20,
                top: 20,
                padding: 3,
                backgroundColor: '#ffffff',
                borderRadius: 2,
                boxShadow: 3,
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
                options={listOfLanguages.filter((item) => [1,2,3,4,5].includes(item.id)).map((item) => `${item.code}: ${item.name}`)}
                onChange={(_event, value) => {
                    const selectedLanguage = listOfLanguages.filter((val) => val.code === value?.split(':')[0])[0];
                    handleChange(selectedLanguage);
                }}
                sx={{
                    width: 300,
                    marginRight: 1,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
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
                                {listOfLanguages.length > 0 ? (
                                    <TranslateIcon style={{ color: '#1976d2' }} />
                                ) : (
                                    <CircularProgress style={{ color: '#1976d2' }} size={20} />
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
};

export default LanguageSelect;
