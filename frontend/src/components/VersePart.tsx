import { Box, Tooltip, Typography } from '@mui/material'
import React, { memo } from 'react'
import uniqueID from '../utils/helper/UniqueID'
import { ArabicServices } from 'arabic-services'
import { openNewTab } from '../utils/functions/openNewTab'
import { ReviewBodyProps } from '../interfaces/ReviewBody'

const VersePart = ({ verses, selectedKeywords, selectedLanguage }: ReviewBodyProps) => {

    const handleShowResultAgainstTerm = (term: string) => {
        const data = {
            search: term
        }
        openNewTab('/', data);
    }

    const getColor = (word: string) => {
        return selectedKeywords?.filter(select => ArabicServices.removeTashkeel(select.word) === ArabicServices.removeTashkeel(word))[0]?.color || 'text.primary'
    }

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
                    {verses.ayat.map((verse) => (
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