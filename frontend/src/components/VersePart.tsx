import { Box, Tooltip, Typography } from '@mui/material'
import React, { memo } from 'react'
import uniqueID from '../utils/helper/UniqueID'
import { ArabicServices } from 'arabic-services'
import { openNewTab } from '../utils/functions/openNewTab'
import { ReviewBodyProps } from '../interfaces/ReviewBody'

const VersePart = ({ verses, selectedKeywords, selectedLanguage, searchMethod }: ReviewBodyProps) => {

    const handleShowResultAgainstTerm = (term: string) => {
        const data = {
            search: term
        }
        openNewTab('/', data);
    }

    const isCharacterInArabicWord = (arabicWord: string, position: string) => {
        if (arabicWord === 'هُوَ') {
            console.group('start');
            console.log(arabicWord);
            console.log(typeof position);
            console.log(verses.wordId)
            console.log(verses.arabicWord)
            console.groupEnd();
        }
        return verses.wordId?.includes(position) && ArabicServices.removeTashkeel(arabicWord).includes(ArabicServices.removeTashkeel(verses.arabicWord || ""));
    }

    const getColorForMatchWord = (word1: string, word2: string) => {
        return ArabicServices.removeTashkeel(word1) === ArabicServices.removeTashkeel(word2)
    }

    const getColor = (word: string, position: number) => {
        if (searchMethod?.method.split(' ').includes('isReference') && isCharacterInArabicWord(word, position.toString())) {
            return '#CCCC00';
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
                    paddingRight: 9,
                    textAlign: { xs: "center", sm: "center" },
                    marginLeft: { sm: 2, xs: 6 },
                    marginRight: { sm: 2 },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 1,
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
                                            fontSize: "3",
                                            fontWeight: 500,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        <b>POS Tag:</b> {verse.PoS_tags}
                                    </Typography>
                                    <Typography
                                        key={uniqueID()}
                                        sx={{
                                            fontSize: "3",
                                            fontWeight: 500,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        <b>Stem Pattern:</b> {verse.Stem_pattern}
                                    </Typography>
                                    {
                                        verses.wordId?.includes(`${index+1}`) && verses?.conceptArabic && isCharacterInArabicWord(verse.word, `${index+1}`) &&
                                        <Typography
                                            key={uniqueID()}
                                            sx={{
                                                fontSize: "3",
                                                fontWeight: 500,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            <b>Concept Arabic:</b> {verses.conceptArabic}
                                        </Typography>
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
                                    color: getColor(verse.word, index+1),
                                    fontSize: { xs: '1.8rem', sm: '2.125rem' },
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
                                {verse.word}
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
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        maxWidth: { sm: 900 },
                        textAlign: 'center',
                        margin: '0 auto'
                    }}
                >
                    { verses.translation.filter((verse) => verse.language.code === selectedLanguage)[0]?.text }
                </Typography>
            </Box>
        </React.Fragment>
    )
}

export default memo(VersePart);