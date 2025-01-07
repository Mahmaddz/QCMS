import { Box, Tooltip, Typography } from '@mui/material'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import uniqueID from '../utils/helper/UniqueID'
import { ArabicServices } from 'arabic-services'
import { openNewTab } from '../utils/functions/openNewTab'
import { ReviewBodyProps } from '../interfaces/ReviewBody'

const VersePart = memo(({ verses, selectedKeywords, selectedLanguage }: ReviewBodyProps) => {
    const [visibleVerses, setVisibleVerses] = useState(verses.ayat.slice(0, 20)); // Render first 20 verses initially
    const containerRef = useRef<HTMLDivElement>(null);

    // Function to handle scroll event and load more verses
    const handleScroll = () => {
        if (!containerRef.current) return;

        const bottom = containerRef.current.getBoundingClientRect().bottom;
        const containerHeight = containerRef.current.clientHeight;

        if (bottom <= containerHeight + 100) { // Load more verses when scrolled near the bottom
            setVisibleVerses((prev) => {
                const newIndex = prev.length;
                return [...prev, ...verses.ayat.slice(newIndex, newIndex + 20)]; // Add next 20 verses
            });
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleShowResultAgainstTerm = useCallback((term: string) => {
        const data = { search: term };
        openNewTab('/', data);
    }, []);

    const getColor = useCallback(
        (word: string) => {
            return (
                selectedKeywords?.find(
                    (select) => ArabicServices.removeTashkeel(select.word) === ArabicServices.removeTashkeel(word)
                )?.color || 'text.primary'
            );
        },
        [selectedKeywords]
    );

    const translationText = useMemo(() => {
        return verses.translation.find((verse) => verse.language.code === selectedLanguage)?.text;
    }, [verses.translation, selectedLanguage]);

    return (
        <Box ref={containerRef} sx={{ flexGrow: 1, paddingRight: 9, textAlign: { xs: 'center', sm: 'center' }, marginLeft: { sm: 2, xs: 6 }, marginRight: { sm: 2 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'center', gap: 1, width: '100%' }}>
                {visibleVerses.map((verse) => (
                    <Tooltip key={uniqueID()} title={
                        <>
                            <Typography sx={{ fontSize: '3', fontWeight: 500, lineHeight: 1.5 }}>
                                <b>POS Tag:</b> {verse.PoS_tags}
                            </Typography>
                            <Typography sx={{ fontSize: '3', fontWeight: 500, lineHeight: 1.5 }}>
                                <b>Stem Pattern:</b> {verse.Stem_pattern}
                            </Typography>
                        </>
                    } placement="top" arrow>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 500,
                                color: getColor(verse.word),
                                fontSize: { xs: '1.8rem', sm: '2.125rem' },
                                cursor: 'pointer',
                                textAlign: 'center',
                                direction: 'rtl',
                                '&:hover': { color: 'secondary.main' },
                                '&:active': { color: 'primary.main' },
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
                    fontStyle: 'italic',
                    color: 'text.secondary',
                    marginTop: '4px',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    maxWidth: '90%',
                    textAlign: 'center',
                    margin: '0 auto',
                }}
            >
                {translationText}
            </Typography>
        </Box>
    );
});

export default VersePart;