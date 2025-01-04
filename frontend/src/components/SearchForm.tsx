/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Checkbox, FormControlLabel, InputAdornment, TextField, Typography, CircularProgress, Chip } from '@mui/material';
import { useState, useEffect } from 'react';
import { FilterStateParams, SearchFormParam } from '../interfaces/SearchForm';
import { getQuranaInfo } from '../services/Search/getQuranaInfo.service';
import Toaster from '../utils/helper/Toaster';
import { getAyatInfo } from '../services/Search/getAyatInfo.service';
import { searchAyats } from '../services/Search/getAyats.service';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import uniqueID from '../utils/helper/UniqueID';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

type CheckboxState = {
    isLemma: boolean;
    isTag: boolean;
    isReference: boolean;
    isDefault: boolean;
    isQurana: boolean;
    isQurany: boolean;
};

const SearchForm = ({ showTag, setShowTag, setSearchedResult, toSearch, selectedKeywords, setSelectedKeywords }: SearchFormParam) => {

    const [relatedSearch, setRelatedSearch] = useState<{word: {word: string, count: number | string}, isSelected: boolean}[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [searchedCount, setSearchedCount] = useState<number>(-1);
    const [checked, setChecked] = useState({allSelect: true, firstRender: true});
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<FilterStateParams>({ surah: 0, aya: 0 });
    const [search, setSearch] = useState<string>(toSearch || "");
    const [chkbox, setChkBox] = useState({
        isLemma: false,
        isTag: false,
        isReference: false,
        isDefault: true,
        isQurana: false,
        isQurany: false
    }); 
    const [rootLemmaData, setRootLemmaData] = useState<{ root: string; lemmas: { [lemma: string]: {word: string, count: string | number}[]; }; }[]>([]);

    useEffect(() => {
        if (toSearch) {
            (async () => {
                await getResult();
            })()
        }
    }, [toSearch])

    const handleChangeSearch = (value: string) => setSearch(value);

    const handleChangeCheckBoxes = (e: React.SyntheticEvent<Element, Event>, checked: boolean) => {
        e.preventDefault();
        const {name} = e.target as HTMLInputElement;
        setChkBox((prev) => {
            const updatedState: CheckboxState = Object.keys(prev).reduce((acc, key) => {
                acc[key as keyof CheckboxState] = key === name ? checked : false;
                return acc;
            }, {} as CheckboxState);
            return updatedState;
        });
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
        const uniqueData = filterUniqueBySura(data);
        // setSearchedCount((prev) => (prev ? uniqueData?.length + prev : uniqueData?.length));
        setSearchedCount(uniqueData?.length || 0)
        setSearchedResult(uniqueData);
        // setSearchedResult((prev) => { return prev ? [ ...prev, ...uniqueData] : [...uniqueData]});
        setChecked((prev) => ({
            ...prev,
            firstRender: false
        }))
    }

    const getResult = async () => {

        setLoading(true);
        setSuggestions([]);
        setSearchedResult([]);
        setSearchedCount(0);
        setSelectedKeywords([]);
        setRelatedSearch([]);
        setRootLemmaData([]);

        setChecked((prev) => ({
            ...prev,
            firstRender: true,
        }))

        if (!(chkbox.isLemma || chkbox.isQurana || chkbox.isQurany || chkbox.isTag || chkbox.isDefault || chkbox.isReference)) {
            const response = await getAyatInfo(search || toSearch as string, filter.aya as string || null, filter.surah as string || null);
            if (response.success) {
                handleResultantResponse(response.data);
            }
            else if (!response.success) {
                setLoading(false);
            }
        }
        if(chkbox.isDefault) {
            const response = await searchAyats(search);
            if (response.success) {
                setLoading(false);
                setRootLemmaData(response.otherWords.rootsWords);
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
            }
        }
        if (chkbox.isQurana) {
            const resposne = await getQuranaInfo(search, filter.aya as string || '0', filter.surah as string || '0');
            if (resposne.success) {
                handleResultantResponse(resposne.data);
            }
            else if (!resposne.success) {
                setLoading(false);
            }
        }
        if (chkbox.isReference) {
            Toaster("Reference => Not Implemented Yet")
            setLoading(false);
        }
        if (chkbox.isTag) {
            Toaster("Tags => Not Implemented Yet")
            setLoading(false);
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

    const getResultBasedOnSuggestedWords = async () => {
        window.scrollTo({ top: 0, behavior: 'smooth', left: 10 });
        if(!(chkbox.isLemma || chkbox.isQurana || chkbox.isQurany || chkbox.isTag)) {
            setLoading(true);
            setSearchedResult([]);
            setSearchedCount(0);
            const response = await searchAyats("", selectedKeywords);
            if (response.success) {
                // setRelatedSearch(response.searchedFor);
                handleResultantResponse(response.data);
            }
            else if (!response.success) {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if (checked.firstRender) {
            return;
        }
        const timeId = setTimeout(() => {
            getResultBasedOnSuggestedWords();
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
            return updatedSearch;
        });
    };

    const isWordSelected = (word: string) => {
        return relatedSearch.some(rs => rs.word.word === word && rs.isSelected);
    }

    const selectAllLemmaWords = (root: string, lemma: string) => {
        const lemmaWords = rootLemmaData.find((r) => r.root === root)?.lemmas[lemma] || [];
        const areAllSelected = lemmaWords.every((word) => isWordSelected(word.word));
        if (areAllSelected) {
            handleToggle(lemmaWords.map(w => w.word));
        } else {
            handleToggle(lemmaWords.map(w => w.word).filter((word) => !isWordSelected(word)));
        }
    }

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
                onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                        await getResult();
                    }
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
                                fontSize: '20px',
                            },
                            '& .MuiInputLabel-root': {
                                fontSize: '16px',
                            },
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
                        <TextField
                            label="Surah"
                            variant="filled"
                            fullWidth
                            value={filter?.surah}
                            onChange={(e) => setFilter((prev) => ({ ...prev, surah: e.target.value }))}
                            InputProps={{
                                endAdornment: (
                                <InputAdornment position="end">
                                    <FilterAltIcon />
                                </InputAdornment>
                                ),
                            }}
                            sx={{
                                backgroundColor: '#ffffff',
                                borderRadius: '0px',
                                flex: '1 1 45%', 
                            }}
                        />
                        <TextField
                            label="Aya"
                            variant="filled"
                            fullWidth
                            value={filter?.aya}
                            onChange={(e) => setFilter((prev) => ({ ...prev, aya: e.target.value }))}
                            InputProps={{
                                endAdornment: (
                                <InputAdornment position="end">
                                    <FilterAltIcon />
                                </InputAdornment>
                                ),
                            }}
                            sx={{
                                backgroundColor: '#ffffff',
                                borderRadius: '0px',
                                flex: '1 1 45%',
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
                            name='isDefault'
                            checked={chkbox.isDefault}
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
                        onClick={getResult}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                    </Button>

                    <FormControlLabel
                        control={<Checkbox />}
                        checked={showTag}
                        onChange={(_e, checked) => setShowTag(checked)}
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
                        <Typography
                            sx={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: 'primary.main',
                                marginBottom: '12px',
                            }}
                        >
                            No Results for "{search}"
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#555',
                                marginBottom: '8px',
                            }}
                        >
                            Did you mean:
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
                                        onClick={() => setSearch(sug)}
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

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px', width: '85%', gap: 3 }}>
                <Typography variant="body2" sx={{ color: 'primary.main' }}>
                    {searchedCount === 0 ? (
                        "Nothing Found"
                    ) : searchedCount > 0 ? (
                        <>
                            <Box component="span" sx={{ fontWeight: 'bold' }}>
                                {searchedCount}
                            </Box>{" "}
                            search results
                        </>
                    ) : (
                        "Enter values to search"
                    )}
                </Typography>
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
