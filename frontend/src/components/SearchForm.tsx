/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography, CircularProgress, Chip, Autocomplete } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { FilterStateParams, SearchFormParam } from '../interfaces/SearchForm';
import { getQuranaInfo } from '../services/Search/getQuranaInfo.service';
import Toaster from '../utils/helper/Toaster';
// import { getAyatInfo } from '../services/Search/getAyatInfo.service';
import { searchAyats } from '../services/Search/getAyats.service';
// import FilterAltIcon from '@mui/icons-material/FilterAlt';
import uniqueID from '../utils/helper/UniqueID';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { getKhadijaReference } from '../services/Search/getKhadijaReference.service';
import { getAyatsByTag } from '../services/Search/getAyatsByTags.service';
import { surahData } from '../utils/functions/surahData';
import { Counts } from '../interfaces/service/SimpleSearch';

const SearchForm = ({ showTag, setShowTag, setSearchedResult, searchParam, selectedKeywords, setSelectedKeywords, setCurrentSearchMethod, setSearchParams }: SearchFormParam) => {

    const [ayatAbortController, setAyatAbortController] = useState<AbortController | null>(null);
    const [khadijaAbortController, setKhadijaAbortController] = useState<AbortController | null>(null);
    const [tagAbortController, setTagAbortController] = useState<AbortController | null>(null);

    const toSearch = searchParam?.get('search') || "";
    const toChk = searchParam?.get('chkbox') || 'isWord';
    const toSurah = searchParam?.get('surah') || 0;
    const toAya = searchParam?.get('aya') || 0;
    const toKeywords = searchParam?.get('selectedKeywords')?.split(' ') || [];

    const [relatedSearch, setRelatedSearch] = useState<{word: {word: string, count: number | string}, isSelected: boolean}[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [searchedCount, setSearchedCount] = useState<Counts>();
    const [checked, setChecked] = useState(2);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<FilterStateParams>({ surah: toSurah, aya: toAya });
    const [search, setSearch] = useState<string>(toSearch);
    const [chkbox, setChkBox] = useState({
        isLemma: false,
        isTag: toChk.split(' ').includes('isTag'),
        isReference: toChk.split(' ').includes('isReference'),
        isWord: toChk.split(' ').includes('isWord'),
        isQurana: false,
        isQurany: false
    }); 
    const [rootLemmaData, setRootLemmaData] = useState<{ root: string; lemmas: { [lemma: string]: {word: string, count: string | number}[]; }; }[]>([]);

    const filteredCheckBoxes =  Object.entries(chkbox).filter(([, value]) => value).map(([key]) => key).join(' ');

    useEffect(() => {
        const time = setTimeout(async () => {
            if (toKeywords.length) {
                // setSelectedKeywords(toKeywords);
                await getResultBasedOnSuggestedWords(toKeywords);
            } else if (toSearch.length) {
                await getResult(undefined);
            }
        }, 500);
        return () => clearTimeout(time)
    }, [])

    const handleChangeSearch = (value: string) => { 
        setSearch(value);
        setCurrentSearchMethod((prev) => ({
            ...prev,
            search: value,
        }));
    };

    useEffect(() => {
        setCurrentSearchMethod((prev) => ({
            ...prev,
            method: filteredCheckBoxes,
        }));
    }, [chkbox])

    const handleChangeCheckBoxes = (e: React.SyntheticEvent<Element, Event>, checked: boolean) => {
        e.preventDefault();
        const {name} = e.target as HTMLInputElement;
        setChkBox((prev) => ({
            ...prev,
            [name]: checked
        }));
        setCurrentSearchMethod((prev) => ({
            ...prev,
            method: name,
        }));
        // setChkBox((prev) => {
        //     const updatedState: CheckboxState = Object.keys(prev).reduce((acc, key) => {
        //         acc[key as keyof CheckboxState] = key === name ? checked : false;
        //         return acc;
        //     }, {} as CheckboxState);
        //     return updatedState;
        // });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterUniqueBySura = (array: any[]) => {
        return array?.filter((item, index, self) =>
            index === self.findIndex((t) => t.suraNo === item.suraNo && t.ayaNo === item.ayaNo)
        ) || [];
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleResultantResponse = (data: any[]) => {
        setLoading(false);
        setSearchedResult((prev) => {
            const tempData =  filterUniqueBySura(prev?.length ? [...prev, ...data] : [...data]);
            setSearchedCount((prev) => ({
                verseCount: tempData?.length ?? 0,
                wordCount: prev?.wordCount ?? 0,
            }));
            return filteredCheckBoxes === 'isWord' ? tempData : tempData.sort((a, b) => (a.suraNo - b.suraNo) || (a.ayaNo - b.ayaNo));
        });
    }

    const getReferenceData = async () => {
        if (khadijaAbortController) {
            khadijaAbortController.abort();
        }
        const abortController = new AbortController();
        setKhadijaAbortController(abortController);
        const response = await getKhadijaReference(search, filter.surah as string || null, filter.aya as string || null);
        if (response.success) {
            handleResultantResponse(response.data);
        }
        else if (!response.success) {
            setLoading(false);
        }
    }

    const getResult = async (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined, searchValue?: string | undefined) => {
        e?.preventDefault();

        if (!searchValue && !search) {
            Toaster("Search is Empty", 'warn')
            return;
        }

        if (searchValue) setSearch(searchValue);

        setLoading(true);
        setSuggestions([]);
        setSearchedResult(()=>[]);
        setSearchedCount({ verseCount: 0, wordCount: 0 });
        setSelectedKeywords([]);
        setRelatedSearch([]);
        setRootLemmaData([]);

        setChecked(Object.values(chkbox).filter(value => value === true).length + 1);

        if (!(chkbox.isLemma || chkbox.isQurana || chkbox.isQurany || chkbox.isTag || chkbox.isWord || chkbox.isReference)) {
            Toaster("Click on Checkbox", "info")
            setLoading(false);
            return;
            // const response = await getAyatInfo(search || toSearch as string, filter.aya as string || null, filter.surah as string || null);
            // if (response.success) {
            //     handleResultantResponse(response.data);
            // }
            // else if (!response.success) {
            //     setLoading(false);
            // }
        }
        if(chkbox.isWord) {
            if (ayatAbortController) {
                ayatAbortController.abort();
            }
            const abortController = new AbortController();
            setAyatAbortController(abortController);
            const response = await searchAyats(searchValue || search, [], filter.surah as string, filter.aya as string, abortController);
            if (response.success) {
                setLoading(false);
                setRootLemmaData(response.otherWords.rootsWords);
                setSearchedCount(response.counts);
                setSuggestions(response.suggestions || []);
                const toFind = Array.from(new Set(Object.values(response.words.lemmas).flat()));
                setTimeout(() => {
                    setSelectedKeywords(toFind);
                }, 1000)
                const arrays = [
                    ...Object.values(response.otherWords.rootsWords.map(r => Object.values(r.lemmas)).flat())
                        .flat()
                        .map(word => ({
                            word,
                            isSelected: toFind.includes(word.word),
                        })),
                ];
                setRelatedSearch(Array.from(new Map(arrays.map((item) => [item.word.word, item])).values()) || []);
                handleResultantResponse(response.data);
                // setAyatAbortController(null);
            }
            else if (!response.success) {
                setLoading(false);
                // setAyatAbortController(null);
            }
        }
        if (chkbox.isQurana) {
            const resposne = await getQuranaInfo(searchValue || search, filter.aya as string || '0', filter.surah as string || '0');
            if (resposne.success) {
                handleResultantResponse(resposne.data);
            }
            else if (!resposne.success) {
                setLoading(false);
            }
        }
        if (chkbox.isReference) {
            await getReferenceData()
        }
        if (chkbox.isTag) {
            if (tagAbortController) {
                tagAbortController.abort();
            }
            const abortController = new AbortController();
            setTagAbortController(abortController);
            const response = await getAyatsByTag(searchValue || search, filter.surah as string || '0', filter.aya as string || '0', abortController);
            if (response.success) {
                handleResultantResponse(response.data);
            }
            else if (!response.success) {
                setLoading(false);
            }
        }
        if (chkbox.isQurany) {
            Toaster("Qurany => Not Implemented Yet")
            setLoading(false);
        }
        if (chkbox.isLemma) {
            Toaster("Lemma => Not Implemented Yet")
            setLoading(false);
        }
    }

    const getResultBasedOnSuggestedWords = async (selectedKeywords2?: string[]) => {
        window.scrollTo({ top: 0, behavior: 'smooth', left: 10 });
        if(!(chkbox.isLemma || chkbox.isQurana || chkbox.isQurany || chkbox.isTag)) {
            setLoading(true);
            setSearchedResult(()=>[]);
            setSearchedCount(prev => ({ verseCount: 0, wordCount: prev?.wordCount ?? 0 }));
            const words = selectedKeywords2?.length ? selectedKeywords2 : selectedKeywords ;
            if (ayatAbortController) {
                ayatAbortController.abort();
            }
            const abortController = new AbortController();
            setAyatAbortController(abortController);
            const response = await searchAyats("", words, filter.surah as string, filter.aya as string, abortController);
            if (response.success) {
                setSearchedCount(response.counts);
                if (rootLemmaData.length === 0) {
                    setSelectedKeywords(words);
                    const arrays = [
                        ...Object.values(response.otherWords.rootsWords.map(r => Object.values(r.lemmas)).flat())
                            .flat()
                            .map(word => ({
                                word,
                                isSelected: words.includes(word.word),
                            })),
                    ];
                    setRootLemmaData(response.otherWords.rootsWords);
                    setRelatedSearch(Array.from(new Map(arrays.map((item) => [item.word.word, item])).values()) || []);
                }
                handleResultantResponse(response.data);
            }
            else if (!response.success) {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if (checked > 0) {
            setChecked((prev) => prev - 1)
            return;
        }
        const timeId = setTimeout(() => {
            (async () => {
                await getResultBasedOnSuggestedWords();
                if (chkbox.isReference) {
                    await getReferenceData();
                }
            })()
        }, 1000);
    
        return () => clearTimeout(timeId);
    }, [selectedKeywords]);

    const handleToggle = async (values: string[]) => {
        setRelatedSearch((prev) => {
            const updatedSearch = prev.map((item) =>
                values.includes(item.word.word) ? { ...item, isSelected: !item.isSelected } : item
            );
            const newSelectedKeywords = updatedSearch.filter((rs) => rs.isSelected).map((rs) => rs.word.word);
            setSelectedKeywords(newSelectedKeywords);
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev);
                newParams.set('currentPage','1');
                return newParams;
            });
            setSearchedCount((prev) => ({
                ...prev,
                wordCount: updatedSearch.filter(e => e.isSelected).map(e => Number.parseInt(e.word.count as string)).reduce((acc, curr) => acc + curr, 0) ?? 0,
                verseCount: prev?.verseCount ?? 0,
            }))
            return updatedSearch;
        });
    };

    const isWordSelected = (word: string) => {
        return relatedSearch.some((rs) => rs.word.word === word && rs.isSelected);
    }

    const selectAllLemmaWords = (root: string, lemma: string) => {
        const lemmaWords = rootLemmaData.find((r) => r.root === root)?.lemmas[lemma] || [];
        const areAllSelected = lemmaWords.every((word) => isWordSelected(word.word));
        if (areAllSelected) {
            handleToggle(lemmaWords.map((w) => w.word));
        } else {
            handleToggle(lemmaWords.map((w) => w.word).filter((word) => !isWordSelected(word)));
        }
    }

    useEffect(() => {
        const newParams = new URLSearchParams(searchParam);

        if (search) {
            newParams.set('search', search);
        } else {
            newParams.delete('search');
        }

        if (filter.surah && filter.surah !== 0) {
            newParams.set('surah', filter.surah as string);
        } else {
            newParams.delete('surah');
        }

        if (filter.aya && filter.aya !== 0) {
            newParams.set('aya', filter.aya as string);
        } else {
            newParams.delete('aya');
        }

        if (filteredCheckBoxes.length > 0) {
            newParams.set('chkbox', filteredCheckBoxes);
        } else {
            newParams.delete('chkbox');
        }

        if (selectedKeywords.length) {
            newParams.set('selectedKeywords', selectedKeywords.join(' '));
        } else {
            newParams.delete('selectedKeywords');
        }

        setSearchParams(newParams);
    }, [search, chkbox, filter, filteredCheckBoxes, selectedKeywords])

    const surahOptions = Object.entries(surahData).map(([key, surah]) => ({
        label: `${key}. ${surah.english} (${surah.arabic})`,
        value: key,
    }));

    const ayaCount = filter.surah ? surahData[filter.surah]?.ayahs ?? 0 : 0;
    const ayaOptions = Array.from({ length: ayaCount }, (_, i) => ({
        label: (i + 1).toString(),
        value: (i + 1).toString(),
    }));

    return (
        <>
            <Box 
                sx={{ 
                    display: 'flex', 
                    padding: '40px', 
                    margin: 'auto',
                    gap: '20px', 
                    width: '70%',      
                    flexDirection: { xs: 'column', sm: 'row' }, 
                    alignItems: { xs: 'stretch', sm: 'flex-start' },
                    marginTop: { xs: 2, sm: 0 },
                    '@media (max-width: 600px)': { 
                        width: '90%', 
                        padding: '20px',
                    },
                }}
            >
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '15px', 
                        width: { xs: '100%', sm: '60%' }, 
                        marginRight: { xs: 0, sm: 10 },  
                    }}
                >
                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        value={search}
                        onChange={(e)=>handleChangeSearch(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#ffffff',
                            },
                            '& .MuiInputBase-input': {
                                fontSize: { xs: '16px', sm: '20px' },
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: { xs: '14px', sm: '16px' },
                            },
                        }}
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                setSearchParams(prev => {
                                    const newParams = new URLSearchParams(prev);
                                    newParams.set('currentPage', '1');
                                    return newParams;
                                });
                                await getResult(e);
                            }
                        }}
                    />
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            gap: '15px', 
                            flexDirection: 'row',
                            flexWrap: 'wrap', 
                        }}
                    >
                        <Autocomplete
                            options={surahOptions}
                            getOptionLabel={(option) => option.label}
                            value={surahOptions.find((option) => option.value === filter.surah) || null}
                            onChange={(_, newValue) => setFilter({ surah: newValue?.value || null, aya: null })}
                            renderInput={(params) => <TextField {...params} label="Surah" variant="filled" />}
                            sx={{
                                backgroundColor: '#ffffff',
                                borderRadius: '0px',
                                flex: '1 1 45%',
                                '& .MuiInputBase-root': {
                                    fontSize: { xs: '14px', sm: '16px' },
                                },
                            }}
                        />
                        <Autocomplete
                            options={ayaOptions}
                            getOptionLabel={(option) => option.label}
                            value={ayaOptions.find((option) => option.value === filter.aya) || null}
                            onChange={(_, newValue) => setFilter((prev) => ({ ...prev, aya: newValue?.value || null }))}
                            renderInput={(params) => <TextField {...params} label="Aya" variant="filled" />}
                            disabled={!filter.surah}
                            sx={{
                                backgroundColor: '#ffffff',
                                borderRadius: '0px',
                                flex: '1 1 45%',
                                '& .MuiInputBase-root': {
                                    fontSize: { xs: '14px', sm: '16px' },
                                },
                            }}
                        />
                    </Box>
                </Box>

                <Box 
                    sx={{ 
                        display: 'flex', 
                        gap: '5px', 
                        width: { xs: '100%', sm: '40%' },
                        flexDirection:'row' ,
                        justifyContent: { xs: 'space-between', sm: 'flex-start' },
                        paddingInline: { xs: '10px', sm: 0 },
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: {xs: 'row', sm: 'column'}, gap: '5px' }}>
                        <FormControlLabel
                            control={<Checkbox />}
                            name='isWord'
                            checked={chkbox.isWord}
                            onChange={handleChangeCheckBoxes}
                            label="Word"
                            sx={{ '& .MuiFormControlLabel-label': { fontWeight: '500' } }}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            name='isReference'
                            checked={chkbox.isReference}
                            onChange={handleChangeCheckBoxes}
                            label="Reference"
                            sx={{ '& .MuiFormControlLabel-label': { fontWeight: '500' } }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: {xs: 'row', sm: 'column'}, gap: '5px' }}>
                        <FormControlLabel
                            control={<Checkbox />}
                            name='isTag'
                            checked={chkbox.isTag}
                            onChange={handleChangeCheckBoxes}
                            label="Tag"
                            sx={{ '& .MuiFormControlLabel-label': { fontWeight: '500' } }}
                        />
                        {/* <FormControlLabel
                            control={<Checkbox />}
                            name='isQurana'
                            checked={chkbox.isQurana}
                            onChange={handleChangeCheckBoxes}
                            label="Qurana"
                            sx={{ '& .MuiFormControlLabel-label': { fontWeight: '500' } }}
                        /> */}
                    </Box>
                </Box>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: { xs: '100%', sm: '20%' },
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ 
                            padding: '12px 30px', 
                            fontSize: '16px', 
                            fontWeight: 'bold',
                            width: '100%',
                            '&:hover': {
                                backgroundColor: '#1e88e5',
                            },
                        }}
                        disabled={loading}
                        onClick={(e)=> {
                            setSearchParams(prev => {
                                const newParams = new URLSearchParams(prev);
                                newParams.set('currentPage','1');
                                return newParams;
                            });
                            getResult(e);
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                    </Button>

                    <FormControlLabel
                        control={<Checkbox />}
                        checked={showTag}
                        onChange={(_e, checked) => setShowTag(()=>checked)}
                        label="Show Tags"
                        sx={{ '& .MuiFormControlLabel-label': { fontWeight: '500' } }}
                    />
                </Box>
            </Box>

            {
                suggestions.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80%',
                            margin: '20px auto',
                            padding: '20px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center',
                        }}
                    >
                        {/* <Typography
                            sx={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: 'primary.main',
                                marginBottom: '12px',
                            }}
                        >
                            No Results for "{search}"
                        </Typography> */}
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#555',
                                marginBottom: '8px',
                            }}
                        >
                            Do you mean:
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                            }}
                        >
                            {
                                suggestions.map((sug) =>
                                    <Button
                                        key={uniqueID()}
                                        onClick={() => getResult(undefined, sug)}
                                        sx={{
                                            textTransform: 'none',
                                            padding: '6px 12px',
                                            fontSize: '14px',
                                            backgroundColor: '#e0f7fa',
                                            color: 'primary.main',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            '&:hover': {
                                                backgroundColor: '#b2ebf2',
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: '20px',
                                                fontWeight: '500',
                                                color: 'text.primary',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {sug}
                                        </Typography>
                                    </Button>
                                )
                            }
                        </Box>
                    </Box>
                )
            }

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px', width: '85%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {searchedCount?.verseCount === 0 && !loading ? (
                        <Typography variant="body2" sx={{ color: 'primary.main' }}>
                            Nothing Found
                        </Typography>
                    ) : searchedCount?.verseCount && searchedCount?.verseCount > 0 || loading ? (
                        <Box>
                            <Box display="flex" alignItems="center">
                                <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 0.5, color: 'primary.main', flex: 1 }}>
                                    Verses:
                                </Typography>
                                {loading ? (
                                    <CircularProgress size={17} color="info" />
                                ) : (
                                    <Typography variant="body2" color='info'>{searchedCount?.verseCount}</Typography>
                                )}
                            </Box>
                            {filteredCheckBoxes.split(' ').includes('isWord') && !!searchedCount?.wordCount && (
                                <Box display="flex" alignItems="center">
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 0.5, color: 'primary.main', flex: 1 }}>
                                        Words:
                                    </Typography>
                                    {loading ? (
                                        <CircularProgress size={17} color="info" />
                                    ) : (
                                        <Typography variant="body2" color='info'>{searchedCount?.wordCount}</Typography>
                                    )}
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Typography variant="body2" sx={{ color: 'primary.main' }}>
                            Enter values to search
                        </Typography>
                    )}
                </Box>
            </Box>

            { relatedSearch?.length > 0 && 
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '75%',
                        margin: '0 auto',
                        padding: '20px',
                        borderRadius: '12px',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                justifyContent: { xs: 'center', sm: 'flex-start' },
                                margin: "0 auto",
                                border: '2px solid #CCCCFF',
                                padding: '25px',
                                borderRadius: '8px',
                                width: '90%',
                                boxSizing: 'border-box',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    color: 'primary.main',
                                    marginBottom: '12px',
                                    width: '100%',
                                    textAlign: { xs: 'center', sm: 'left' },
                                }}
                            >
                                Selected Keywords ({selectedKeywords.length || relatedSearch.filter(r => r.isSelected).length}/{relatedSearch.length})
                            </Typography>

                            {relatedSearch.map((item) => (
                                item.isSelected && <Chip
                                    key={uniqueID()}
                                    label={item.word.word}
                                    sx={{
                                        backgroundColor: '#CCCCFF',
                                        color: 'primary.main',
                                        fontSize: '19px',
                                        padding: '6px 12px',
                                        borderRadius: '16px',
                                        border: '1px solid #A5A5A5',
                                        marginBottom: '6px',
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
            }

            <Box 
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    width: '70%',
                    margin: '0 auto',
                    padding: '20px',
                }}
            >

                {/* <MapDisplay maps={lemmaData} title='Lemmas' relatedWords={relatedSearch} setterFunc={handleToggle} /> */}

                {rootLemmaData && rootLemmaData.map((item) => (
                <Box key={uniqueID()} sx={{ marginBottom: 4 }}>
                    <Typography
                        variant="h4"
                        component="div"
                        sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                            marginBottom: 2,
                            position: 'relative',
                            display: 'inline-block',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: '100%',
                                height: '4px',
                                bottom: '-4px',
                                left: 0,
                                background: 'linear-gradient(90deg, #3A8DFF, #20B2AA)',
                                borderRadius: '2px',
                            },
                        }}
                    >
                        {item.root}
                    </Typography>
                    {Object.entries(item.lemmas).map(([lemma, words]) => {
                        const areAllSelected = words.every((word) => isWordSelected(word.word));
                        const isPartiallySelected = words.some((word) => isWordSelected(word.word)) && !areAllSelected;

                        return (
                            <Box
                                key={uniqueID()}
                                sx={{
                                    marginBottom: 3,
                                    display: 'grid',
                                    gridTemplateColumns: '150px auto',
                                    columnGap: '16px',
                                    alignItems: 'flex-start',
                                    '@media (max-width: 600px)': {
                                        gridTemplateColumns: '1fr',
                                    },
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: areAllSelected
                                                ? 'success.main'
                                                : isPartiallySelected
                                                ? 'warning.main'
                                                : 'secondary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginLeft: {sm: 6},
                                            marginBottom: {xs: 2},
                                            gap: 1,
                                            cursor: 'pointer',
                                            transition: 'color 0.3s ease, transform 0.2s ease',
                                            '&:hover': {
                                                color: '#20B2AA',
                                                transform: 'scale(1.05)',
                                            },
                                            '@media (max-width: 600px)': {
                                                fontSize: 16,
                                            },
                                        }}
                                        onClick={() => selectAllLemmaWords(item.root, lemma)}
                                    >
                                        {lemma}
                                        {areAllSelected ? <CheckCircleIcon color="success" /> : <RemoveCircleOutlineOutlinedIcon color="warning" />}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '8px',
                                        '@media (max-width: 600px)': {
                                            justifyContent: 'center',
                                        },
                                    }}
                                >
                                    {words.map((word) => (
                                        <Chip
                                            key={uniqueID()}
                                            label={`${word.word} - ${word.count}`}
                                            onClick={() => handleToggle([word.word])}
                                            icon={
                                                isWordSelected(word.word) ? (
                                                    <CheckCircleIcon color="inherit" />
                                                ) : (
                                                    <CheckCircleOutlineIcon />
                                                )
                                            }
                                            sx={{
                                                backgroundColor: isWordSelected(word.word)
                                                    ? 'success.light'
                                                    : '#CCCCFF',
                                                color: isWordSelected(word.word) ? 'white' : 'primary.main',
                                                fontSize: '16px',
                                                padding: '6px 12px',
                                                borderRadius: '16px',
                                                '&:hover': {
                                                    backgroundColor: isWordSelected(word.word)
                                                        ? 'success.dark'
                                                        : '#B3B3FF',
                                                },
                                                '@media (max-width: 600px)': {
                                                    fontSize: '14px',
                                                },
                                            }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            ))}
            </Box>
        </>
    )
}

export default SearchForm;
