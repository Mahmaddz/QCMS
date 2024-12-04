import { Box, Button, Checkbox, Divider, FormControlLabel, InputAdornment, TextField, Tooltip, Typography, CircularProgress, Chip, Switch } from '@mui/material';
import { useState } from 'react';
import { FilterStateParams, SearchFormParam } from '../interfaces/SearchForm';
import { getQuranaInfo } from '../services/Search/getQuranaInfo.service';
import Toaster from '../utils/helper/Toaster';
import { getAyatInfo } from '../services/Search/getAyatInfo.service';
import { searchAyats } from '../services/Search/getAyats.service';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import SelectAllIcon from '@mui/icons-material/SelectAll';
// import DeselectIcon from '@mui/icons-material/Deselect';
// import CloseIcon from "@mui/icons-material/Close";


const SearchForm = ({ showTag, setShowTag, setSearchedResult }: SearchFormParam) => {

    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [relatedSearch, setRelatedSearch] = useState<string[]>([]);
    const [searchedCount, setSearchedCount] = useState<number>(-1);
    const [checked, setChecked] = useState(true);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<FilterStateParams>({ surah: 0, aya: 0 });
    const [search, setSearch] = useState<string>("");
    const [chkbox, setChkBox] = useState({
        isLemma: false,
        isTag: false,
        isQurana: false,
        isQurany: false
    }); 

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
        if (checked) {
            setSelectedKeywords([])
        }
        else {
            setSelectedKeywords([...relatedSearch])
        }
    };

    const handleChangeSearch = (value: string) => setSearch(value);

    const handleChangeCheckBoxes = (e: React.SyntheticEvent<Element, Event>, checked: boolean) => {
        e.preventDefault();
        const {name} = e.target as HTMLInputElement;
        setChkBox((prev) => ({
            ...prev,
            [name]: checked
        }));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filterUniqueBySura = (array: any[]) => {
        return array?.filter((item, index, self) =>
            index === self.findIndex((t) => t.suraNo === item.suraNo && t.ayaNo === item.ayaNo)
        ) || [];
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleResultantResponse = (data: any[]) => {
        const uniqueData = filterUniqueBySura(data);
        setSearchedCount((prev) => (prev ? uniqueData?.length + prev : uniqueData?.length));
        setSearchedResult((prev) => { return prev ? [ ...prev, ...uniqueData] : [...uniqueData]});
        setLoading(false);
    }

    const getResult = async () => {

        setLoading(true);
        setSuggestions([]);
        setSearchedResult([]);
        setSearchedCount(0);
        setSelectedKeywords([]);
        setRelatedSearch([]);
        
        if(!(chkbox.isLemma || chkbox.isQurana || chkbox.isQurany || chkbox.isTag)) {
            const response = await searchAyats(search);
            setSuggestions(response.suggestions || []);
            setRelatedSearch(response.searchedFor);
            setSelectedKeywords(response.searchedFor);
            handleResultantResponse(response.data);
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
        if (chkbox.isLemma) {
            const response = await getAyatInfo(search, filter.aya as string || null, filter.surah as string || null);
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
        if (chkbox.isTag) {
            Toaster("Tags => Not Implemented Yet")
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

    const handleToggle = (item: string) => {
        setSelectedKeywords((prevSelectedWords) => {
            if (prevSelectedWords.includes(item)) {
                return prevSelectedWords.filter((word) => word !== item);
            } else {
                return [...prevSelectedWords, item];
            }
        });
    };

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
                {/* First Box: Search and Filters */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '15px', 
                        width: { xs: '100%', sm: '60%' }, 
                        marginRight: { xs: 0, sm: 10 },  
                    }}
                >
                    {/* Search Field */}
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

                    {/* Filters in Flex Row */}
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

                {/* Second Box: Checkboxes */}
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
                    {/* Checkboxes in two columns */}
                    <Box sx={{ display: 'flex', flexDirection: {xs: 'row', sm: 'column'}, gap: '5px' }}>
                        <FormControlLabel
                            control={<Checkbox />}
                            name='isLemma'
                            checked={chkbox.isLemma}
                            onChange={handleChangeCheckBoxes}
                            label="Lemma"
                            sx={{ '& .MuiFormControlLabel-label': { fontWeight: '500' } }}
                        />
                        <FormControlLabel
                            control={<Checkbox />}
                            name='isQurany'
                            checked={chkbox.isQurany}
                            onChange={handleChangeCheckBoxes}
                            label="Qurany"
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
                        <FormControlLabel
                            control={<Checkbox />}
                            name='isQurana'
                            checked={chkbox.isQurana}
                            onChange={handleChangeCheckBoxes}
                            label="Qurana"
                            sx={{ '& .MuiFormControlLabel-label': { fontWeight: '500' } }}
                        />
                    </Box>
                </Box>

                {/* Third Box: Search Button */}
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
                                suggestions.map((sug, index) =>
                                    <Button
                                        key={index}
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

            {
                relatedSearch?.length > 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '75%',
                            margin: '0 auto',
                            padding: '20px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: '20px',
                                    color: 'primary.main',
                                    marginBottom: '12px',
                                    flex: 1
                                }}
                            >
                                Searched For
                            </Typography>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px' 
                                }}
                            >
                                <Tooltip title='Select All' arrow>
                                    <Switch
                                        checked={checked}
                                        onChange={handleChange}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                </Tooltip>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: '12px', justifyContent: { xs: 'flex-start', sm: 'space-between' },  }}>
                            {relatedSearch.map((item) => (
                                <Chip
                                    key={item}
                                    label={item}
                                    onClick={() => handleToggle(item)}
                                    icon={
                                        selectedKeywords.includes(item) ? (
                                            <CheckCircleIcon color='inherit' />
                                        ) : (
                                            <CheckCircleOutlineIcon  />
                                        )
                                    }
                                    sx={{
                                        backgroundColor: '#CCCCFF',
                                        color: 'primary.main',
                                        fontSize: '19px',
                                        padding: '6px 12px',
                                        borderRadius: '16px',
                                        '& .MuiChip-deleteIcon': {
                                            color: 'primary.main',
                                            '&:hover': {
                                                color: 'primary.dark',
                                            },
                                        },
                                    }}
                                />
                            ))}
                        </Box>                     
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                    marginTop: '30px',
                                    justifyContent: { xs: 'center', sm: 'flex-start' },
                                    border: '2px solid #CCCCFF',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    width: '95%',
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
                                    Selected Keywords:
                                </Typography>

                                {selectedKeywords.map((item, index) => (
                                    <Chip
                                        key={index}
                                        label={item}
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

                            <Tooltip title="Hit Filter" arrow>
                                <FilterAltIcon
                                    color="primary"
                                    fontSize="large"
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            color: 'action.dark',
                                            transition: 'transform 0.3s ease, color 0.3s ease',
                                        },
                                        transition: 'color 0.3s ease',
                                        marginLeft: '16px',
                                    }}
                                    onClick={getResultBasedOnSuggestedWords}
                                />
                            </Tooltip>
                        </Box>
                    </Box>
                )
            }

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px', width: '85%', gap: 3 }}>
                <Typography variant="body2" sx={{ color: 'primary.main' }}>
                    {
                        searchedCount === 0 ? "Nothing Found" 
                        : 
                        searchedCount > 0 ? `${searchedCount} search results`
                        : 
                        "Enter values to search"
                    }
                </Typography>
            </Box>

            <Divider sx={{ width: '80%', margin: '20px auto', height: '2px', backgroundColor: 'primary.main' }} />
        </>
    )
}

export default SearchForm;
