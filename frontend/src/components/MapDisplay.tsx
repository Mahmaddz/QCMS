import { Box, Chip, Typography } from '@mui/material';
import { MAP } from '../types/map';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import uniqueID from '../utils/helper/UniqueID';

const MapDisplay = ({ maps, title, setterFunc, relatedWords }: { maps: MAP | undefined, title: string, setterFunc: (val: string) => Promise<void>, relatedWords: { word: string, isSelected: boolean }[] }) => {
    return (
        <Box sx={{ padding: '16px' }}>
            <Box>
                <Typography
                    variant="h5"
                    component="span"
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                    }}
                >
                    {title}
                </Typography>

                {maps && Object.entries(maps).map(([root, words]) => (
                    <Box
                        key={uniqueID()}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            marginTop: 2,
                            marginBottom: 4,
                        }}
                    >
                        <Typography
                            key={uniqueID()}
                            variant="h6"
                            component="span"
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                marginRight: '16px',
                                textAlign: 'right',
                            }}
                        >
                            {root}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }} key={uniqueID()}>
                            {words.map((word) => (
                                <Chip
                                    key={uniqueID()}
                                    label={word}
                                    onClick={() => setterFunc(word)}
                                    icon={
                                        relatedWords.filter(item => item.word === word)[0].isSelected ? (
                                            <CheckCircleIcon color="inherit" />
                                        ) : (
                                            <CheckCircleOutlineIcon />
                                        )
                                    }
                                    sx={{
                                        backgroundColor: '#CCCCFF',
                                        color: 'primary.main',
                                        fontSize: '19px',
                                        padding: '6px 12px',
                                        borderRadius: '16px',
                                        '&:hover': {
                                            backgroundColor: '#B3B3FF',
                                        },
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
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default MapDisplay;
