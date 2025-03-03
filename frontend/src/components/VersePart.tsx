/* eslint-disable no-misleading-character-class */
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import React, { memo, useMemo, useState } from 'react'
import uniqueID from '../utils/helper/UniqueID'
import { ArabicServices } from 'arabic-services'
import { openNewTab } from '../utils/functions/openNewTab'
import { ReviewBodyProps } from '../interfaces/ReviewBody'
import { Marker } from "react-mark.js";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import DisplayTags from './DisplayTags'

const VersePart = ({ verses, selectedKeywords, searchMethod, selectedLanguage, displayNumbers=false }: ReviewBodyProps) => {

    const translation = useMemo(() => verses.translation.filter((verse) => verse.translatorId === selectedLanguage)[0]?.text || '', [selectedLanguage, verses.translation]);

    const [isCopyClicked, setIsCopyClicked] = useState<boolean>(false);

    const normalizeText = (arabicText: string) => ([
        arabicText
            .replace(/[\u06E6\u0670]/g, "")
            .replace(/ى[\u064E\u0653]?/g, "ي")
            .replace(/ا\u0653/g, "ا")
            .replace(/ا۟/g, "ا")
            .replace(/[\u06E5\u0653]/g, "")
            .replace(/^لَ/, "")
            .replace(/[\u06E5\u0653۠]/g, ""),
        arabicText
            .replace(/ن/g, "نْ")
    ]);

    const handleShowResultAgainstTerm = (term: string) => {
        const data = {
            search: term
        }
        openNewTab('/', data);
    }

    const isCharacterInArabicWord = (position: number) => {
        return verses.wordId?.includes(position);
    }

    const matchArabicWord = (word1: string, word2: string) => {
        return ArabicServices.removeTashkeel(word1) === ArabicServices.removeTashkeel(word2)
    }

    const getColor = (word: string) => {
        // if (searchMethod?.method.split(' ').includes('isReference') && isCharacterInArabicWord(position.toString())) {
        //     return 'text.primary';
        // }
        if (searchMethod?.method.split(' ').includes('isWord')) {
            return selectedKeywords?.filter(select => matchArabicWord(select, word))[0] && 'red' || 'text.primary';
        }
        return 'text.primary';
    };

    const wordSegmentToHighlight = (position: number) => verses.arabicWord?.[verses.wordId?.indexOf(position) || 0] || '' ;

    const copyHandler = (event: React.ClipboardEvent<HTMLDivElement>) => {
        event.preventDefault();
        const selectedText = window.getSelection()?.toString().replace(/\n+/g, ' ') || "";
        event.clipboardData.setData("text/plain", selectedText);
    };

    const copyToClipboard = async () => {
        setIsCopyClicked(true);
        const text = verses.ayat.map(aya => aya.word).join(' ');
        await navigator.clipboard.writeText(text);
        setTimeout(() => {
            setIsCopyClicked(false);
        }, 2000);
    }

    return (
        <React.Fragment>
            <Box
                sx={{
                    flexGrow: 1,
                    paddingRight: { xs: 2, sm: 9 },
                    textAlign: "center",
                    marginLeft: { xs: 2, sm: 6 },
                    marginRight: { xs: 2, sm: 2 },
                    position: "relative",
                }}
            >
                {
                    displayNumbers && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: 5,
                                right: { xs: -19, sm: 5 },
                                width: { xs: 30, sm: 50 },
                                height: { xs: 30, sm: 50 },
                                borderRadius: "50%",
                                backgroundColor: "#1976d2",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: "14px",
                                fontWeight: "bold",
                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                                marginLeft: 8,
                            }}
                        >
                            <Typography sx={{ fontSize: { sm: "18px", xs: "10px" }, fontWeight: "bold" }}>
                                {verses.ayat[0].Verse}
                            </Typography>
                        </Box>
                    )
                }
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: { xs: 0.5, sm: 1 },
                        width: '100%',
                    }}
                >
                    {verses.ayat.map((verse, index: number) => (
                        <Tooltip 
                            key={uniqueID()}
                            title={
                                <>
                                    <Typography
                                        key={uniqueID()}
                                        sx={{
                                            fontSize: { xs: "0.75rem", sm: 18 },
                                            fontWeight: 500,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        <b>POS Tag:</b> {verse.PoS_tags}
                                    </Typography>
                                    <Typography
                                        key={uniqueID()}
                                        sx={{
                                            fontSize: { xs: "0.75rem", sm: 18 },
                                            fontWeight: 500,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        <b>Stem Pattern:</b> {verse.Stem_pattern}
                                    </Typography>
                                    {isCharacterInArabicWord(index + 1) &&
                                        verses?.conceptArabic && (
                                            <Typography
                                                key={uniqueID()}
                                                sx={{
                                                    fontSize: { xs: "0.75rem", sm: 18 },
                                                    fontWeight: 500,
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                <b>Concept Arabic:</b> {verses.conceptArabic}
                                            </Typography>
                                        )
                                    }
                                    {isCharacterInArabicWord(index + 1) &&
                                        verses?.conceptArabic && (
                                            <Typography
                                                key={uniqueID()}
                                                sx={{
                                                    fontSize: { xs: "0.75rem", sm: 18 },
                                                    fontWeight: 500,
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                <b>{`Segment (Testing)`}</b> {wordSegmentToHighlight(index+1)}
                                            </Typography>
                                        )
                                    }
                                </>
                            }
                            placement="top" 
                            arrow 
                        >
                            <Typography
                                key={uniqueID()}
                                variant="h5"
                                sx={{
                                    fontWeight: 500,
                                    color: getColor(verse.word),
                                    fontSize: { xs: '1.2rem', sm: '2.125rem' },
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    direction: 'rtl',
                                    '&:hover': {
                                        color: 'secondary.main',
                                    },
                                    '&:active': {
                                        color: 'primary.main',
                                    },
                                    textDecoration: verses.wordId?.includes(index + 1) ? 'underline' : '',
                                    textDecorationColor: 'red',
                                }}
                                onClick={() => handleShowResultAgainstTerm(verse.word)}
                                onCopy={copyHandler}
                            >
                                <Marker mark={verses.wordId?.includes(index + 1) ? normalizeText(wordSegmentToHighlight(index+1)) : undefined}>
                                    {verse.word}
                                </Marker>
                            </Typography>
                        </Tooltip>
                    ))}
                    <Tooltip title={isCopyClicked ? "Copied!" : "Copy to clipboard"} arrow>
                        <IconButton onClick={copyToClipboard} sx={{ p: 0 }}>
                            {isCopyClicked ? (
                                <CheckCircleIcon color="success" fontSize="small" />
                            ) : (
                                <ContentCopyIcon
                                    fontSize="small"
                                    sx={{
                                        cursor: "pointer",
                                        transition: "transform 0.2s ease-in-out",
                                        color: 'green',
                                        "&:hover": {
                                            transform: "scale(1.1)",
                                        },
                                    }}
                                />
                            )}
                        </IconButton>
                    </Tooltip>
                </Box>
    
                <Typography
                    variant="body2"
                    sx={{
                        fontStyle: "italic",
                        color: "text.secondary",
                        marginTop: "4px",
                        fontSize: { xs: "0.75rem", sm: "1rem" },
                        maxWidth: { xs: '90%', sm: 900 },
                        textAlign: 'center',
                        margin: '0 auto',
                    }}
                >
                    {translation}
                </Typography>
            </Box>
        </React.Fragment>
    );
    
}

export default memo(VersePart);