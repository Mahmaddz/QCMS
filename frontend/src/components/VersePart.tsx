/* eslint-disable no-misleading-character-class */
import { Box, Tooltip, Typography } from '@mui/material'
import React, { memo } from 'react'
import uniqueID from '../utils/helper/UniqueID'
import { ArabicServices } from 'arabic-services'
import { openNewTab } from '../utils/functions/openNewTab'
import { ReviewBodyProps } from '../interfaces/ReviewBody'
import { Marker } from "react-mark.js";

const VersePart = ({ verses, selectedKeywords, selectedLanguage, searchMethod }: ReviewBodyProps) => {

    const normalizeText = (str: string[]) => 
        str.map(singleWord => 
            singleWord
                .replace(/[\u06E6\u0670]/g, "")
                .replace(/ى[\u064E\u0653]?/g, "ي")
                .replace(/ا\u0653/g, "ا") 
                .replace(/[\u06E5\u0653]/g, "")
        );

    const handleShowResultAgainstTerm = (term: string) => {
        const data = {
            search: term
        }
        openNewTab('/', data);
    }

    const isCharacterInArabicWord = (position: string) => {
        return verses.wordId?.includes(position);
    }

    const getColorForMatchWord = (word1: string, word2: string) => {
        return ArabicServices.removeTashkeel(word1) === ArabicServices.removeTashkeel(word2)
    }

    const getColor = (word: string, position: number) => {
        if (searchMethod?.method.split(' ').includes('isReference') && isCharacterInArabicWord(position.toString())) {
            return 'text.primary';
        }
        if (searchMethod?.method.split(' ').includes('isDefault')) {
            return selectedKeywords?.filter(select => getColorForMatchWord(select.word, word))[0]?.color || 'text.primary';
        }
        return 'text.primary';
    };

    return (
        <React.Fragment>
            <Box
                sx={{
                    flexGrow: 1,
                    paddingRight: { xs: 2, sm: 9 },
                    textAlign: "center",
                    marginLeft: { xs: 2, sm: 6 },
                    marginRight: { xs: 2, sm: 2 },
                }}
            >
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
                    {verses.ayat.map((verse, index) => (
                        <Tooltip 
                            key={uniqueID()}
                            title={
                                <>
                                    <Typography
                                        key={uniqueID()}
                                        sx={{
                                            fontSize: "0.75rem",
                                            fontWeight: 500,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        <b>POS Tag:</b> {verse.PoS_tags}
                                    </Typography>
                                    <Typography
                                        key={uniqueID()}
                                        sx={{
                                            fontSize: "0.75rem",
                                            fontWeight: 500,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        <b>Stem Pattern:</b> {verse.Stem_pattern}
                                    </Typography>
                                    {verses.wordId?.includes(`${index + 1}`) &&
                                        verses?.conceptArabic &&
                                        isCharacterInArabicWord(`${index + 1}`) && (
                                            <Typography
                                                key={uniqueID()}
                                                sx={{
                                                    fontSize: "0.75rem",
                                                    fontWeight: 500,
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                <b>Concept Arabic:</b> {verses.conceptArabic}
                                            </Typography>
                                        )}
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
                                    color: getColor(verse.word, index + 1),
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
                                }}
                                onClick={() => handleShowResultAgainstTerm(verse.word)}
                            >
                                {verses.wordId?.includes(`${index + 1}`) ? (
                                    <Marker mark={normalizeText(verses.arabicWord || [])}>
                                        {verse.word}
                                    </Marker>
                                ) : (
                                    verse.word
                                )}
                            </Typography>
                        </Tooltip>
                    ))}
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
                    {verses.translation.filter((verse) => verse.language.code === selectedLanguage)[0]?.text}
                </Typography>
            </Box>
        </React.Fragment>
    );
    
}

export default memo(VersePart);